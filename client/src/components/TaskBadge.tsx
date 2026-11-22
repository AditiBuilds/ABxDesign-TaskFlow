import React from 'react';
import { TaskPriority, TaskStatus } from '../types/task';
import { getPriorityLabel, getStatusLabel } from '../utils/formatters';
import { Clock, PlayCircle, CheckCircle2, AlertTriangle, ShieldAlert, ArrowDown } from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSmall = size === 'sm';

  switch (status) {
    case 'PENDING':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 ${
            isSmall ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
          }`}
        >
          <Clock className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {getStatusLabel(status)}
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 ${
            isSmall ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
          }`}
        >
          <PlayCircle className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {getStatusLabel(status)}
        </span>
      );
    case 'COMPLETED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 ${
            isSmall ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
          }`}
        >
          <CheckCircle2 className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {getStatusLabel(status)}
        </span>
      );
    default:
      return null;
  }
};

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const isSmall = size === 'sm';

  switch (priority) {
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 ${
            isSmall ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
          }`}
        >
          <ShieldAlert className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {getPriorityLabel(priority)}
        </span>
      );
    case 'MEDIUM':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 ${
            isSmall ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
          }`}
        >
          <AlertTriangle className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {getPriorityLabel(priority)}
        </span>
      );
    case 'LOW':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200/60 ${
            isSmall ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
          }`}
        >
          <ArrowDown className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {getPriorityLabel(priority)}
        </span>
      );
    default:
      return null;
  }
};
