import { z } from 'zod';

export const TaskStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);
export const TaskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Task title is required' })
      .trim()
      .min(3, 'Title must be at least 3 characters long')
      .max(150, 'Title cannot exceed 150 characters'),
    description: z
      .string()
      .trim()
      .max(2000, 'Description cannot exceed 2000 characters')
      .optional()
      .nullable(),
    status: TaskStatusEnum.optional().default('PENDING'),
    priority: TaskPriorityEnum.optional().default('MEDIUM'),
    dueDate: z
      .string()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: 'Invalid date format for dueDate',
      })
      .optional()
      .nullable(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID format'),
  }),
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(3, 'Title must be at least 3 characters long')
        .max(150, 'Title cannot exceed 150 characters')
        .optional(),
      description: z
        .string()
        .trim()
        .max(2000, 'Description cannot exceed 2000 characters')
        .optional()
        .nullable(),
      status: TaskStatusEnum.optional(),
      priority: TaskPriorityEnum.optional(),
      dueDate: z
        .string()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
          message: 'Invalid date format for dueDate',
        })
        .optional()
        .nullable(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

export const updateTaskStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID format'),
  }),
  body: z.object({
    status: TaskStatusEnum,
  }),
});

export const getTaskByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID format'),
  }),
});

export const queryTasksSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    status: z.enum(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
    priority: z.enum(['ALL', 'LOW', 'MEDIUM', 'HIGH']).optional(),
    sortBy: z.enum(['createdAt', 'dueDate', 'title', 'priority', 'status']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(50),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>['body'];
export type QueryTasksInput = z.infer<typeof queryTasksSchema>['query'];
