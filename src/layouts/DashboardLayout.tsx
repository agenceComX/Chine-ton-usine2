import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-6 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
