import React, { useState, useEffect } from 'react';
import {
  Task,
  TaskFilterParams,
  TaskStatus,
  PaginationMeta,
} from '../types/task';
import { TaskCard } from '../components/TaskCard';
import { TaskTableRow } from '../components/TaskTableRow';
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Inbox,
  ArrowUpDown,
} from 'lucide-react';

interface TaskListPageProps {
  tasks: Task[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  filters: TaskFilterParams;
  onFilterChange: (filters: Partial<TaskFilterParams>) => void;
  onOpenCreateModal: () => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export const TaskListPage: React.FC<TaskListPageProps> = ({
  tasks,
  pagination,
  isLoading,
  filters,
  onFilterChange,
  onOpenCreateModal,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounced search handling
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.search || '')) {
        onFilterChange({ search: searchInput, page: 1 });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onFilterChange]);

  const hasActiveFilters = Boolean(
    (filters.search && filters.search.trim() !== '') ||
      (filters.status && filters.status !== 'ALL') ||
      (filters.priority && filters.priority !== 'ALL')
  );

  const handleResetFilters = () => {
    setSearchInput('');
    onFilterChange({
      search: '',
      status: 'ALL',
      priority: 'ALL',
      sortBy: 'createdAt',
      order: 'desc',
      page: 1,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Task Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, filter, search, and update progress on all active and completed tasks.
          </p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/25 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Task
        </button>
      </div>

      {/* Control Bar: Search, Filters, Sorting, and View Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort & View Mode */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50/50">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={`${filters.sortBy || 'createdAt'}-${filters.order || 'desc'}`}
                onChange={(e) => {
                  const [sortBy, order] = e.target.value.split('-') as [any, any];
                  onFilterChange({ sortBy, order, page: 1 });
                }}
                className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="dueDate-asc">Due Date (Earliest)</option>
                <option value="dueDate-desc">Due Date (Latest)</option>
                <option value="title-asc">Title (A–Z)</option>
                <option value="title-desc">Title (Z–A)</option>
                <option value="priority-desc">Priority</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid vs Table) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid / Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table / List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills: Status & Priority */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Filters:
            </span>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl text-xs">
              {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((s) => {
                const isSelected = (filters.status || 'ALL') === s;
                return (
                  <button
                    key={s}
                    onClick={() => onFilterChange({ status: s, page: 1 })}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      isSelected
                        ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s === 'ALL'
                      ? 'All Statuses'
                      : s === 'IN_PROGRESS'
                      ? 'In Progress'
                      : s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl text-xs">
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => {
                const isSelected = (filters.priority || 'ALL') === p;
                return (
                  <button
                    key={p}
                    onClick={() => onFilterChange({ priority: p, page: 1 })}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      isSelected
                        ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p === 'ALL' ? 'All Priorities' : p.charAt(0) + p.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Task Content: Loading State, Empty State, Grid View, or Table View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 bg-slate-200/80 rounded-2xl" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No tasks found</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {hasActiveFilters
              ? 'No tasks matched your search query or filter selection. Try adjusting or resetting your filters.'
              : 'Your task list is completely clear. Create a new task to organize your upcoming deliverables.'}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={onOpenCreateModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create First Task
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onView={onViewTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Task Title & Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <TaskTableRow
                    key={task.id}
                    task={task}
                    onView={onViewTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200/80 text-xs text-slate-500">
          <div>
            Showing{' '}
            <span className="font-semibold text-slate-800">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-800">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-semibold text-slate-800">{pagination.total}</span> tasks
          </div>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              onClick={() => onFilterChange({ page: pagination.page - 1 })}
              disabled={!pagination.hasPrevPage}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onFilterChange({ page: pageNum })}
                className={`w-8 h-8 rounded-lg font-semibold text-xs transition-colors ${
                  pagination.page === pageNum
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'border border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => onFilterChange({ page: pagination.page + 1 })}
              disabled={!pagination.hasNextPage}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
