export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  highPriority: number;
  completionRate: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TasksResponse {
  success: boolean;
  message: string;
  data: Task[];
  pagination: PaginationMeta;
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export interface TaskStatsResponse {
  success: boolean;
  message: string;
  data: TaskStats;
}

export interface TaskFilterParams {
  search?: string;
  status?: TaskStatus | 'ALL';
  priority?: TaskPriority | 'ALL';
  sortBy?: 'createdAt' | 'dueDate' | 'title' | 'priority' | 'status';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}
