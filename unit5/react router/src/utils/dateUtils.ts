/**
 * Date Utility Functions
 */

export function getTodayString(): string {
  const d = new Date();
  return formatDateToISO(d);
}

export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatFriendlyDate(dateStr?: string): string {
  if (!dateStr) return 'No due date';
  const today = getTodayString();
  const date = parseISODate(dateStr);
  
  // Calculate relative day
  const todayDate = parseISODate(today);
  const diffTime = date.getTime() - todayDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== todayDate.getFullYear() ? 'numeric' : undefined
  });
}

export function isOverdue(dateStr?: string, completed?: boolean): boolean {
  if (!dateStr || completed) return false;
  return dateStr < getTodayString();
}

/**
 * Returns an array of 7 Date objects representing Monday to Sunday of the week containing the given date.
 */
export function getWeekDates(baseDate: Date = new Date()): Date[] {
  const d = new Date(baseDate);
  const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday
  // In Monday-first week: Mon=0, Tue=1, ..., Sun=6
  const distanceToMonday = (dayOfWeek + 6) % 7;
  
  const monday = new Date(d);
  monday.setDate(d.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push(day);
  }
  return week;
}

/**
 * Calendar grid generator for Month view
 */
export interface CalendarDay {
  date: Date;
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function getMonthCalendarDays(year: number, month: number): CalendarDay[] {
  const todayStr = getTodayString();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDayOfMonth.getDate();

  const days: CalendarDay[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = prevMonthLastDay - i;
    const date = new Date(year, month - 1, dayNumber);
    const dateStr = formatDateToISO(date);
    days.push({
      date,
      dateStr,
      dayNumber,
      isCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = formatDateToISO(date);
    days.push({
      date,
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr
    });
  }

  // Next month leading days to complete full grid (multiples of 7, usually 35 or 42)
  const remaining = (7 - (days.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    const dateStr = formatDateToISO(date);
    days.push({
      date,
      dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  return days;
}
