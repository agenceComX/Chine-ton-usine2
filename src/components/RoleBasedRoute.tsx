import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirection intelligente basée sur le rôle de l'utilisateur
    const roleRedirects: Record<UserRole, string> = {
      admin: '/admin/dashboard',
      supplier: '/supplier/dashboard',
      customer: '/dashboard',
      sourcer: '/sourcer/dashboard',
      influencer: '/sourcer/dashboard'
    };

    return <Navigate to={roleRedirects[user.role]} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;