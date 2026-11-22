import React from 'react';
import { Task, TaskStats, TaskStatus } from '../types/task';
import { StatsCard } from '../components/StatsCard';
import { PriorityBadge, StatusBadge } from '../components/TaskBadge';
import { formatDate, isOverdue } from '../utils/formatters';
import {
  CheckSquare,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Flame,
  Calendar,
  Layers,
} from 'lucide-react';

interface DashboardPageProps {
  stats: TaskStats | null;
  tasks: Task[];
  isLoading: boolean;
  onNavigateToTasks: () => void;
  onOpenCreateModal: () => void;
  onViewTask: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  tasks,
  isLoading,
  onNavigateToTasks,
  onOpenCreateModal,
  onViewTask,
  onStatusChange,
}) => {
  // Take up to 5 most urgent/recent tasks
  const recentTasks = tasks.slice(0, 5);

  if (isLoading && !stats) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-md w-64"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-slate-200 rounded-2xl"></div>
          <div className="h-72 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const completionRate = stats?.completionRate || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-semibold backdrop-blur-xs mb-3">
            <Layers className="w-3.5 h-3.5" /> Workspace Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to TaskFlow Management
          </h1>
          <p className="mt-2 text-indigo-100 text-sm max-w-xl leading-relaxed">
            Track progress, prioritize deliverables, and maintain continuous delivery across your engineering tasks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-700 font-semibold text-sm hover:bg-indigo-50 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
          <button
            onClick={onNavigateToTasks}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500/30 text-white font-semibold text-sm hover:bg-indigo-500/40 border border-white/20 transition-all"
          >
            All Tasks
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={stats?.total || 0}
          subtitle="All tasks in database"
          icon={CheckSquare}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
          onClick={onNavigateToTasks}
        />
        <StatsCard
          title="In Progress"
          value={stats?.inProgress || 0}
          subtitle="Currently active tasks"
          icon={PlayCircle}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          onClick={onNavigateToTasks}
        />
        <StatsCard
          title="Pending"
          value={stats?.pending || 0}
          subtitle="Awaiting start"
          icon={Clock}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          onClick={onNavigateToTasks}
        />
        <StatsCard
          title="Completed"
          value={stats?.completed || 0}
          subtitle={`${completionRate}% completion rate`}
          icon={CheckCircle2}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          onClick={onNavigateToTasks}
        />
      </div>

      {/* Analytics & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress & Status Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Task Completion Health</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status progression</p>

            {/* Big circular or bar indicator */}
            <div className="mt-6">
              <div className="flex items-end justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Completion Velocity</span>
                <span className="text-2xl font-black text-indigo-600">{completionRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{
                    width: stats?.total ? `${(stats.completed / stats.total) * 100}%` : '0%',
                  }}
                  title={`Completed: ${stats?.completed || 0}`}
                />
                <div
                  className="bg-blue-500 transition-all duration-500"
                  style={{
                    width: stats?.total ? `${(stats.inProgress / stats.total) * 100}%` : '0%',
                  }}
                  title={`In Progress: ${stats?.inProgress || 0}`}
                />
                <div
                  className="bg-amber-400 transition-all duration-500"
                  style={{
                    width: stats?.total ? `${(stats.pending / stats.total) * 100}%` : '0%',
                  }}
                  title={`Pending: ${stats?.pending || 0}`}
                />
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-100 text-center">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-800">Done</p>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">{stats?.completed || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <p className="text-xs font-semibold text-blue-800">Active</p>
                <p className="text-lg font-bold text-blue-600 mt-0.5">{stats?.inProgress || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                <p className="text-xs font-semibold text-amber-800">Queue</p>
                <p className="text-lg font-bold text-amber-600 mt-0.5">{stats?.pending || 0}</p>
              </div>
            </div>
          </div>

          {/* Overdue Alert banner if any */}
          {(stats?.overdue || 0) > 0 && (
            <div className="mt-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-between text-rose-800 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="font-semibold">{stats?.overdue} task(s) past due date!</span>
              </div>
              <button
                onClick={onNavigateToTasks}
                className="font-bold underline hover:text-rose-950"
              >
                Review
              </button>
            </div>
          )}
        </div>

        {/* Priority & High Impact Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              High Priority & Focus
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Tasks requiring immediate attention</p>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">High Priority Tasks</p>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">{stats?.highPriority || 0}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                  HIGH
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Overdue Deliverables</p>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">{stats?.overdue || 0}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  DUE
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={onNavigateToTasks}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5"
            >
              Filter High Priority Tasks
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Launch & Helpful Tips */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Task Management Tips</h2>
            <p className="text-xs text-slate-500 mt-0.5">Best practices for productivity</p>

            <ul className="mt-5 space-y-3 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                <span>Assign explicit due dates to tasks to enable automatic overdue tracking.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                <span>Move tasks from Pending to In Progress to keep the team aligned on active work.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                <span>Use the Table view on larger screens for rapid batch status adjustments.</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={onOpenCreateModal}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Quick Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Task Feed</h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest tasks created in the system</p>
          </div>
          <button
            onClick={onNavigateToTasks}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View All ({stats?.total || 0})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTasks.length === 0 ? (
          <div className="p-12 text-center">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900">No tasks created yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Get started by creating your first task in the system.
            </p>
            <button
              onClick={onOpenCreateModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Create First Task
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTasks.map((task) => {
              const overdue = isOverdue(task.dueDate, task.status);
              return (
                <div
                  key={task.id}
                  className="p-4 sm:px-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <PriorityBadge priority={task.priority} size="sm" />
                      <StatusBadge status={task.status} size="sm" />
                      {overdue && (
                        <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Overdue
                        </span>
                      )}
                    </div>
                    <h3
                      onClick={() => onViewTask(task)}
                      className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer truncate"
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{task.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>

                    {task.status !== 'COMPLETED' ? (
                      <button
                        onClick={() => onStatusChange(task.id, 'COMPLETED')}
                        title="Mark as completed"
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                      >
                        Complete
                      </button>
                    ) : (
                      <button
                        onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                        title="Reopen task"
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        Reopen
                      </button>
                    )}

                    <button
                      onClick={() => onViewTask(task)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
