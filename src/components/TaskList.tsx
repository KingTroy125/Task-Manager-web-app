import React from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, title: string, description: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onToggleComplete,
  onEdit,
}) => {
  const taskIds = tasks.map((task) => task.id);

  return (
    <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
      <div>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12 text-center">
            <svg
              className="mb-2 h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500">No tasks yet. Add a task to get started!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </SortableContext>
  );
};