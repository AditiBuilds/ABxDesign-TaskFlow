import React from 'react';
import { Task, TaskStatus } from '../types/task';
import { PriorityBadge } from './TaskBadge';
import { formatDate, isOverdue } from '../utils/formatters';
import { Eye, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';

interface TaskTableRowProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export const TaskTableRow: React.FC<TaskTableRowProps> = ({
  task,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-200/60 group">
      {/* Task Title & Description */}
      <td className="py-4 px-4 sm:px-6">
        <div className="flex flex-col">
          <span
            onClick={() => onView(task)}
            className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer"
          >
            {task.title}
          </span>
          {task.description && (
            <span className="text-xs text-slate-500 line-clamp-1 max-w-md mt-0.5">
              {task.description}
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4 whitespace-nowrap">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="text-xs font-medium rounded-lg border border-slate-200 bg-white py-1.5 px-2.5 text-slate-700 shadow-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </td>

      {/* Priority */}
      <td className="py-4 px-4 whitespace-nowrap">
        <PriorityBadge priority={task.priority} size="sm" />
      </td>

      {/* Due Date */}
      <td className="py-4 px-4 whitespace-nowrap text-xs">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className={`font-medium ${overdue ? 'text-rose-600 font-semibold' : 'text-slate-600'}`}>
            {overdue && <AlertCircle className="w-3 h-3 inline mr-1 text-rose-500" />}
            {formatDate(task.dueDate)}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right text-xs">
        <div className="flex items-center justify-end gap-1.5">
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
      </td>
    </tr>
  );
};
