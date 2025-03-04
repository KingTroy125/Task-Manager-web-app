import React, { useState, useCallback } from 'react';
import { Task } from './types';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CheckSquare, ListTodo } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === active.id);
        const newIndex = tasks.findIndex((task) => task.id === over.id);
        
        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
  };

  const addTask = useCallback((title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, [setTasks]);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, [setTasks]);

  const editTask = useCallback((id: string, title: string, description: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, title, description } : task
      )
    );
  }, [setTasks]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Task Manager</h1>
          <p className="text-gray-600">Organize your tasks with drag and drop</p>
        </header>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <TaskForm onAddTask={addTask} />

          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`flex items-center rounded-md px-3 py-1 text-sm ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ListTodo size={16} className="mr-1" />
                All ({tasks.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`flex items-center rounded-md px-3 py-1 text-sm ${
                  filter === 'active'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
                Active ({activeCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`flex items-center rounded-md px-3 py-1 text-sm ${
                  filter === 'completed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <CheckSquare size={16} className="mr-1" />
                Completed ({completedCount})
              </button>
            </div>

            {completedCount > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all completed tasks?')) {
                    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
                  }
                }}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear completed
              </button>
            )}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <TaskList
              tasks={filteredTasks}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
              onEdit={editTask}
            />
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default App;