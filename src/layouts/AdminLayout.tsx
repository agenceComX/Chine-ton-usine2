import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Footer from '../components/Footer';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Structure principale avec sidebar et contenu */}
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 pl-6">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer fixe en pleine largeur */}
      <Footer inAdminLayout={true} />
    </div>
  );
};

export default AdminLayout;
