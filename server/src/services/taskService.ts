import prisma from '../config/db';
import { AppError } from '../middleware/errorHandler';
import { CreateTaskInput, QueryTasksInput, UpdateTaskInput } from '../validators/taskValidator';
import { Prisma, TaskStatus, TaskPriority } from '@prisma/client';

export class TaskService {
  /**
   * Retrieve tasks with filtering, search, sorting, and pagination
   */
  async getAllTasks(query: QueryTasksInput) {
    const {
      search,
      status,
      priority,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 50,
    } = query;

    const where: Prisma.TaskWhereInput = {};

    // Search in title and description
    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    // Filter by status if specified and not 'ALL'
    if (status && status !== 'ALL') {
      where.status = status as TaskStatus;
    }

    // Filter by priority if specified and not 'ALL'
    if (priority && priority !== 'ALL') {
      where.priority = priority as TaskPriority;
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: {
          [sortBy]: order,
        },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Retrieve a single task by ID
   */
  async getTaskById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new AppError(`Task with ID '${id}' not found`, 404);
    }

    return task;
  }

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskInput) {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        status: data.status || 'PENDING',
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    return task;
  }

  /**
   * Update an existing task
   */
  async updateTask(id: string, data: UpdateTaskInput) {
    // Check if task exists
    await this.getTaskById(id);

    const updateData: Prisma.TaskUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return updatedTask;
  }

  /**
   * Update task status
   */
  async updateTaskStatus(id: string, status: TaskStatus) {
    await this.getTaskById(id);

    return prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string) {
    await this.getTaskById(id);

    await prisma.task.delete({
      where: { id },
    });

    return { message: 'Task deleted successfully', id };
  }

  /**
   * Aggregated statistics for the dashboard summary
   */
  async getTaskStats() {
    const now = new Date();

    const [total, pending, inProgress, completed, overdue, highPriority] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: 'PENDING' } }),
      prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { status: 'COMPLETED' } }),
      prisma.task.count({
        where: {
          dueDate: { lt: now },
          status: { not: 'COMPLETED' },
        },
      }),
      prisma.task.count({ where: { priority: 'HIGH' } }),
    ]);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      highPriority,
      completionRate,
    };
  }
}

export const taskService = new TaskService();
