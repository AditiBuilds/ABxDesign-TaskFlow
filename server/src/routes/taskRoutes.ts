import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { validateRequest } from '../middleware/validate';
import {
  createTaskSchema,
  getTaskByIdSchema,
  queryTasksSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from '../validators/taskValidator';

const router = Router();

// Stats summary route (placed before :id route to prevent collision)
router.get('/stats/summary', (req, res, next) => taskController.getStats(req, res, next));

// CRUD routes
router.get(
  '/',
  validateRequest(queryTasksSchema),
  (req, res, next) => taskController.getTasks(req, res, next)
);

router.get(
  '/:id',
  validateRequest(getTaskByIdSchema),
  (req, res, next) => taskController.getTaskById(req, res, next)
);

router.post(
  '/',
  validateRequest(createTaskSchema),
  (req, res, next) => taskController.createTask(req, res, next)
);

router.put(
  '/:id',
  validateRequest(updateTaskSchema),
  (req, res, next) => taskController.updateTask(req, res, next)
);

router.patch(
  '/:id/status',
  validateRequest(updateTaskStatusSchema),
  (req, res, next) => taskController.updateStatus(req, res, next)
);

router.delete(
  '/:id',
  validateRequest(getTaskByIdSchema),
  (req, res, next) => taskController.deleteTask(req, res, next)
);

export default router;
