import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing tasks
  await prisma.task.deleteMany({});

  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;

  const sampleTasks: Array<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date;
  }> = [
    {
      title: 'Design high-fidelity design system tokens',
      description: 'Define typography scales, primary brand colors, component padding, and dark-mode tokens in Figma.',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() - 2 * dayMs),
    },
    {
      title: 'Architect RESTful task management API',
      description: 'Implement Express endpoints with Zod input validation schemas, centralized error middleware, and pagination.',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() - 1 * dayMs),
    },
    {
      title: 'Build interactive metrics dashboard',
      description: 'Integrate stat cards displaying total, pending, in-progress, and completed tasks with completion rate indicators.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() + 2 * dayMs),
    },
    {
      title: 'Implement search and multi-facet filtering',
      description: 'Add debounced keyword search on titles/descriptions and dropdown filters for status and priority.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date(now.getTime() + 3 * dayMs),
    },
    {
      title: 'Develop task creation & edit modal',
      description: 'Create an accessible dialog with client-side form validation, error banners, and date picker.',
      status: 'PENDING',
      priority: 'MEDIUM',
      dueDate: new Date(now.getTime() + 5 * dayMs),
    },
    {
      title: 'Write automated API integration tests',
      description: 'Cover all HTTP endpoints, status codes (200, 201, 400, 404), and error handling with Jest and Supertest.',
      status: 'PENDING',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() + 4 * dayMs),
    },
    {
      title: 'Audit accessibility and contrast ratios',
      description: 'Ensure WCAG AA compliance for buttons, focus rings, badges, and assistive tech labels.',
      status: 'PENDING',
      priority: 'LOW',
      dueDate: new Date(now.getTime() + 7 * dayMs),
    },
    {
      title: 'Review legacy tech debt in onboarding service',
      description: 'Identify unhandled promise rejections and update outdated external libraries.',
      status: 'PENDING',
      priority: 'LOW',
      dueDate: new Date(now.getTime() - 3 * dayMs), // overdue task
    },
  ];

  for (const task of sampleTasks) {
    await prisma.task.create({
      data: task,
    });
  }

  const count = await prisma.task.count();
  console.log(`✅ Successfully seeded ${count} sample tasks.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
