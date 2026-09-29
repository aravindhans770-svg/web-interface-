import React, { useMemo, useRef } from 'react';
import { useTasks } from '../../context/TaskContext';
import type { Category } from '../../types/task';
import { getTodayString, formatDateToISO } from '../../utils/dateUtils';
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CheckCircle2,
  Flame,
  Award,
  AlertTriangle,
  Download,
  Upload,
  RotateCcw,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { tasks, resetToSampleData, exportData, importData } = useTasks();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayStr = getTodayString();

  // Metrics computation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const overdueTasks = tasks.filter(
    t => !t.completed && t.dueDate && t.dueDate < todayStr
  ).length;

  // Daily Habits completion
  const dailyDefaults = tasks.filter(t => t.isDailyDefault);
  const doneHabitsToday = dailyDefaults.filter(t =>
    (t.completedDates || []).includes(todayStr)
  ).length;
  const habitRateToday = dailyDefaults.length > 0
    ? Math.round((doneHabitsToday / dailyDefaults.length) * 100)
    : 0;

  // 7-day activity data (completions in last 7 days)
  const activityData = useMemo(() => {
    const days: { dateStr: string; label: string; completed: number; created: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = formatDateToISO(d);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });

      // Count tasks completed on this date
      const compCount = tasks.filter(t => {
        if (t.completedAt && t.completedAt.startsWith(dStr)) return true;
        if (t.isDailyDefault && (t.completedDates || []).includes(dStr)) return true;
        return false;
      }).length;

      // Count tasks created on this date
      const createCount = tasks.filter(t => t.createdAt.startsWith(dStr)).length;

      days.push({
        dateStr: dStr,
        label,
        completed: compCount,
        created: createCount,
      });
    }

    return days;
  }, [tasks]);

  // Category Distribution
  const categoryData = useMemo(() => {
    const counts: Record<Category, number> = {
      Work: 0,
      Personal: 0,
      Health: 0,
      Study: 0,
      Finance: 0,
      Errands: 0,
    };

    tasks.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });

    const colors: Record<Category, string> = {
      Work: '#3b82f6',
      Personal: '#a855f7',
      Health: '#10b981',
      Study: '#6366f1',
      Finance: '#059669',
      Errands: '#f59e0b',
    };

    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([cat, count]) => ({
        name: cat,
        value: count,
        color: colors[cat as Category] || '#94a3b8',
      }));
  }, [tasks]);

  // Priority Breakdown
  const priorityData = useMemo(() => {
    const list: { name: string; total: number; completed: number; color: string }[] = [
      {
        name: 'High',
        total: tasks.filter(t => t.priority === 'high').length,
        completed: tasks.filter(t => t.priority === 'high' && t.completed).length,
        color: '#ef4444',
      },
      {
        name: 'Medium',
        total: tasks.filter(t => t.priority === 'medium').length,
        completed: tasks.filter(t => t.priority === 'medium' && t.completed).length,
        color: '#f59e0b',
      },
      {
        name: 'Low',
        total: tasks.filter(t => t.priority === 'low').length,
        completed: tasks.filter(t => t.priority === 'low' && t.completed).length,
        color: '#64748b',
      },
    ];
    return list;
  }, [tasks]);

  // Productivity score calculation
  const productivityScore = Math.min(
    100,
    Math.round(completionRate * 0.5 + habitRateToday * 0.3 + (totalTasks > 0 ? 20 : 0))
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) {
          alert('Tasks imported successfully!');
        } else {
          alert('Invalid JSON file format.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Productivity Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time analytics, task completion trends, and routine performance.
          </p>
        </div>

        {/* Data Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Import
          </button>
          <button
            onClick={exportData}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset all tasks to sample demonstration data?')) {
                resetToSampleData();
              }
            }}
            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Productivity Score */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Productivity Score
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {productivityScore}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Completed Tasks
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {completedTasks}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">
                ({completionRate}%)
              </span>
            </div>
          </div>
        </div>

        {/* Daily Habits Today */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Daily Habits Done
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {doneHabitsToday} / {dailyDefaults.length}
              </span>
              <span className="text-xs text-amber-600 font-semibold">
                ({habitRateToday}%)
              </span>
            </div>
          </div>
        </div>

        {/* Overdue Deadlines */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            overdueTasks > 0
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}>
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Overdue Tasks
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-2xl font-extrabold ${overdueTasks > 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                {overdueTasks}
              </span>
              <span className="text-xs text-slate-400">pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Completion Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                7-Day Activity & Completions
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Past week</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Tasks Completed"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Category Distribution
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-400">By task volume</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {categoryData.map(c => (
              <span key={c.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name}: {c.value}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Priority & Routine Consistency Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Priority Completion Progress
              </h2>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {priorityData.map(p => {
              const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
              return (
                <div key={p.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name} Priority
                    </span>
                    <span className="text-slate-500">
                      {p.completed} / {p.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Habits Consistency Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Habits Consistency
              </h2>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pt-1">
            {dailyDefaults.map(habit => {
              const streak = (habit.completedDates || []).length;
              const isDoneToday = (habit.completedDates || []).includes(todayStr);

              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isDoneToday ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                      {habit.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      🔥 {streak} days
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isDoneToday
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {isDoneToday ? 'Done Today' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
