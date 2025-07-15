import {
    collection,
    getDocs,
    doc,
    setDoc,
    query,
    orderBy,
    where
} from 'firebase/firestore';
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
    deletedAt?: string; // Pour le soft delete
}

class AdminUserService {
    private collectionName = 'users';

    /**
     * Vérifier si un email existe déjà
     */
    private async checkIfEmailExists(email: string): Promise<boolean> {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('email', '==', email)
            );
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'email:', error);
            return false;
        }
    }

    /**
     * Créer un nouvel utilisateur (Firebase Auth + Firestore)
     */
    async createUser(userData: CreateUserData): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
        const currentUser = auth.currentUser;

        try {
            console.log('🔥 Création d\'un nouvel utilisateur:', userData.email);

            // Vérifier si un admin est connecté
            if (!currentUser) {
                console.error('❌ Aucun utilisateur admin connecté');
                return {
                    success: false,
                    error: 'Vous devez être connecté en tant qu\'administrateur pour créer un utilisateur'
                };
            }

            console.log('👤 Admin connecté:', currentUser.email);

            // SOLUTION TEMPORAIRE: Créer seulement dans Firestore
            // En production, utilisez l'Admin SDK ou Cloud Functions

            // Générer un UID temporaire
            const tempUID = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Créer le document utilisateur dans Firestore seulement
            const userDoc: Omit<AdminUser, 'uid'> = {
                id: tempUID,
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
                updated_at: new Date().toISOString()
                // last_login: undefined -> SUPPRIMÉ car Firestore ne supporte pas undefined
            };

            await setDoc(doc(db, this.collectionName, tempUID), userDoc);
            console.log('� Document Firestore créé (utilisateur temporaire)');

            const newUser: AdminUser = {
                ...userDoc,
                uid: tempUID
            };

            console.log('✅ Utilisateur temporaire créé avec succès:', newUser.email);
            return {
                success: true,
                user: newUser
            };

        } catch (error: any) {
            console.error('❌ Erreur lors de la création de l\'utilisateur:', error);

            let errorMessage = 'Erreur lors de la création de l\'utilisateur';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Cet email est déjà utilisé';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Format d\'email invalide';
            }

            return { success: false, error: errorMessage };
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

    /**
     * Créer des utilisateurs de test (pour le développement)
     */
    async createTestUsers(): Promise<{ success: boolean; count: number; error?: string }> {
        try {
            console.log('🧪 Création d\'utilisateurs de test...');

            const testUsers = [
                {
                    id: 'test-admin-1',
                    email: 'admin@chinetousine.com',
                    name: 'Admin Principal',
                    role: 'admin' as UserRole,
                    isActive: true,
                    language: 'fr',
                    currency: 'EUR',
                    favorites: [],
                    browsingHistory: [],
                    messages: [],
                    subscription: 'free',
                    createdAt: new Date('2023-01-15').toISOString(),
                    updatedAt: new Date().toISOString(),
                    created_at: new Date('2023-01-15').toISOString(),
                    updated_at: new Date().toISOString(),
                    last_login: new Date('2024-01-15').toISOString()
                },
                {
                    id: 'test-supplier-1',
                    email: 'supplier1@example.com',
                    name: 'Shanghai Electronics Co.',
                    role: 'supplier' as UserRole,
                    isActive: true,
                    language: 'fr',
                    currency: 'EUR',
                    favorites: [],
                    browsingHistory: [],
                    messages: [],
                    subscription: 'free',
                    createdAt: new Date('2023-03-20').toISOString(),
                    updatedAt: new Date().toISOString(),
                    created_at: new Date('2023-03-20').toISOString(),
                    updated_at: new Date().toISOString(),
                    last_login: new Date('2024-01-10').toISOString()
                },
                {
                    id: 'test-customer-1',
                    email: 'client1@example.com',
                    name: 'Marie Dubois',
                    role: 'customer' as UserRole,
                    isActive: true,
                    language: 'fr',
                    currency: 'EUR',
                    favorites: [],
                    browsingHistory: [],
                    messages: [],
                    subscription: 'free',
                    createdAt: new Date('2023-06-10').toISOString(),
                    updatedAt: new Date().toISOString(),
                    created_at: new Date('2023-06-10').toISOString(),
                    updated_at: new Date().toISOString(),
                    last_login: new Date('2024-01-12').toISOString()
                }
            ];

            let createdCount = 0;
            for (const user of testUsers) {
                try {
                    await setDoc(doc(db, this.collectionName, user.id), user);
                    createdCount++;
                    console.log(`✅ Utilisateur de test créé: ${user.email}`);
                } catch (error) {
                    console.error(`❌ Erreur lors de la création de ${user.email}:`, error);
                }
            }

            console.log(`✅ ${createdCount} utilisateurs de test créés`);
            return { success: true, count: createdCount };

        } catch (error) {
            console.error('❌ Erreur lors de la création des utilisateurs de test:', error);
            return { success: false, count: 0, error: 'Erreur lors de la création des utilisateurs de test' };
        }
    }
}

export const adminUserService = new AdminUserService();