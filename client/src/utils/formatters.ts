import { TaskPriority, TaskStatus } from '../types/task';

export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function isOverdue(dueDateString?: string | null, status?: TaskStatus): boolean {
  if (!dueDateString || status === 'COMPLETED') return false;
  const due = new Date(dueDateString);
  const now = new Date();
  // Clear times to compare dates fairly
  return due.getTime() < now.getTime();
}

export function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    default:
      return status;
  }
}

export function getPriorityLabel(priority: TaskPriority): string {
  switch (priority) {
    case 'LOW':
      return 'Low';
    case 'MEDIUM':
      return 'Medium';
    case 'HIGH':
      return 'High';
    default:
      return priority;
  }
}
