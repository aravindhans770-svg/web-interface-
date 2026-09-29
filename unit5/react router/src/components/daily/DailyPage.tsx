import React, { useState, useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import type { Task, Category, Priority } from '../../types/task';
import { TaskItem } from '../common/TaskItem';
import { TaskModal } from '../modals/TaskModal';
import { getTodayString, formatDateToISO } from '../../utils/dateUtils';
import {
  Sun,
  CheckCircle2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';

export const DailyPage: React.FC = () => {
  const {
    tasks,
    addDailyDefault,
    addTodayAloneTask,
  } = useTasks();

  // Selected date for viewing daily tasks (defaults to today)
  const todayStr = getTodayString();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // New Today-alone input form state
  const [todayAloneTitle, setTodayAloneTitle] = useState('');
  const [todayAloneCategory, setTodayAloneCategory] = useState<Category>('Work');
  const [todayAlonePriority, setTodayAlonePriority] = useState<Priority>('medium');
  const [todayAloneTime, setTodayAloneTime] = useState('');
  const [todayAloneIsImportant, setTodayAloneIsImportant] = useState(false);
  const [showTodayAddForm, setShowTodayAddForm] = useState(false);

  // New Daily Default habit form state
  const [defaultHabitTitle, setDefaultHabitTitle] = useState('');
  const [defaultHabitCategory, setDefaultHabitCategory] = useState<Category>('Health');
  const [defaultHabitPriority, setDefaultHabitPriority] = useState<Priority>('medium');
  const [showDefaultAddForm, setShowDefaultAddForm] = useState(false);

  // Date navigation helpers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(formatDateToISO(d));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(formatDateToISO(d));
  };

  const handleJumpToToday = () => {
    setSelectedDate(todayStr);
  };

  // 1. Default Daily Tasks (Habits)
  const dailyDefaults = useMemo(() => {
    return tasks.filter(t => t.isDailyDefault || t.type === 'daily_default');
  }, [tasks]);

  // 2. Tasks for Today Alone (matching the selected date)
  const todayAloneTasks = useMemo(() => {
    return tasks.filter(t => t.type === 'daily_today' && (t.forDate === selectedDate || t.dueDate === selectedDate));
  }, [tasks, selectedDate]);

  // Progress metrics for selected date
  const totalDailyTasksCount = dailyDefaults.length + todayAloneTasks.length;
  const completedDefaultsCount = dailyDefaults.filter(t =>
    (t.completedDates || []).includes(selectedDate)
  ).length;
  const completedTodayAloneCount = todayAloneTasks.filter(t => t.completed).length;
  const totalCompletedCount = completedDefaultsCount + completedTodayAloneCount;
  const completionPercentage = totalDailyTasksCount > 0
    ? Math.round((totalCompletedCount / totalDailyTasksCount) * 100)
    : 0;

  // Handle adding today-alone task
  const handleAddTodayAlone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todayAloneTitle.trim()) return;

    addTodayAloneTask(
      todayAloneTitle.trim(),
      todayAlonePriority,
      todayAloneCategory,
      todayAloneTime || undefined,
      undefined,
      todayAloneIsImportant
    );

    setTodayAloneTitle('');
    setTodayAloneTime('');
    setTodayAloneIsImportant(false);
    setShowTodayAddForm(false);
  };

  // Handle adding new default routine
  const handleAddDefaultRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defaultHabitTitle.trim()) return;

    addDailyDefault(
      defaultHabitTitle.trim(),
      defaultHabitCategory,
      defaultHabitPriority
    );

    setDefaultHabitTitle('');
    setShowDefaultAddForm(false);
  };

  const isViewingToday = selectedDate === todayStr;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Date Navigation & Daily Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sun className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Daily Planner
                </h1>
                {isViewingToday && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    TODAY
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Default recurring routines plus custom tasks for today alone.
              </p>
            </div>
          </div>

          {/* Date Selector Navigation */}
          <div className="flex items-center gap-1.5 self-start sm:self-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 min-w-32 text-center">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </div>
            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {!isViewingToday && (
              <button
                onClick={handleJumpToToday}
                className="ml-1 px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-xl shadow-xs hover:bg-blue-50 transition cursor-pointer"
              >
                Today
              </button>
            )}
          </div>
        </div>

        {/* Daily Progress Gauge */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Day Progress: {totalCompletedCount} of {totalDailyTasksCount} completed
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{completionPercentage}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 1: Tasks for Today Alone (Added or deleted with daily defaults) */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Tasks for Today Alone
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {todayAloneTasks.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tasks created for today alone. Can be freely checked off or deleted without affecting recurring defaults.
            </p>
          </div>

          <button
            onClick={() => setShowTodayAddForm(!showTodayAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add for Today</span>
          </button>
        </div>

        {/* Add for Today Alone inline form */}
        {showTodayAddForm && (
          <form
            onSubmit={handleAddTodayAlone}
            className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-900/60 space-y-3 animate-in fade-in duration-150"
          >
            <div className="font-semibold text-xs text-sky-900 dark:text-sky-300">
              New task for today alone ({selectedDate}):
            </div>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g., Deliver signed lease document to office"
              value={todayAloneTitle}
              onChange={e => setTodayAloneTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <select
                value={todayAloneCategory}
                onChange={e => setTodayAloneCategory(e.target.value as Category)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Study">Study</option>
                <option value="Finance">Finance</option>
                <option value="Errands">Errands</option>
              </select>

              <select
                value={todayAlonePriority}
                onChange={e => setTodayAlonePriority(e.target.value as Priority)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <input
                type="time"
                value={todayAloneTime}
                onChange={e => setTodayAloneTime(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />

              <button
                type="button"
                onClick={() => setTodayAloneIsImportant(!todayAloneIsImportant)}
                className={`px-2.5 py-1.5 text-xs rounded-xl border font-medium flex items-center justify-center gap-1 cursor-pointer transition ${
                  todayAloneIsImportant
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-sky-200 dark:border-sky-800'
                }`}
              >
                <Star className={`w-3 h-3 ${todayAloneIsImportant ? 'fill-amber-400 text-amber-500' : ''}`} />
                <span>{todayAloneIsImportant ? 'Important' : 'Normal'}</span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowTodayAddForm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-xs cursor-pointer"
              >
                Add to Today
              </button>
            </div>
          </form>
        )}

        {/* Today Alone List */}
        {todayAloneTasks.length === 0 ? (
          <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No tasks added for today alone. Use "+ Add for Today" to add one-off items.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayAloneTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                showDate={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: Default Daily Tasks (Done daily recurring routines) */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-violet-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Default Daily Tasks (Habits & Routines)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                {dailyDefaults.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              These recurring tasks occur every day. Marking them done for today keeps them ready for tomorrow.
            </p>
          </div>

          <button
            onClick={() => setShowDefaultAddForm(!showDefaultAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Daily Habit</span>
          </button>
        </div>

        {/* Add Default Daily Habit form */}
        {showDefaultAddForm && (
          <form
            onSubmit={handleAddDefaultRoutine}
            className="p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200/80 dark:border-violet-900/60 space-y-3 animate-in fade-in duration-150"
          >
            <div className="font-semibold text-xs text-violet-900 dark:text-violet-300">
              Add a permanent recurring daily habit:
            </div>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g., Evening 10-minute mindfulness & reflection"
              value={defaultHabitTitle}
              onChange={e => setDefaultHabitTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-violet-200 dark:border-violet-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={defaultHabitCategory}
                onChange={e => setDefaultHabitCategory(e.target.value as Category)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-violet-200 dark:border-violet-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="Health">Health</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Personal">Personal</option>
                <option value="Finance">Finance</option>
                <option value="Errands">Errands</option>
              </select>

              <select
                value={defaultHabitPriority}
                onChange={e => setDefaultHabitPriority(e.target.value as Priority)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-violet-200 dark:border-violet-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowDefaultAddForm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-xs cursor-pointer"
              >
                Save Habit
              </button>
            </div>
          </form>
        )}

        {/* Daily Defaults List */}
        <div className="space-y-2">
          {dailyDefaults.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={setEditingTask}
              showDate={false}
              isDailyMode={true}
              dailyDateStr={selectedDate}
            />
          ))}
        </div>
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
