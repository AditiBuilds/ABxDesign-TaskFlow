import React, { useState, useEffect, useCallback } from 'react';
import {
  Task,
  TaskFilterParams,
  TaskFormData,
  TaskStats,
  PaginationMeta,
  TaskStatus,
} from './types/task';
import { taskApi } from './api/taskApi';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { TaskListPage } from './pages/TaskListPage';
import { TaskModal } from './components/TaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastProvider, useToast } from './context/ToastContext';

const AppContent: React.FC = () => {
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks'>('dashboard');

  // Tasks & Stats state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter params
  const [filters, setFilters] = useState<TaskFilterParams>({
    search: '',
    status: 'ALL',
    priority: 'ALL',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 12,
  });

  // Modals state
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Fetch stats & recent tasks for dashboard independently
  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, recentRes] = await Promise.all([
        taskApi.getStats(),
        taskApi.getTasks({ limit: 5, sortBy: 'createdAt', order: 'desc' }),
      ]);
      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (recentRes.success) {
        setRecentTasks(recentRes.data);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
    }
  }, []);

  // Fetch tasks with filters for TaskListPage
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await taskApi.getTasks(filters);
      if (response.success) {
        setTasks(response.data);
        setPagination(response.pagination);
      }
    } catch (err: any) {
      error(err.message || 'Failed to fetch tasks.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, error]);

  // Initial load
  useEffect(() => {
    fetchDashboardData();
    fetchTasks();
  }, [fetchDashboardData, fetchTasks]);

  const handleFilterChange = useCallback((newFilters: Partial<TaskFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleNavigateToTasks = useCallback((filterOverride?: Partial<TaskFilterParams>) => {
    if (filterOverride) {
      setFilters((prev) => ({
        ...prev,
        ...filterOverride,
        page: 1,
      }));
    }
    setActiveTab('tasks');
  }, []);

  // Create or Update task handler
  const handleSaveTask = async (formData: TaskFormData) => {
    if (editingTask) {
      const response = await taskApi.updateTask(editingTask.id, formData);
      if (response.success) {
        success('Task updated successfully!');
        if (viewingTask?.id === editingTask.id) {
          setViewingTask(response.data);
        }
      }
    } else {
      const response = await taskApi.createTask(formData);
      if (response.success) {
        success('New task created successfully!');
      }
    }
    await Promise.all([fetchTasks(), fetchDashboardData()]);
  };

  // Quick Status change handler
  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      const response = await taskApi.updateStatus(id, status);
      if (response.success) {
        success(`Status updated to ${status.replace('_', ' ')}`);
        // Optimistically update local view
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status } : t))
        );
        setRecentTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status } : t))
        );
        if (viewingTask?.id === id) {
          setViewingTask((prev) => (prev ? { ...prev, status } : null));
        }
        fetchDashboardData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update task status.');
    }
  };

  // Delete task handler
  const handleDeleteTask = async (id: string) => {
    try {
      await taskApi.deleteTask(id);
      success('Task deleted successfully.');
      if (viewingTask?.id === id) {
        setIsDetailOpen(false);
        setViewingTask(null);
      }
      await Promise.all([fetchTasks(), fetchDashboardData()]);
    } catch (err: any) {
      error(err.message || 'Failed to delete task.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => {
          setEditingTask(null);
          setIsCreateEditOpen(true);
        }}
        taskCount={stats?.total}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'dashboard' ? (
          <DashboardPage
            stats={stats}
            tasks={recentTasks}
            isLoading={isLoading}
            onNavigateToTasks={handleNavigateToTasks}
            onOpenCreateModal={() => {
              setEditingTask(null);
              setIsCreateEditOpen(true);
            }}
            onViewTask={(task) => {
              setViewingTask(task);
              setIsDetailOpen(true);
            }}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <TaskListPage
            tasks={tasks}
            pagination={pagination}
            isLoading={isLoading}
            filters={filters}
            onFilterChange={handleFilterChange}
            onOpenCreateModal={() => {
              setEditingTask(null);
              setIsCreateEditOpen(true);
            }}
            onViewTask={(task) => {
              setViewingTask(task);
              setIsDetailOpen(true);
            }}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsCreateEditOpen(true);
            }}
            onDeleteTask={(task) => {
              setDeletingTask(task);
              setIsDeleteOpen(true);
            }}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 TaskFlow • ABxDesign Full-Stack Developer Assessment</p>
          <p className="text-slate-400">
            Node.js • Express • TypeScript • Prisma • SQLite • React • Tailwind CSS
          </p>
        </div>
      </footer>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isCreateEditOpen}
        onClose={() => {
          setIsCreateEditOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
      />

      {/* View Task Details Modal */}
      <TaskDetailModal
        task={viewingTask}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setViewingTask(null);
        }}
        onEdit={(task) => {
          setEditingTask(task);
          setIsCreateEditOpen(true);
        }}
        onDelete={(task) => {
          setDeletingTask(task);
          setIsDeleteOpen(true);
        }}
        onStatusChange={handleStatusChange}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        task={deletingTask}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingTask(null);
        }}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
