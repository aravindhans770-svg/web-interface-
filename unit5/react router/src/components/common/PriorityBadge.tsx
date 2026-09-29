import React from 'react';
import type { Priority } from '../../types/task';

export const PriorityBadge: React.FC<{ priority: Priority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'sm',
}) => {
  const configs: Record<Priority, { label: string; bg: string; text: string; dot: string }> = {
    high: {
      label: 'High',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60',
      text: 'text-rose-700 dark:text-rose-400',
      dot: 'bg-rose-500',
    },
    medium: {
      label: 'Medium',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
      text: 'text-amber-700 dark:text-amber-400',
      dot: 'bg-amber-500',
    },
    low: {
      label: 'Low',
      bg: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700',
      text: 'text-slate-600 dark:text-slate-400',
      dot: 'bg-slate-400',
    },
  };

  const c = configs[priority];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${c.bg} ${c.text} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};
