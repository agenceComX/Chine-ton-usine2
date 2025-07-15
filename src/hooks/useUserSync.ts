import { useEffect, useRef } from 'react';
import { adminUserServiceFixed } from '../services/adminUserServiceFixed';

/**
 * Hook personnalisé pour gérer la synchronisation automatique des utilisateurs
 * Firebase Auth vers Firestore
 */
export const useUserSync = (enabled: boolean = true) => {
    const unsubscribeRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (enabled && !unsubscribeRef.current) {
            // Démarrer la surveillance des connexions utilisateurs
            unsubscribeRef.current = adminUserServiceFixed.startUserSyncMonitoring();

            console.log('🔄 Surveillance automatique des utilisateurs activée');
        }

        // Cleanup function
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
                console.log('🛑 Surveillance automatique des utilisateurs désactivée');
            }
        };
    }, [enabled]);

    /**
     * Synchroniser manuellement les utilisateurs visibles
     */
    const syncUsers = async () => {
        try {
            const result = await adminUserServiceFixed.syncAllVisibleUsers();
            return result;
        } catch (error) {
            console.error('Erreur lors de la synchronisation manuelle:', error);
            return {
                success: false,
                count: 0,
                error: 'Erreur lors de la synchronisation'
            };
        }
    };

    /**
     * Obtenir les statistiques des utilisateurs
     */
    const getUserStats = async () => {
        try {
            return await adminUserServiceFixed.getUserStats();
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            return {
                total: 0,
                byRole: {
                    admin: 0,
                    supplier: 0,
                    customer: 0,
                    sourcer: 0
                },
                active: 0,
                inactive: 0
            };
        }
    };

    return {
        syncUsers,
        getUserStats
    };
};

export default useUserSync;
