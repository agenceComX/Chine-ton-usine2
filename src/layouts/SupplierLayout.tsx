import React from 'react';
import SupplierSidebar from '../components/SupplierSidebar';

const SupplierLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <SupplierSidebar />
      <main className="flex-1 ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default SupplierLayout;
