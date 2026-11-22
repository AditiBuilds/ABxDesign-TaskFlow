import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/taskService';
import { QueryTasksInput } from '../validators/taskValidator';

export class TaskController {
  /**
   * GET /api/tasks
   * Fetch all tasks with search, filter, and sorting
   */
  async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await taskService.getAllTasks(req.query as unknown as QueryTasksInput);
      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: result.tasks,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks/stats/summary
   * Fetch task summary counts and metrics for the dashboard
   */
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await taskService.getTaskStats();
      res.status(200).json({
        success: true,
        message: 'Task statistics retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks/:id
   * Fetch single task by ID
   */
  async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const task = await taskService.getTaskById(id);
      res.status(200).json({
        success: true,
        message: 'Task retrieved successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/tasks
   * Create a new task
   */
  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await taskService.createTask(req.body);
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/tasks/:id
   * Update an existing task
   */
  async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updatedTask = await taskService.updateTask(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/tasks/:id/status
   * Update status of an existing task
   */
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updatedTask = await taskService.updateTaskStatus(id, req.body.status);
      res.status(200).json({
        success: true,
        message: 'Task status updated successfully',
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/tasks/:id
   * Delete an existing task
   */
  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await taskService.deleteTask(id);
      res.status(200).json({
        success: true,
        message: result.message,
        data: { id: result.id },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
