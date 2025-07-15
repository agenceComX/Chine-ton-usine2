import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { emergencyLogout } from '../utils/clearSession';

const QuickLogout: React.FC = () => {
    const { user, logout } = useAuth();

    const handleQuickLogout = async () => {
        try {
            await logout();
            // Si la déconnexion normale ne fonctionne pas, rediriger manuellement
            setTimeout(() => {
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
            }, 1000);
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            // En cas d'erreur, utiliser la déconnexion d'urgence
            emergencyLogout();
        }
    };

    const handleDoubleClick = () => {
        // Double-clic pour déconnexion d'urgence
        emergencyLogout();
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="flex flex-col gap-2">
                <button
                    onClick={handleQuickLogout}
                    onDoubleClick={handleDoubleClick}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center gap-2"
                    title="Clic: déconnexion normale | Double-clic: déconnexion d'urgence"
                >
                    <LogOut size={20} />
                    <span className="hidden sm:inline text-sm font-semibold">Déconnexion</span>
                </button>
                <div className="text-xs text-gray-500 text-center hidden sm:block">
                    Double-clic pour<br />déconnexion d'urgence
                </div>
            </div>
        </div>
    );
};

export default QuickLogout;
