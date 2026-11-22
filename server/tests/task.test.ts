import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/db';

describe('TaskFlow REST API Tests', () => {
  let createdTaskId: string;

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/health', () => {
    it('should return 200 and health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/tasks/stats/summary', () => {
    it('should return aggregate metrics for tasks', async () => {
      const res = await request(app).get('/api/tasks/stats/summary');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('total');
      expect(res.body.data).toHaveProperty('pending');
      expect(res.body.data).toHaveProperty('inProgress');
      expect(res.body.data).toHaveProperty('completed');
      expect(res.body.data).toHaveProperty('overdue');
      expect(res.body.data).toHaveProperty('completionRate');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with valid data', async () => {
      const payload = {
        title: 'Automated Test Task',
        description: 'Testing task creation via Supertest',
        status: 'PENDING',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
      };

      const res = await request(app).post('/api/tasks').send(payload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.status).toBe('PENDING');
      expect(res.body.data.priority).toBe('HIGH');
      expect(res.body.data).toHaveProperty('id');

      createdTaskId = res.body.data.id;
    });

    it('should reject task creation when title is too short (< 3 chars)', async () => {
      const res = await request(app).post('/api/tasks').send({
        title: 'Hi',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: 'Title must be at least 3 characters long',
          }),
        ])
      );
    });

    it('should reject task creation with missing title', async () => {
      const res = await request(app).post('/api/tasks').send({
        description: 'No title provided',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks', () => {
    it('should retrieve list of tasks with pagination', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.pagination).toHaveProperty('total');
    });

    it('should filter tasks by status', async () => {
      const res = await request(app).get('/api/tasks?status=COMPLETED');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.data.forEach((task: any) => {
        expect(task.status).toBe('COMPLETED');
      });
    });

    it('should filter tasks by priority', async () => {
      const res = await request(app).get('/api/tasks?priority=HIGH');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.data.forEach((task: any) => {
        expect(task.priority).toBe('HIGH');
      });
    });

    it('should search tasks by title or description keyword', async () => {
      const res = await request(app).get('/api/tasks?search=Automated');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].title).toContain('Automated');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should retrieve a task by ID', async () => {
      const res = await request(app).get(`/api/tasks/${createdTaskId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdTaskId);
    });

    it('should return 404 for non-existent UUID', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app).get(`/api/tasks/${nonExistentId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid UUID format', async () => {
      const res = await request(app).get('/api/tasks/not-a-valid-uuid');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task title, description, and priority', async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send({
          title: 'Updated Task Title via PUT',
          priority: 'LOW',
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Task Title via PUT');
      expect(res.body.data.priority).toBe('LOW');
    });

    it('should reject update if request body is empty', async () => {
      const res = await request(app).put(`/api/tasks/${createdTaskId}`).send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should update task status to IN_PROGRESS', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdTaskId}/status`)
        .send({ status: 'IN_PROGRESS' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('should update task status to COMPLETED', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdTaskId}/status`)
        .send({ status: 'COMPLETED' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('COMPLETED');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete task by ID', async () => {
      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdTaskId);

      // Verify it no longer exists
      const verifyRes = await request(app).get(`/api/tasks/${createdTaskId}`);
      expect(verifyRes.status).toBe(404);
    });

    it('should return 404 when trying to delete already deleted task', async () => {
      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);
      expect(res.status).toBe(404);
    });
  });
});
