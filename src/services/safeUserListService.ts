/**
 * 🎯 SOLUTION FINALE - Service de récupération d'utilisateurs SANS mise à jour
 * 
 * Ce service récupère les utilisateurs SANS déclencher de mise à jour
 * de l'utilisateur connecté pour éviter les effets de bord
 */

import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';
import type { AdminUser } from './adminUserServiceFixed';

class SafeUserListService {
    private collectionName = 'users';

    /**
     * Récupérer tous les utilisateurs SANS aucune modification
     * Cette méthode ne touche à rien, elle fait juste une lecture
     */
    async getAllUsersReadOnly(): Promise<AdminUser[]> {
        try {
            console.log('🔍 SAFE: Récupération lecture seule des utilisateurs...');

            const q = query(
                collection(db, this.collectionName),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const users: AdminUser[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                users.push({
                    uid: doc.id,
                    ...data
                } as AdminUser);
            });

            console.log(`✅ SAFE: ${users.length} utilisateurs récupérés (lecture seule)`);
            return users;

        } catch (error) {
            console.error('❌ SAFE: Erreur lors de la récupération:', error);
            return [];
        }
    }
}

export const safeUserListService = new SafeUserListService();
