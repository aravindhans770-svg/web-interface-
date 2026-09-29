import React from 'react';
import type { Category } from '../../types/task';
import { Briefcase, User, HeartPulse, BookOpen, Wallet, ShoppingBag } from 'lucide-react';

export const CategoryBadge: React.FC<{ category: Category }> = ({ category }) => {
  const configs: Record<Category, { icon: React.ReactNode; bg: string; text: string }> = {
    Work: {
      icon: <Briefcase className="w-3 h-3" />,
      bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/60',
      text: 'Work',
    },
    Personal: {
      icon: <User className="w-3 h-3" />,
      bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/60',
      text: 'Personal',
    },
    Health: {
      icon: <HeartPulse className="w-3 h-3" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
      text: 'Health',
    },
    Study: {
      icon: <BookOpen className="w-3 h-3" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/60',
      text: 'Study',
    },
    Finance: {
      icon: <Wallet className="w-3 h-3" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      text: 'Finance',
    },
    Errands: {
      icon: <ShoppingBag className="w-3 h-3" />,
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
      text: 'Errands',
    },
  };

  const item = configs[category] || configs.Work;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${item.bg}`}
    >
      {item.icon}
      <span>{item.text}</span>
    </span>
  );
};
