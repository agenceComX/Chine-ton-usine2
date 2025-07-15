/**
 * 🛡️ SERVICE ULTRA-SÉCURISÉ - Création utilisateur SANS AUCUN risque de déconnexion
 * 
 * Ce service garantit 100% qu'il n'y aura AUCUN appel à Firebase Auth
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';
import { UserRole } from '../types';

export interface CreateUserData {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    isActive?: boolean;
}

/**
 * Service ultra-minimaliste qui NE FAIT QUE du Firestore
 */
class UltraSafeUserCreationService {
    private collectionName = 'users';

    /**
     * Créer un utilisateur UNIQUEMENT dans Firestore
     * AUCUN appel à Firebase Auth - IMPOSSIBLE de déconnecter
     */
    async createUserFirestoreOnly(userData: CreateUserData): Promise<{
        success: boolean;
        user?: any;
        error?: string;
    }> {
        try {
            console.log('🛡️ ULTRA-SAFE: Création utilisateur Firestore ONLY');
            console.log('📊 Données:', { email: userData.email, name: userData.name, role: userData.role });

            // Vérifications basiques
            if (!userData.email || !userData.email.includes('@')) {
                return { success: false, error: 'Email invalide' };
            }

            if (!userData.name || userData.name.trim().length < 2) {
                return { success: false, error: 'Nom invalide' };
            }

            // Générer un ID unique
            const uid = `ultrasafe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const now = new Date().toISOString();

            // Document utilisateur minimal
            const userDoc = {
                id: uid,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                isActive: userData.isActive ?? true,
                language: 'fr',
                currency: 'EUR',
                favorites: [],
                browsingHistory: [],
                messages: [],
                subscription: 'free',
                createdAt: now,
                updatedAt: now,
                created_at: now,
                updated_at: now,
                userType: 'ultra-safe-firestore-only'
            };

            // SEULEMENT Firestore - AUCUN Auth
            await setDoc(doc(db, this.collectionName, uid), userDoc);

            console.log('✅ ULTRA-SAFE: Utilisateur créé avec succès dans Firestore');
            console.log('🔒 GARANTIE: Aucun appel Firebase Auth effectué');

            return {
                success: true,
                user: { ...userDoc, uid }
            };

        } catch (error: any) {
            console.error('❌ ULTRA-SAFE: Erreur:', error);
            return {
                success: false,
                error: error.message || 'Erreur lors de la création'
            };
        }
    }
}

export const ultraSafeUserCreationService = new UltraSafeUserCreationService();
