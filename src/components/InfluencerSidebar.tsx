import React, { useState } from 'react';
import {
    Users,
    Gift,
    Star,
    Search,
    BarChart3,
    Menu,
    X,
    Bell,
    User,
    ChevronDown,
    LogOut
} from 'lucide-react';

interface InfluencerSidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const InfluencerSidebar: React.FC<InfluencerSidebarProps> = ({
    activeSection,
    setActiveSection,
    isOpen,
    setIsOpen
}) => {
    const menuItems = [
        { id: 'collaborations', label: 'Mes collaborations', icon: Users },
        { id: 'referral', label: 'Parrainage', icon: Gift },
        { id: 'stars', label: 'Influenceurs stars', icon: Star },
        { id: 'search', label: 'Rechercher un influenceur', icon: Search },
        { id: 'stats', label: 'Statistiques', icon: BarChart3 }
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Dashboard Influenceur
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeSection === item.id
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
};

export default InfluencerSidebar;
