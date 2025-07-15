import {
    collection,
    getDocs,
    doc,
    setDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, auth } from '../lib/firebaseClient';
import { User, UserRole } from '../types';

export interface CreateUserData {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    isActive?: boolean;
}

export interface AdminUser extends User {
    uid: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    lastLogin?: string;
    deletedAt?: string;
}

class AdminUserServiceV2 {
    private collectionName = 'users';

    /**
     * Créer un nouvel utilisateur via Cloud Functions (recommandé)
     * Cette méthode évite de déconnecter l'admin
     */
    async createUserWithCloudFunction(userData: CreateUserData): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
        try {
            console.log('🔥 Création d\'un nouvel utilisateur via Cloud Functions:', userData.email);

            if (!auth.currentUser) {
                return {
                    success: false,
                    error: 'Vous devez être connecté en tant qu\'administrateur'
                };
            }

            // Appeler la Cloud Function pour créer l'utilisateur
            const createUser = httpsCallable(functions, 'createUser');
            const result = await createUser(userData);

            return result.data as { success: boolean; user?: AdminUser; error?: string };

        } catch (error: any) {
            console.error('❌ Erreur lors de la création via Cloud Functions:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Créer un nouvel utilisateur directement (méthode de fallback)
     * Cette méthode crée uniquement le document Firestore
     */
    async createUserDirectly(userData: CreateUserData): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
        try {
            console.log('🔥 Création directe d\'un utilisateur (Firestore seulement):', userData.email);

            if (!auth.currentUser) {
                return {
                    success: false,
                    error: 'Vous devez être connecté en tant qu\'administrateur'
                };
            }

            // Générer un UID simulé (en production, utiliseriez l'Admin SDK)
            const fakeUID = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Créer le document utilisateur dans Firestore
            const userDoc: Omit<AdminUser, 'uid'> = {
                id: fakeUID,
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
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                last_login: undefined
            };

            await setDoc(doc(db, this.collectionName, fakeUID), userDoc);

            const newUser: AdminUser = {
                ...userDoc,
                uid: fakeUID
            };

            console.log('✅ Document utilisateur créé (Firebase Auth requis séparément)');
            return {
                success: true,
                user: newUser,
                error: 'Utilisateur créé dans Firestore. Firebase Auth doit être configuré séparément.'
            };

        } catch (error: any) {
            console.error('❌ Erreur lors de la création directe:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Récupérer tous les utilisateurs
     */
    async getAllUsers(): Promise<AdminUser[]> {
        try {
            console.log('🔍 Récupération de tous les utilisateurs...');

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

            console.log(`✅ ${users.length} utilisateurs récupérés`);
            return users;

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
            return [];
        }
    }
}

export const adminUserServiceV2 = new AdminUserServiceV2();
