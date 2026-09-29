import type { Task } from '../types/task';
import { getTodayString, formatDateToISO, getWeekDates } from './dateUtils';

export function getInitialTasks(): Task[] {
  const today = getTodayString();
  const todayDate = new Date();
  const weekDates = getWeekDates(todayDate);

  const yesterdayDate = new Date();
  yesterdayDate.setDate(todayDate.getDate() - 1);
  const yesterday = formatDateToISO(yesterdayDate);

  const tomorrowDate = new Date();
  tomorrowDate.setDate(todayDate.getDate() + 1);
  const tomorrow = formatDateToISO(tomorrowDate);

  const dayAfterTomorrowDate = new Date();
  dayAfterTomorrowDate.setDate(todayDate.getDate() + 2);

  const inFourDaysDate = new Date();
  inFourDaysDate.setDate(todayDate.getDate() + 4);
  const inFourDays = formatDateToISO(inFourDaysDate);

  return [
    // --- 1. DEFAULT DAILY TASKS (Recurring habits/routines) ---
    {
      id: 'daily-1',
      title: 'Morning 20-min cardio & stretching',
      description: 'Start the day active with mobility drills & light jog',
      completed: true,
      completedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      priority: 'high',
      isImportant: true,
      category: 'Health',
      type: 'daily_default',
      isDailyDefault: true,
      completedDates: [yesterday, today],
      createdAt: new Date(Date.now() - 7 * 86400 * 1000).toISOString(),
    },
    {
      id: 'daily-2',
      title: 'Daily engineering standup & priority sync',
      description: 'Review blocked PRs and align on sprint commitments',
      completed: true,
      completedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      dueTime: '10:00',
      priority: 'high',
      isImportant: true,
      category: 'Work',
      type: 'daily_default',
      isDailyDefault: true,
      completedDates: [today],
      createdAt: new Date(Date.now() - 14 * 86400 * 1000).toISOString(),
    },
    {
      id: 'daily-3',
      title: 'Drink 2.5 Liters of water',
      description: 'Track hydration throughout work hours',
      completed: false,
      priority: 'medium',
      isImportant: false,
      category: 'Health',
      type: 'daily_default',
      isDailyDefault: true,
      completedDates: [yesterday],
      createdAt: new Date(Date.now() - 10 * 86400 * 1000).toISOString(),
    },
    {
      id: 'daily-4',
      title: 'Review inbox & clear notification queue',
      description: 'Reach inbox zero before wrapping up the day',
      completed: false,
      dueTime: '17:30',
      priority: 'medium',
      isImportant: false,
      category: 'Work',
      type: 'daily_default',
      isDailyDefault: true,
      completedDates: [],
      createdAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    },
    {
      id: 'daily-5',
      title: 'Read 20 pages of technical architecture book',
      description: 'Designing Data-Intensive Applications',
      completed: false,
      priority: 'low',
      isImportant: false,
      category: 'Study',
      type: 'daily_default',
      isDailyDefault: true,
      completedDates: [yesterday],
      createdAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
    },

    // --- 2. TODAY-ALONE TASKS (Daily page: added specifically for today) ---
    {
      id: 'today-alone-1',
      title: 'Submit quarterly vendor expense receipts',
      description: 'Send PDF invoice to accounting before 5 PM deadline',
      completed: false,
      dueDate: today,
      dueTime: '17:00',
      priority: 'high',
      isImportant: true,
      category: 'Finance',
      type: 'daily_today',
      forDate: today,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'today-alone-2',
      title: 'Pick up dry cleaning package from concierge',
      description: 'Ticket #4920 at reception',
      completed: true,
      completedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      dueDate: today,
      priority: 'low',
      isImportant: false,
      category: 'Errands',
      type: 'daily_today',
      forDate: today,
      createdAt: new Date().toISOString(),
    },

    // --- 3. WEEKLY & UPCOMING TASKS (Non-daily tasks) ---
    {
      id: 'task-week-1',
      title: 'Finalize Q4 API architecture proposal',
      description: 'Write RFC document and share with principal architects',
      completed: false,
      dueDate: formatDateToISO(weekDates[1] || tomorrowDate), // Tuesday or tomorrow
      dueTime: '14:00',
      priority: 'high',
      isImportant: true,
      category: 'Work',
      type: 'standard',
      createdAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    },
    {
      id: 'task-week-2',
      title: 'Schedule quarterly car maintenance service',
      description: 'Tire rotation, oil check and brake inspection',
      completed: false,
      dueDate: formatDateToISO(weekDates[2] || dayAfterTomorrowDate),
      dueTime: '09:30',
      priority: 'medium',
      isImportant: false,
      category: 'Errands',
      type: 'standard',
      createdAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
    },
    {
      id: 'task-week-3',
      title: 'Annual Dental cleaning appointment',
      description: 'Downtown Health Center - Dr. Reynolds',
      completed: false,
      dueDate: formatDateToISO(weekDates[4] || inFourDaysDate),
      dueTime: '15:00',
      priority: 'high',
      isImportant: true,
      category: 'Health',
      type: 'standard',
      createdAt: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    },
    {
      id: 'task-week-4',
      title: 'Grocery haul & meal prep for upcoming week',
      description: 'Buy organic greens, salmon fillets, quinoa, and almonds',
      completed: false,
      dueDate: formatDateToISO(weekDates[5] || inFourDaysDate),
      dueTime: '11:00',
      priority: 'low',
      isImportant: false,
      category: 'Personal',
      type: 'standard',
      createdAt: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    },
    {
      id: 'task-week-5',
      title: 'Review home insurance policy renewal',
      description: 'Compare premium rates with 2 alternative providers',
      completed: false,
      dueDate: inFourDays,
      priority: 'medium',
      isImportant: false,
      category: 'Finance',
      type: 'standard',
      createdAt: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
    },

    // --- 4. COMPLETED RECENT TASKS (For Home & Dashboard) ---
    {
      id: 'comp-1',
      title: 'Migrate Redis cluster to latest TLS configuration',
      description: 'Zero-downtime rollover completed successfully',
      completed: true,
      completedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      dueDate: yesterday,
      priority: 'high',
      isImportant: true,
      category: 'Work',
      type: 'standard',
      createdAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
    },
    {
      id: 'comp-2',
      title: 'Pay monthly electricity and fiber broadband bills',
      description: 'Auto-debit confirmation recorded',
      completed: true,
      completedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      dueDate: yesterday,
      priority: 'medium',
      isImportant: false,
      category: 'Finance',
      type: 'standard',
      createdAt: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
    },
    {
      id: 'comp-3',
      title: 'Complete React 19 server actions workshop modules',
      description: 'Built prototype app and passed assessment quiz',
      completed: true,
      completedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      dueDate: yesterday,
      priority: 'medium',
      isImportant: false,
      category: 'Study',
      type: 'standard',
      createdAt: new Date(Date.now() - 6 * 86400 * 1000).toISOString(),
    },

    // --- 5. IMPORTANT CALENDAR TASKS (Highlighted milestones) ---
    {
      id: 'important-milestone-1',
      title: 'Investor Product Demo & Board Presentation',
      description: 'Showcase beta release features and live metrics walkthrough',
      completed: false,
      dueDate: tomorrow,
      dueTime: '11:00',
      priority: 'high',
      isImportant: true,
      category: 'Work',
      type: 'standard',
      createdAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    },
    {
      id: 'important-milestone-2',
      title: 'Family Anniversary Dinner & Celebration',
      description: 'Table reserved at Riverside Garden Bistro',
      completed: false,
      dueDate: formatDateToISO(weekDates[6] || inFourDaysDate),
      dueTime: '19:30',
      priority: 'high',
      isImportant: true,
      category: 'Personal',
      type: 'standard',
      createdAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    }
  ];
}
