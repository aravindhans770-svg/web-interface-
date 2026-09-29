import React, { useState, useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import type { Task, Category, Priority } from '../../types/task';
import { TaskItem } from '../common/TaskItem';
import { TaskModal } from '../modals/TaskModal';
import { getTodayString } from '../../utils/dateUtils';
import {
  CheckCircle2,
  Plus,
  Filter,
  Trash2,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { tasks, searchQuery, openQuickAddWithProps, clearCompletedTasks } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date');
  const [showCompletedSection, setShowCompletedSection] = useState(true);

  // Quick inline add
  const [quickTitle, setQuickTitle] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    openQuickAddWithProps({
      title: quickTitle.trim(),
      dueDate: getTodayString(),
      type: 'standard',
    });
    setQuickTitle('');
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesCat = task.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && task.category !== categoryFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, categoryFilter, priorityFilter]);

  // Separate upcoming vs completed
  const upcomingTasks = useMemo(() => {
    const list = filteredTasks.filter(t => !t.completed);

    return list.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // default: by date
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [filteredTasks, sortBy]);

  const completedTasks = useMemo(() => {
    const list = filteredTasks.filter(t => t.completed);
    return list.sort((a, b) => {
      const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [filteredTasks]);

  // Statistics counters
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const todayStr = getTodayString();
  const overdueCount = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr).length;

  const categories: (Category | 'all')[] = ['all', 'Work', 'Personal', 'Health', 'Study', 'Finance', 'Errands'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Hero Greeting & Quick Stats */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-medium tracking-wide mb-2 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome to your Workspace
              </h1>
              <p className="mt-1 text-blue-100 text-sm sm:text-base max-w-xl">
                Stay on top of your priorities, check off recent completions, and seize the day.
              </p>
            </div>

            {/* Quick action button in hero */}
            <button
              onClick={() => openQuickAddWithProps()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer self-start sm:self-center shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Task</span>
            </button>
          </div>

          {/* Quick Counter Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-xs text-blue-100 block">Total Tasks</span>
              <span className="text-xl sm:text-2xl font-bold">{totalCount}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-xs text-blue-100 block">Upcoming</span>
              <span className="text-xl sm:text-2xl font-bold">{pendingCount}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-xs text-blue-100 block">Completed</span>
              <span className="text-xl sm:text-2xl font-bold">{completedCount}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-xs text-blue-100 block">Overdue</span>
              <span className={`text-xl sm:text-2xl font-bold ${overdueCount > 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
                {overdueCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleQuickAdd} className="relative">
        <input
          type="text"
          value={quickTitle}
          onChange={e => setQuickTitle(e.target.value)}
          placeholder="⚡ Quick add a task for today (press Enter to configure or save)..."
          className="w-full pl-4 pr-28 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          Quick Add
        </button>
      </form>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 pl-1 pr-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Priority & Sorting */}
        <div className="flex items-center gap-2">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as Priority | 'all')}
            className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Sort selector */}
          <div className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'date' | 'priority' | 'title')}
              className="bg-transparent focus:outline-none text-xs"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Upcoming Most Recent Tasks */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Upcoming Most Recent Tasks
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              {upcomingTasks.length}
            </span>
          </div>
        </div>

        {upcomingTasks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <CheckCircle2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No upcoming tasks found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              You are all caught up! Add a new task using the button above or clear filters to see more.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {upcomingTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={setEditingTask}
              />
            ))}
          </div>
        )}
      </section>

      {/* Grid: Completed Tasks */}
      <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <button
              onClick={() => setShowCompletedSection(!showCompletedSection)}
              className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer hover:text-slate-700"
            >
              <span>Completed Tasks</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                {completedTasks.length}
              </span>
            </button>
          </div>

          {completedTasks.length > 0 && (
            <button
              onClick={clearCompletedTasks}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Completed</span>
            </button>
          )}
        </div>

        {showCompletedSection && (
          <div>
            {completedTasks.length === 0 ? (
              <div className="p-6 text-center rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/30 dark:bg-slate-900/30">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  No completed tasks yet. Check off an upcoming task to see it here!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {completedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Task Edit Modal */}
      {editingTask && (
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          taskToEdit={editingTask}
        />
      )}
    </div>
  );
};
