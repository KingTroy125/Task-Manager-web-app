import React, { useState } from 'react';
import { Task } from '../types';
import { Check, Edit, Trash, X, Save } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, title: string, description: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onToggleComplete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(task.id, editTitle, editDescription);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group mb-3 rounded-lg border p-4 shadow-sm transition-all ${
        task.completed ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Task title"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Task description"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  <Save size={16} className="mr-1" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center rounded bg-gray-300 px-3 py-1 text-sm hover:bg-gray-400"
                >
                  <X size={16} className="mr-1" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center">
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                    task.completed
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {task.completed && <Check size={12} />}
                </button>
                <h3
                  className={`text-lg font-medium ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                  }`}
                >
                  {task.title}
                </h3>
              </div>
              {task.description && (
                <p
                  className={`mt-1 text-sm ${
                    task.completed ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {task.description}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                Created: {formatDate(task.createdAt)}
              </p>
            </>
          )}
        </div>
        
        <div className="ml-4 flex items-start space-x-1">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-500"
                aria-label="Edit task"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                aria-label="Delete task"
              >
                <Trash size={18} />
              </button>
              <div
                {...listeners}
                className="cursor-grab rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="5" r="1" />
                  <circle cx="9" cy="12" r="1" />
                  <circle cx="9" cy="19" r="1" />
                  <circle cx="15" cy="5" r="1" />
                  <circle cx="15" cy="12" r="1" />
                  <circle cx="15" cy="19" r="1" />
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};