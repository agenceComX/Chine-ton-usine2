import React, { useState } from 'react';
import {
    Menu,
    Bell,
    User,
    ChevronDown,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface InfluencerTopbarProps {
    setSidebarOpen: (open: boolean) => void;
}

const InfluencerTopbar: React.FC<InfluencerTopbarProps> = ({ setSidebarOpen }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notifications] = useState(3); // Nombre de notifications non lues
    const { user, logout } = useAuth();

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Menu burger pour mobile */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <Menu size={24} />
                </button>

                {/* Titre */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white hidden lg:block">
                    Dashboard Influenceur
                </h1>

                {/* Actions utilisateur */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative">
                            <Bell size={20} />
                            {notifications > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {notifications}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Menu utilisateur */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <span className="hidden md:block font-medium">
                                {user?.name || user?.email || 'Influenceur'}
                            </span>
                            <ChevronDown size={16} />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                <button
                                    onClick={() => {
                                        logout();
                                        setShowUserMenu(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                                >
                                    <LogOut size={16} />
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfluencerTopbar;
