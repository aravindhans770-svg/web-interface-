import React, { useState, useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import type { Task } from '../../types/task';
import { TaskItem } from '../common/TaskItem';
import { TaskModal } from '../modals/TaskModal';
import {
  getWeekDates,
  formatDateToISO,
  getTodayString,
} from '../../utils/dateUtils';
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from 'lucide-react';

export const WeeklyPage: React.FC = () => {
  const { tasks, openQuickAddWithProps } = useTasks();

  // Current base date for the weekly view
  const [currentBaseDate, setCurrentBaseDate] = useState<Date>(new Date());
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // 7 days of current week (Monday to Sunday)
  const weekDays = useMemo(() => {
    return getWeekDates(currentBaseDate);
  }, [currentBaseDate]);

  const todayStr = getTodayString();

  const handlePrevWeek = () => {
    const d = new Date(currentBaseDate);
    d.setDate(d.getDate() - 7);
    setCurrentBaseDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentBaseDate);
    d.setDate(d.getDate() + 7);
    setCurrentBaseDate(d);
  };

  const handleCurrentWeek = () => {
    setCurrentBaseDate(new Date());
  };

  // Filter tasks: exclude daily defaults ("tasks apart from daily defaults are displayed for weekly basis")
  const weeklyEligibleTasks = useMemo(() => {
    return tasks.filter(t => !t.isDailyDefault && t.type !== 'daily_default');
  }, [tasks]);

  // Group tasks by day dateStr (YYYY-MM-DD)
  const weekTasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    weekDays.forEach(day => {
      map.set(formatDateToISO(day), []);
    });

    weeklyEligibleTasks.forEach(task => {
      if (task.dueDate && map.has(task.dueDate)) {
        map.get(task.dueDate)?.push(task);
      }
    });

    return map;
  }, [weeklyEligibleTasks, weekDays]);

  // Tasks with no dueDate or not in this week
  const unscheduledTasks = useMemo(() => {
    const weekDateStrings = new Set(weekDays.map(d => formatDateToISO(d)));
    return weeklyEligibleTasks.filter(
      task => !task.dueDate || (!weekDateStrings.has(task.dueDate) && !task.completed)
    );
  }, [weeklyEligibleTasks, weekDays]);

  const startFormatted = weekDays[0].toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endFormatted = weekDays[6].toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header & Week Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <CalendarRange className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Weekly Planner
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Scheduled non-daily tasks organized across the 7 days of the week.
              </p>
            </div>
          </div>

          {/* Week Selector */}
          <div className="flex items-center gap-2 self-start sm:self-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={handlePrevWeek}
              className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 whitespace-nowrap">
              {startFormatted} – {endFormatted}
            </div>
            <button
              onClick={handleNextWeek}
              className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleCurrentWeek}
              className="ml-1 px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-xs hover:bg-indigo-50 transition cursor-pointer"
            >
              This Week
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {weekDays.map(day => {
          const dateStr = formatDateToISO(day);
          const isToday = dateStr === todayStr;
          const dayTasks = weekTasksByDay.get(dateStr) || [];
          const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = day.getDate();
          const completedInDay = dayTasks.filter(t => t.completed).length;

          return (
            <div
              key={dateStr}
              className={`flex flex-col rounded-2xl border transition-all min-h-[380px] ${
                isToday
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800 shadow-sm ring-1 ring-blue-400/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Day Header */}
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {dayName}
                    </span>
                    {isToday && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {dayNum}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {dayTasks.length > 0 && (
                    <span className="text-[11px] font-semibold text-slate-400 px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                      {completedInDay}/{dayTasks.length}
                    </span>
                  )}
                  {/* Quick Add for this day */}
                  <button
                    onClick={() =>
                      openQuickAddWithProps({
                        dueDate: dateStr,
                        type: 'standard',
                      })
                    }
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition cursor-pointer"
                    title={`Add task for ${dayName}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tasks List for Day */}
              <div className="p-2.5 space-y-2 flex-1 overflow-y-auto max-h-[500px]">
                {dayTasks.length === 0 ? (
                  <div className="h-28 flex items-center justify-center text-center p-2">
                    <span className="text-xs text-slate-300 dark:text-slate-600">
                      No tasks
                    </span>
                  </div>
                ) : (
                  dayTasks.map(task => (
                    <div key={task.id} className="relative group">
                      <TaskItem
                        task={task}
                        onEdit={setEditingTask}
                        showDate={false}
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Quick Add Footer button */}
              <div className="p-2 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <button
                  onClick={() =>
                    openQuickAddWithProps({
                      dueDate: dateStr,
                      type: 'standard',
                    })
                  }
                  className="w-full py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unscheduled / Flexible Tasks Drawer/Section */}
      {unscheduledTasks.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-slate-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Unscheduled or Other Week Tasks
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {unscheduledTasks.length}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {unscheduledTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                showDate={true}
              />
            ))}
          </div>
        </div>
      )}

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
