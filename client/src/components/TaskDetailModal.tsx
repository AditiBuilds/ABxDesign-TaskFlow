import React, { useEffect } from 'react';
import { Task, TaskStatus } from '../types/task';
import { PriorityBadge, StatusBadge } from './TaskBadge';
import { formatDate, formatDateTime, isOverdue } from '../utils/formatters';
import { X, Calendar, Clock, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with status ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{task.title}</h2>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Description
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[90px]">
              {task.description || (
                <span className="italic text-slate-400">No detailed description provided for this task.</span>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/60 border border-slate-100 text-xs text-slate-600">
            {/* Due date */}
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-slate-400 font-medium">Due Date</p>
                <p
                  className={`font-semibold ${
                    overdue ? 'text-rose-600 flex items-center gap-1' : 'text-slate-800'
                  }`}
                >
                  {overdue && <AlertCircle className="w-3.5 h-3.5 inline text-rose-500" />}
                  {formatDate(task.dueDate)}
                </p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-slate-400 font-medium">Created</p>
                <p className="font-semibold text-slate-800">{formatDateTime(task.createdAt)}</p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-2.5 sm:col-span-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-slate-400 font-medium">Last Modified</p>
                <p className="font-semibold text-slate-800">{formatDateTime(task.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Status Progression Quick Buttons */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quick Progress Update
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                disabled={task.status === 'PENDING'}
                onClick={() => onStatusChange(task.id, 'PENDING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  task.status === 'PENDING'
                    ? 'bg-amber-100 border-amber-300 text-amber-800 cursor-default'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Mark Pending
              </button>
              <button
                disabled={task.status === 'IN_PROGRESS'}
                onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  task.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 border-blue-300 text-blue-800 cursor-default'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Mark In Progress
              </button>
              <button
                disabled={task.status === 'COMPLETED'}
                onClick={() => onStatusChange(task.id, 'COMPLETED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  task.status === 'COMPLETED'
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800 cursor-default'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Mark Completed
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/80 border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              onDelete(task);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Task
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
