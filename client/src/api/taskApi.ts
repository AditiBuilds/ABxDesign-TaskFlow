import {
  TaskFilterParams,
  TaskFormData,
  TaskResponse,
  TasksResponse,
  TaskStatsResponse,
  TaskStatus,
} from '../types/task';

const BASE_URL = '/api/tasks';

class ApiError extends Error {
  errors?: Array<{ field: string; message: string }>;
  statusCode?: number;

  constructor(message: string, statusCode?: number, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data?.errors);
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Network error occurred. Please check your connection.');
  }
}

export const taskApi = {
  // Get all tasks with query params
  async getTasks(params: TaskFilterParams = {}): Promise<TasksResponse> {
    const query = new URLSearchParams();

    if (params.search && params.search.trim()) query.set('search', params.search.trim());
    if (params.status && params.status !== 'ALL') query.set('status', params.status);
    if (params.priority && params.priority !== 'ALL') query.set('priority', params.priority);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.order) query.set('order', params.order);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());

    const qs = query.toString();
    const endpoint = qs ? `${BASE_URL}?${qs}` : BASE_URL;

    return request<TasksResponse>(endpoint);
  },

  // Get task stats
  async getStats(): Promise<TaskStatsResponse> {
    return request<TaskStatsResponse>(`${BASE_URL}/stats/summary`);
  },

  // Get single task by ID
  async getTaskById(id: string): Promise<TaskResponse> {
    return request<TaskResponse>(`${BASE_URL}/${id}`);
  },

  // Create task
  async createTask(formData: TaskFormData): Promise<TaskResponse> {
    return request<TaskResponse>(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      }),
    });
  },

  // Update entire task
  async updateTask(id: string, formData: Partial<TaskFormData>): Promise<TaskResponse> {
    const payload: Record<string, any> = {};
    if (formData.title !== undefined) payload.title = formData.title;
    if (formData.description !== undefined) payload.description = formData.description || null;
    if (formData.status !== undefined) payload.status = formData.status;
    if (formData.priority !== undefined) payload.priority = formData.priority;
    if (formData.dueDate !== undefined) {
      payload.dueDate = formData.dueDate ? new Date(formData.dueDate).toISOString() : null;
    }

    return request<TaskResponse>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Update status only
  async updateStatus(id: string, status: TaskStatus): Promise<TaskResponse> {
    return request<TaskResponse>(`${BASE_URL}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Delete task
  async deleteTask(id: string): Promise<{ success: boolean; message: string; data: { id: string } }> {
    return request<{ success: boolean; message: string; data: { id: string } }>(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
  },
};
