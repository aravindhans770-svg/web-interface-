import React, { useState } from 'react';
import type { Task } from '../../types/task';
import { useTasks } from '../../context/TaskContext';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { formatFriendlyDate, isOverdue } from '../../utils/dateUtils';
import {
  Check,
  Star,
  Trash2,
  Calendar,
  Clock,
  MoreVertical,
  Edit2,
  AlertCircle
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  showDate?: boolean;
  isDailyMode?: boolean;
  dailyDateStr?: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  showDate = true,
  isDailyMode = false,
  dailyDateStr,
}) => {
  const { toggleTask, toggleDailyDefault, deleteTask, deleteTodayAloneTask, toggleImportance } =
    useTasks();
  const [showMenu, setShowMenu] = useState(false);

  // Check completion depending on mode
  const isCompleted = isDailyMode && task.isDailyDefault && dailyDateStr
    ? (task.completedDates || []).includes(dailyDateStr)
    : task.completed;

  const handleToggle = () => {
    if (task.isDailyDefault) {
      toggleDailyDefault(task.id, dailyDateStr);
    } else {
      toggleTask(task.id);
    }
  };

  const handleDelete = () => {
    if (task.type === 'daily_today') {
      deleteTodayAloneTask(task.id);
    } else {
      deleteTask(task.id);
    }
  };

  const overdue = isOverdue(task.dueDate, isCompleted);

  return (
    <div
      className={`group relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
        isCompleted
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-75'
          : overdue
          ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 hover:border-rose-300 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-sm'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
          isCompleted
            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 bg-white dark:bg-slate-800'
        }`}
        title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        aria-label="Toggle task completion"
      >
        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm sm:text-base font-medium break-words ${
              isCompleted
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {task.title}
          </span>

          {task.type === 'daily_today' && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              Today Alone
            </span>
          )}

          {task.isDailyDefault && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
              Daily Habit
            </span>
          )}
        </div>

        {task.description && (
          <p
            className={`mt-1 text-xs sm:text-sm line-clamp-2 ${
              isCompleted ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Badges & Meta */}
        <div className="mt-2.5 flex items-center flex-wrap gap-2 text-xs">
          <CategoryBadge category={task.category} />
          <PriorityBadge priority={task.priority} />

          {/* Date info */}
          {showDate && task.dueDate && (
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                overdue
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {overdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
              {formatFriendlyDate(task.dueDate)}
            </span>
          )}

          {task.dueTime && (
            <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {task.dueTime}
            </span>
          )}

          {/* Daily streak count if habit */}
          {task.isDailyDefault && task.completedDates && task.completedDates.length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
              🔥 {task.completedDates.length} days done
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Important Star */}
        <button
          onClick={() => toggleImportance(task.id)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            task.isImportant
              ? 'text-amber-500 hover:text-amber-600'
              : 'text-slate-300 hover:text-slate-400 dark:text-slate-600 dark:hover:text-slate-400'
          }`}
          title={task.isImportant ? 'Unmark important' : 'Mark as important'}
          aria-label="Toggle importance"
        >
          <Star className={`w-4 h-4 ${task.isImportant ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Options / Delete */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                {onEdit && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(task);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    Edit Task
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
