import React, { useState, useEffect } from 'react';
import type { Task, Category, Priority, TaskType } from '../../types/task';
import { useTasks } from '../../context/TaskContext';
import { getTodayString } from '../../utils/dateUtils';
import { X, Star, Calendar, Clock, Tag, Flag } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultValues?: Partial<Task>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  defaultValues,
}) => {
  const { addTask, updateTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [category, setCategory] = useState<Category>('Work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isImportant, setIsImportant] = useState(false);
  const [taskType, setTaskType] = useState<TaskType>('standard');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate || '');
      setDueTime(taskToEdit.dueTime || '');
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setIsImportant(taskToEdit.isImportant);
      setTaskType(taskToEdit.type);
    } else {
      // Default creation state
      setTitle('');
      setDescription('');
      setDueDate(defaultValues?.dueDate || getTodayString());
      setDueTime(defaultValues?.dueTime || '');
      setCategory(defaultValues?.category || 'Work');
      setPriority(defaultValues?.priority || 'medium');
      setIsImportant(defaultValues?.isImportant ?? false);
      setTaskType(defaultValues?.type || 'standard');
    }
  }, [taskToEdit, defaultValues, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        dueTime: dueTime || undefined,
        category,
        priority,
        isImportant,
        type: taskType,
        isDailyDefault: taskType === 'daily_default',
        forDate: taskType === 'daily_today' ? (dueDate || getTodayString()) : undefined,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        dueDate: taskType === 'daily_today' ? getTodayString() : (dueDate || undefined),
        dueTime: dueTime || undefined,
        category,
        priority,
        isImportant,
        type: taskType,
        isDailyDefault: taskType === 'daily_default',
        completedDates: taskType === 'daily_default' ? [] : undefined,
        forDate: taskType === 'daily_today' ? getTodayString() : undefined,
      });
    }

    onClose();
  };

  const categories: Category[] = ['Work', 'Personal', 'Health', 'Study', 'Finance', 'Errands'];
  const priorities: { value: Priority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Task Type selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Task Scope / Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTaskType('standard')}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition text-center cursor-pointer ${
                  taskType === 'standard'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Standard Task
              </button>
              <button
                type="button"
                onClick={() => setTaskType('daily_today')}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition text-center cursor-pointer ${
                  taskType === 'daily_today'
                    ? 'border-sky-600 bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Today Alone
              </button>
              <button
                type="button"
                onClick={() => setTaskType('daily_default')}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition text-center cursor-pointer ${
                  taskType === 'daily_default'
                    ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Daily Habit (Routine)
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g., Finalize presentation slides"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add details, notes, or links..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                <Tag className="w-3.5 h-3.5" /> Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                <Flag className="w-3.5 h-3.5" /> Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {priorities.map(p => (
                  <option key={p.value} value={p.value}>
                    {p.label} Priority
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date & Due Time (Hidden for daily routines) */}
          {taskType !== 'daily_default' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Due Date
                </label>
                <input
                  type="date"
                  value={taskType === 'daily_today' ? getTodayString() : dueDate}
                  disabled={taskType === 'daily_today'}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  <Clock className="w-3.5 h-3.5" /> Due Time
                </label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={e => setDueTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          )}

          {/* Mark as Important Flag */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsImportant(!isImportant)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                isImportant
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className={`w-4 h-4 ${isImportant ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                <span className="text-sm font-medium">Mark as Important (Live Calendar)</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isImportant ? 'bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200' : 'text-slate-400'}`}>
                {isImportant ? 'Starred' : 'Off'}
              </span>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
