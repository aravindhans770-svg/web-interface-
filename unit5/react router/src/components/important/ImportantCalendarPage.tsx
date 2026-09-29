import React, { useState, useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import type { Task } from '../../types/task';
import { TaskItem } from '../common/TaskItem';
import { TaskModal } from '../modals/TaskModal';
import {
  getMonthCalendarDays,
  getTodayString,
  isOverdue,
  formatFriendlyDate
} from '../../utils/dateUtils';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
} from 'lucide-react';

export const ImportantCalendarPage: React.FC = () => {
  const { tasks, openQuickAddWithProps } = useTasks();

  const todayStr = getTodayString();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // All important / high priority tasks
  const importantTasks = useMemo(() => {
    return tasks.filter(t => t.isImportant || t.priority === 'high');
  }, [tasks]);

  // Map of dateStr -> Important tasks
  const importantTasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    importantTasks.forEach(task => {
      // For tasks with due date
      const dateKey = task.dueDate || (task.type === 'daily_today' ? task.forDate : undefined);
      if (dateKey) {
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push(task);
      }
    });
    return map;
  }, [importantTasks]);

  // Calendar grid days
  const calendarDays = useMemo(() => {
    return getMonthCalendarDays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Selected date's tasks
  const selectedDateTasks = useMemo(() => {
    const dayTasks = importantTasksByDate.get(selectedDateStr) || [];
    return dayTasks.filter(t => {
      if (statusFilter === 'pending') return !t.completed;
      if (statusFilter === 'completed') return t.completed;
      return true;
    });
  }, [importantTasksByDate, selectedDateStr, statusFilter]);

  // Important tasks with no due date
  const undatedImportantTasks = useMemo(() => {
    return importantTasks.filter(t => !t.dueDate && t.type !== 'daily_today' && !t.completed);
  }, [importantTasks]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(todayStr);
  };

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const weekDayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const pendingImportantCount = importantTasks.filter(t => !t.completed).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 stroke-[2.2] fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Important Tasks & Live Calendar
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {pendingImportantCount} Pending
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Visual live calendar tracking all high-priority deadlines and starred milestones.
              </p>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-2 self-start sm:self-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 min-w-36 text-center">
              {monthName}
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleJumpToToday}
              className="ml-1 px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 rounded-xl shadow-xs hover:bg-amber-50 transition cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Monthly Calendar Grid (2 cols on large screen) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekDayHeaders.map(day => (
              <div
                key={day}
                className="text-center py-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Cells Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
            {calendarDays.map((cell, idx) => {
              const dayTasks = importantTasksByDate.get(cell.dateStr) || [];
              const isSelected = cell.dateStr === selectedDateStr;
              const hasTasks = dayTasks.length > 0;
              const hasOverdue = dayTasks.some(t => isOverdue(t.dueDate, t.completed));
              const hasUncompleted = dayTasks.some(t => !t.completed);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`min-h-[82px] sm:min-h-[96px] p-1.5 sm:p-2 rounded-xl border flex flex-col transition cursor-pointer relative group ${
                    isSelected
                      ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/20 dark:bg-amber-950/20'
                      : cell.isToday
                      ? 'border-blue-400 dark:border-blue-600 bg-blue-50/30 dark:bg-blue-950/20'
                      : cell.isCurrentMonth
                      ? 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      : 'border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/40 text-slate-300 dark:text-slate-600'
                  }`}
                >
                  {/* Date number & Badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                        cell.isToday
                          ? 'bg-blue-600 text-white'
                          : cell.isCurrentMonth
                          ? 'text-slate-700 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {hasTasks && (
                      <span className="flex items-center gap-1">
                        {hasOverdue && (
                          <span className="w-2 h-2 rounded-full bg-rose-500" title="Overdue task" />
                        )}
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                            hasUncompleted
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {dayTasks.length}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Tasks Snippets in Cell */}
                  <div className="mt-1 space-y-1 overflow-hidden flex-1">
                    {dayTasks.slice(0, 2).map(t => (
                      <div
                        key={t.id}
                        className={`text-[10px] truncate px-1.5 py-0.5 rounded font-medium flex items-center gap-1 ${
                          t.completed
                            ? 'line-through text-slate-400 bg-slate-100 dark:bg-slate-800'
                            : isOverdue(t.dueDate, t.completed)
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-semibold'
                            : 'bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                        }`}
                        title={t.title}
                      >
                        <span className={`w-1 h-1 rounded-full shrink-0 ${t.completed ? 'bg-emerald-400' : 'bg-amber-500'}`} />
                        <span className="truncate">{t.title}</span>
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-[9px] text-slate-400 pl-1 font-medium">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Today
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Important Task
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Overdue
              </span>
            </div>
            <span>Click any day to view & add agenda</span>
          </div>
        </div>

        {/* Selected Day Agenda Drawer / Column */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {formatFriendlyDate(selectedDateStr)}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            <button
              onClick={() =>
                openQuickAddWithProps({
                  dueDate: selectedDateStr,
                  isImportant: true,
                  priority: 'high',
                  type: 'standard',
                })
              }
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Important</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['all', 'pending', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`flex-1 py-1 text-xs font-medium rounded-lg capitalize transition cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List of Tasks for Selected Date */}
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[460px]">
            {selectedDateTasks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <Star className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No important tasks scheduled for this day.
                </p>
                <button
                  onClick={() =>
                    openQuickAddWithProps({
                      dueDate: selectedDateStr,
                      isImportant: true,
                      priority: 'high',
                    })
                  }
                  className="mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add one now
                </button>
              </div>
            ) : (
              selectedDateTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={setEditingTask}
                  showDate={false}
                />
              ))
            )}
          </div>

          {/* Undated Important Milestones */}
          {undatedImportantTasks.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Undated Important Milestones
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {undatedImportantTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                    showDate={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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
