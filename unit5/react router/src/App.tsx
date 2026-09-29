import React from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './components/home/HomePage';
import { DailyPage } from './components/daily/DailyPage';
import { WeeklyPage } from './components/weekly/WeeklyPage';
import { ImportantCalendarPage } from './components/important/ImportantCalendarPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { TaskModal } from './components/modals/TaskModal';

const MainContent: React.FC = () => {
  const { activeTab, isQuickAddOpen, setIsQuickAddOpen, quickAddDefaultProps } = useTasks();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 max-w-7xl mx-auto w-full">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'daily' && <DailyPage />}
        {activeTab === 'weekly' && <WeeklyPage />}
        {activeTab === 'important' && <ImportantCalendarPage />}
        {activeTab === 'dashboard' && <DashboardPage />}
      </main>

      {/* Global Task Creation Modal */}
      <TaskModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultValues={quickAddDefaultProps}
      />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <MainContent />
    </TaskProvider>
  );
}
