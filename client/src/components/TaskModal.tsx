import React, { useState, useEffect } from 'react';
import { Task, TaskFormData, TaskPriority, TaskStatus } from '../types/task';
import { X, AlertCircle, Loader2, Check } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TaskFormData) => Promise<void>;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'PENDING',
    priority: 'MEDIUM',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      let formattedDate = '';
      if (initialTask.dueDate) {
        try {
          formattedDate = new Date(initialTask.dueDate).toISOString().split('T')[0];
        } catch {
          formattedDate = '';
        }
      }

      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        status: initialTask.status || 'PENDING',
        priority: initialTask.priority || 'MEDIUM',
        dueDate: formattedDate,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: '',
      });
    }
    setErrors({});
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.trim().length > 150) {
      newErrors.title = 'Title cannot exceed 150 characters';
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e: any) => {
          if (e.field) fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ form: err.message || 'An error occurred while saving the task.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {initialTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.form && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="task-title" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{formData.title.length}/150</span>
            </div>
            <input
              id="task-title"
              type="text"
              placeholder="e.g., Implement OAuth authentication flow"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                errors.title
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="task-desc" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Description
              </label>
              <span className="text-[11px] text-slate-400">{formData.description.length}/2000</span>
            </div>
            <textarea
              id="task-desc"
              rows={3}
              placeholder="Add key requirements, acceptance criteria, or relevant links..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['LOW', 'MEDIUM', 'HIGH'] as TaskPriority[]).map((p) => {
                const isSelected = formData.priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? p === 'HIGH'
                          ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs ring-1 ring-rose-400'
                          : p === 'MEDIUM'
                          ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs ring-1 ring-amber-400'
                          : 'bg-slate-100 border-slate-300 text-slate-800 shadow-xs ring-1 ring-slate-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {p.charAt(0) + p.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status & Due Date row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label htmlFor="task-status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                id="task-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="task-due-date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <input
                  id="task-due-date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-sm shadow-indigo-600/30 transition-all"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
