export type Priority = 'low' | 'medium' | 'high';

export type Category = 'Work' | 'Personal' | 'Health' | 'Study' | 'Finance' | 'Errands';

export type TaskType = 'standard' | 'daily_default' | 'daily_today';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string; // ISO date string
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  isImportant: boolean; // Flagged as important / starred
  category: Category;
  type: TaskType;
  createdAt: string; // ISO date string
  // For daily default tasks:
  isDailyDefault?: boolean; // persistent recurring habit/routine
  completedDates?: string[]; // Array of YYYY-MM-DD strings when this daily task was completed
  // For daily today-only tasks:
  forDate?: string; // YYYY-MM-DD that this today-alone task belongs to
}

export type ViewTab = 'home' | 'daily' | 'weekly' | 'important' | 'dashboard';

export interface TaskFilter {
  searchQuery: string;
  category: Category | 'all';
  priority: Priority | 'all';
  completedStatus: 'all' | 'pending' | 'completed';
}
