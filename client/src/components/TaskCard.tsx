import React from 'react';
import { Task, TaskStatus } from '../types/task';
import { PriorityBadge, StatusBadge } from './TaskBadge';
import { formatDate, isOverdue } from '../utils/formatters';
import { Calendar, Edit2, Trash2, Eye, AlertCircle, CheckCircle, Clock, PlayCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top accent line based on status */}
      <div
        className={`h-1 w-full ${
          task.status === 'COMPLETED'
            ? 'bg-emerald-500'
            : task.status === 'IN_PROGRESS'
            ? 'bg-blue-500'
            : 'bg-amber-400'
        }`}
      />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <PriorityBadge priority={task.priority} size="sm" />
          <StatusBadge status={task.status} size="sm" />
        </div>

        {/* Title */}
        <h3
          onClick={() => onView(task)}
          className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer mb-2"
          title={task.title}
        >
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">
          {task.description || <span className="italic text-slate-400">No description provided</span>}
        </p>

        {/* Due Date Indicator */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span
            className={`font-medium ${
              overdue ? 'text-rose-600 font-semibold flex items-center gap-1' : 'text-slate-600'
            }`}
          >
            {overdue && <AlertCircle className="w-3.5 h-3.5 inline text-rose-500" />}
            {formatDate(task.dueDate)}
          </span>
        </div>
      </div>

      {/* Footer Quick Action Bar */}
      <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Quick status selector */}
        <div className="flex items-center gap-1">
          {task.status !== 'PENDING' && (
            <button
              onClick={() => onStatusChange(task.id, 'PENDING')}
              title="Set to Pending"
              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
            </button>
          )}
          {task.status !== 'IN_PROGRESS' && (
            <button
              onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
              title="Set to In Progress"
              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5" />
            </button>
          )}
          {task.status !== 'COMPLETED' && (
            <button
              onClick={() => onStatusChange(task.id, 'COMPLETED')}
              title="Mark as Completed"
              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(task)}
            title="View Details"
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            title="Delete Task"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
