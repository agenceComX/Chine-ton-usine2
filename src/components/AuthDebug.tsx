import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthDebug: React.FC = () => {
    const { user, loading } = useAuth();

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
            <h4 className="font-bold mb-2">🔍 Debug Auth</h4>
            <div>
                <strong>Loading:</strong> {loading ? 'Oui' : 'Non'}
            </div>
            <div>
                <strong>User:</strong> {user ? `${user.name} (${user.role})` : 'Non connecté'}
            </div>
            {user && (
                <div>
                    <strong>ID:</strong> {user.id}
                </div>
            )}
            <div className="mt-2">
                <a
                    href={user?.role === 'supplier' ? `/supplier/${user.id}` : '/profile'}
                    className="text-blue-300 underline"
                >
                    → Aller au profil
                </a>
            </div>
        </div>
    );
};

export default AuthDebug;
