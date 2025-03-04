import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (title: string, description: string) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title, description);
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!isExpanded && e.target.value) {
              setIsExpanded(true);
            }
          }}
          onFocus={() => setIsExpanded(true)}
          placeholder="Add a new task..."
          className="w-full border-none px-4 py-3 text-gray-700 outline-none"
        />
        
        {isExpanded && (
          <>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description (optional)"
              className="w-full border-t border-gray-200 px-4 py-3 text-gray-700 outline-none"
              rows={2}
            />
            
            <div className="flex justify-between border-t border-gray-200 bg-gray-50 px-4 py-2">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setTitle('');
                  setDescription('');
                }}
                className="rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center rounded bg-blue-500 px-4 py-1 text-sm font-medium text-white hover:bg-blue-600"
                disabled={!title.trim()}
              >
                <PlusCircle size={16} className="mr-1" />
                Add Task
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};