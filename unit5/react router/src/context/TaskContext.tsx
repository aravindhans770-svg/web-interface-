import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { Task, ViewTab, Category, Priority } from '../types/task';
import { getInitialTasks } from '../utils/initialData';
import { getTodayString } from '../utils/dateUtils';

interface TaskContextType {
  tasks: Task[];
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  quickAddDefaultProps?: Partial<Task>;
  openQuickAddWithProps: (props?: Partial<Task>) => void;

  // Task actions
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  // Daily specific actions
  toggleDailyDefault: (id: string, dateStr?: string) => void;
  addDailyDefault: (title: string, category: Category, priority: Priority, description?: string, isImportant?: boolean) => void;
  deleteDailyDefault: (id: string) => void;
  addTodayAloneTask: (title: string, priority: Priority, category: Category, dueTime?: string, description?: string, isImportant?: boolean) => void;
  deleteTodayAloneTask: (id: string) => void;

  // Weekly / Calendar
  rescheduleTask: (id: string, newDueDate: string) => void;
  toggleImportance: (id: string) => void;

  // Bulk & Data management
  clearCompletedTasks: () => void;
  resetToSampleData: () => void;
  exportData: () => void;
  importData: (jsonData: string) => boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'todo_app_tasks_v2';
const THEME_KEY = 'todo_app_theme';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    return getInitialTasks();
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDefaultProps, setQuickAddDefaultProps] = useState<Partial<Task> | undefined>(undefined);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Sync theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Persist tasks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to persist tasks', e);
    }
  }, [tasks]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']
      });
    } catch {
      // Ignore if canvas-confetti is not available
    }
  };

  const openQuickAddWithProps = (props?: Partial<Task>) => {
    setQuickAddDefaultProps(props);
    setIsQuickAddOpen(true);
  };

  // Add standard or custom task
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Toggle regular task completion
  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const willComplete = !t.completed;
          if (willComplete) {
            triggerConfetti();
          }
          return {
            ...t,
            completed: willComplete,
            completedAt: willComplete ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  // Daily default task toggle (by specific date, default to today)
  const toggleDailyDefault = (id: string, dateStr: string = getTodayString()) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id && t.isDailyDefault) {
          const completedDates = t.completedDates || [];
          const isDoneForDate = completedDates.includes(dateStr);
          let newDates: string[];
          if (isDoneForDate) {
            newDates = completedDates.filter(d => d !== dateStr);
          } else {
            newDates = [...completedDates, dateStr];
            if (dateStr === getTodayString()) {
              triggerConfetti();
            }
          }
          return {
            ...t,
            completedDates: newDates,
            // completed property reflects whether it's done for today
            completed: dateStr === getTodayString() ? !isDoneForDate : t.completed,
          };
        }
        return t;
      })
    );
  };

  // Add new daily default routine
  const addDailyDefault = (
    title: string,
    category: Category,
    priority: Priority,
    description?: string,
    isImportant: boolean = false
  ) => {
    const newTask: Task = {
      id: 'daily_' + Date.now(),
      title,
      description,
      completed: false,
      priority,
      isImportant,
      category,
      type: 'daily_default',
      isDailyDefault: true,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const deleteDailyDefault = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Add today-alone task
  const addTodayAloneTask = (
    title: string,
    priority: Priority,
    category: Category,
    dueTime?: string,
    description?: string,
    isImportant: boolean = false
  ) => {
    const today = getTodayString();
    const newTask: Task = {
      id: 'today_alone_' + Date.now(),
      title,
      description,
      completed: false,
      dueDate: today,
      dueTime,
      priority,
      isImportant,
      category,
      type: 'daily_today',
      forDate: today,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const deleteTodayAloneTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Reschedule
  const rescheduleTask = (id: string, newDueDate: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, dueDate: newDueDate } : t))
    );
  };

  // Toggle importance flag
  const toggleImportance = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, isImportant: !t.isImportant } : t))
    );
  };

  // Clear completed
  const clearCompletedTasks = () => {
    setTasks(prev => prev.filter(t => !t.completed && t.type !== 'daily_default'));
  };

  // Reset data
  const resetToSampleData = () => {
    const samples = getInitialTasks();
    setTasks(samples);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
  };

  // Export JSON
  const exportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `todo-backup-${getTodayString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        setTasks(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const contextValue = useMemo(
    () => ({
      tasks,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      theme,
      toggleTheme,
      isQuickAddOpen,
      setIsQuickAddOpen,
      quickAddDefaultProps,
      openQuickAddWithProps,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      toggleDailyDefault,
      addDailyDefault,
      deleteDailyDefault,
      addTodayAloneTask,
      deleteTodayAloneTask,
      rescheduleTask,
      toggleImportance,
      clearCompletedTasks,
      resetToSampleData,
      exportData,
      importData,
    }),
    [tasks, activeTab, searchQuery, theme, isQuickAddOpen, quickAddDefaultProps]
  );

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
