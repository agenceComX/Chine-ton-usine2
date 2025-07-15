import {
    collection,
    getDocs,
    doc,
    setDoc,
    query,
    orderBy,
    where,
    updateDoc,
    deleteDoc,
    getDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { User, UserRole } from '../types';
import { adminUserCreationServiceFixed } from './adminUserCreationServiceFixed';

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
}

class AdminUserServiceFixed {
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
     * Créer un nouvel utilisateur (temporairement seulement dans Firestore)
     * Note: En production, il faudrait utiliser Firebase Admin SDK ou Cloud Functions
     */
    async createUser(userData: CreateUserData): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
        try {
            console.log('🔥 Création d\'un nouvel utilisateur:', userData.email);

            // Vérification basique de l'email
            if (!userData.email || !userData.email.includes('@')) {
                return {
                    success: false,
                    error: 'Format d\'email invalide'
                };
            }

            // Vérification du mot de passe
            if (!userData.password || userData.password.length < 6) {
                return {
                    success: false,
                    error: 'Le mot de passe doit contenir au moins 6 caractères'
                };
            }

            // Vérifier si l'email existe déjà
            const emailExists = await this.checkIfEmailExists(userData.email);
            if (emailExists) {
                return {
                    success: false,
                    error: 'Cet email est déjà utilisé'
                };
            }

            // Générer un UID unique
            const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Créer le document utilisateur dans Firestore
            const userDoc: Omit<AdminUser, 'uid'> = {
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
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
                // last_login: undefined -> SUPPRIMÉ car Firestore ne supporte pas undefined
            };

            await setDoc(doc(db, this.collectionName, uid), userDoc);
            console.log('📄 Document Firestore créé avec succès');

            const newUser: AdminUser = {
                ...userDoc,
                uid
            };

            console.log('✅ Utilisateur créé avec succès:', newUser.email);
            return {
                success: true,
                user: newUser
            };

        } catch (error: any) {
            console.error('❌ Erreur lors de la création de l\'utilisateur:', error);

            let errorMessage = 'Erreur lors de la création de l\'utilisateur';

            if (error.code === 'permission-denied') {
                errorMessage = 'Permissions insuffisantes pour créer un utilisateur. Vérifiez les règles de sécurité Firestore.';
            } else if (error.code === 'network-request-failed') {
                errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return { success: false, error: errorMessage };
        }
    }

    /**
     * ✅ MÉTHODE SANS DÉCONNEXION ADMIN - Utilise le nouveau service
     * Cette méthode évite de déconnecter l'admin lors de la création d'utilisateur
     */
    async createUserWithoutDisconnect(userData: CreateUserData): Promise<{
        success: boolean;
        user?: AdminUser;
        error?: string;
        warning?: string;
    }> {
        // Déléguer au service spécialisé qui évite la déconnexion
        return adminUserCreationServiceFixed.createUser(userData);
    }

    /**
     * Récupérer tous les utilisateurs (de Firestore + utilisateurs connectés récemment)
     */
    async getAllUsers(): Promise<AdminUser[]> {
        try {
            console.log('🔍 Récupération de tous les utilisateurs...');

            // 1. Récupérer les utilisateurs de Firestore
            const q = query(
                collection(db, this.collectionName),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const firestoreUsers: AdminUser[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                firestoreUsers.push({
                    uid: doc.id,
                    ...data
                } as AdminUser);
            });

            // 2. Ajouter l'utilisateur actuellement connecté s'il n'est pas dans Firestore
            await this.ensureCurrentUserInFirestore();

            // 3. Re-récupérer les utilisateurs après l'ajout potentiel
            const updatedQuerySnapshot = await getDocs(q);
            const updatedUsers: AdminUser[] = [];

            updatedQuerySnapshot.forEach((doc) => {
                const data = doc.data();
                updatedUsers.push({
                    uid: doc.id,
                    ...data
                } as AdminUser);
            });

            console.log(`✅ ${updatedUsers.length} utilisateurs récupérés`);
            return updatedUsers;

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
            return [];
        }
    }

    /**
     * S'assurer que l'utilisateur connecté est dans Firestore
     */
    private async ensureCurrentUserInFirestore(): Promise<void> {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        try {
            // Vérifier si l'utilisateur existe déjà dans Firestore
            const userDocRef = doc(db, this.collectionName, currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                console.log('👤 Ajout de l\'utilisateur connecté:', currentUser.email);

                const currentUserProfile: AdminUser = {
                    uid: currentUser.uid,
                    id: currentUser.uid,
                    email: currentUser.email || '',
                    name: currentUser.displayName || currentUser.email || 'Utilisateur',
                    role: 'customer', // Rôle par défaut
                    isActive: true,
                    language: 'fr',
                    currency: 'EUR',
                    favorites: [],
                    browsingHistory: [],
                    messages: [],
                    subscription: 'free',
                    createdAt: currentUser.metadata.creationTime || new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    created_at: currentUser.metadata.creationTime || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                    // lastLogin: undefined -> SUPPRIMÉ car Firestore ne supporte pas undefined
                };

                await setDoc(userDocRef, currentUserProfile);
                console.log('✅ Utilisateur connecté ajouté à Firestore');
            } else {
                // Mettre à jour la dernière connexion
                await updateDoc(userDocRef, {
                    lastLogin: currentUser.metadata.lastSignInTime || new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('⚠️ Erreur lors de la synchronisation de l\'utilisateur connecté:', error);
        }
    }

    /**
     * Synchroniser un utilisateur Firebase Auth vers Firestore
     */
    async syncFirebaseUserToFirestore(firebaseUser: any): Promise<{ success: boolean; error?: string }> {
        try {
            console.log('🔄 Synchronisation utilisateur:', firebaseUser.email);

            const userProfile: AdminUser = {
                uid: firebaseUser.uid,
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || firebaseUser.email || 'Utilisateur',
                role: 'customer', // Rôle par défaut
                isActive: true,
                language: 'fr',
                currency: 'EUR',
                favorites: [],
                browsingHistory: [],
                messages: [],
                subscription: 'free',
                createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                created_at: firebaseUser.metadata.creationTime || new Date().toISOString(),
                updated_at: new Date().toISOString()
                // lastLogin: undefined -> SUPPRIMÉ car Firestore ne supporte pas undefined
            };

            await setDoc(doc(db, this.collectionName, firebaseUser.uid), userProfile);
            console.log('✅ Utilisateur synchronisé avec Firestore');

            return { success: true };

        } catch (error: any) {
            console.error('❌ Erreur lors de la synchronisation:', error);
            return {
                success: false,
                error: 'Erreur lors de la synchronisation avec Firestore'
            };
        }
    }

    /**
     * Mettre à jour un utilisateur
     */
    async updateUser(userId: string, updateData: Partial<CreateUserData>): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
        try {
            console.log('🔄 Mise à jour de l\'utilisateur:', userId);

            const userRef = doc(db, this.collectionName, userId);
            const updatePayload = {
                ...updateData,
                updatedAt: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            await updateDoc(userRef, updatePayload);

            // Récupérer l'utilisateur mis à jour
            const users = await this.getAllUsers();
            const updatedUser = users.find(user => user.uid === userId);

            console.log('✅ Utilisateur mis à jour avec succès');
            return {
                success: true,
                user: updatedUser
            };

        } catch (error: any) {
            console.error('❌ Erreur lors de la mise à jour:', error);
            return {
                success: false,
                error: 'Erreur lors de la mise à jour de l\'utilisateur'
            };
        }
    }

    /**
     * Supprimer un utilisateur
     */
    async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
        try {
            console.log('🗑️ Suppression de l\'utilisateur:', userId);

            const userRef = doc(db, this.collectionName, userId);
            await deleteDoc(userRef);

            console.log('✅ Utilisateur supprimé avec succès');
            return { success: true };

        } catch (error: any) {
            console.error('❌ Erreur lors de la suppression:', error);
            return {
                success: false,
                error: 'Erreur lors de la suppression de l\'utilisateur'
            };
        }
    }

    /**
     * Créer des utilisateurs de test pour le développement
     */
    async createTestUsers(): Promise<{ success: boolean; count: number; error?: string }> {
        try {
            console.log('🧪 Création d\'utilisateurs de test...');

            const testUsers = [
                {
                    email: 'admin@chinetousine.com',
                    password: 'admin123456',
                    name: 'Admin Principal',
                    role: 'admin' as UserRole,
                    isActive: true
                },
                {
                    email: 'supplier1@example.com',
                    password: 'supplier123456',
                    name: 'Shanghai Electronics Co.',
                    role: 'supplier' as UserRole,
                    isActive: true
                },
                {
                    email: 'client1@example.com',
                    password: 'client123456',
                    name: 'Marie Dubois',
                    role: 'customer' as UserRole,
                    isActive: true
                }
            ];

            let createdCount = 0;
            for (const user of testUsers) {
                try {
                    const result = await this.createUser(user);
                    if (result.success) {
                        createdCount++;
                        console.log(`✅ Utilisateur de test créé: ${user.email}`);
                    } else {
                        console.error(`❌ Erreur lors de la création de ${user.email}:`, result.error);
                    }
                } catch (error) {
                    console.error(`❌ Erreur lors de la création de ${user.email}:`, error);
                }
            }

            console.log(`✅ ${createdCount} utilisateurs de test créés`);
            return { success: true, count: createdCount };

        } catch (error: any) {
            console.error('❌ Erreur lors de la création des utilisateurs de test:', error);
            return {
                success: false,
                count: 0,
                error: 'Erreur lors de la création des utilisateurs de test'
            };
        }
    }

    /**
     * Démarrer la surveillance automatique des connexions d'utilisateurs
     * Cette méthode surveille les changements d'authentification et synchronise automatiquement
     * les nouveaux utilisateurs avec Firestore
     */
    startUserSyncMonitoring(): () => void {
        console.log('🔄 Démarrage de la surveillance des connexions utilisateurs...');

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log('👤 Nouvelle connexion détectée:', user.email);
                await this.ensureCurrentUserInFirestore();
            }
        });

        return unsubscribe;
    }

    /**
     * Synchroniser manuellement tous les utilisateurs Firebase Auth visibles
     * Note: Cette méthode ne peut synchroniser que l'utilisateur actuellement connecté
     * Pour synchroniser TOUS les utilisateurs Firebase Auth, il faut utiliser Firebase Admin SDK côté serveur
     */
    async syncAllVisibleUsers(): Promise<{ success: boolean; count: number; error?: string }> {
        try {
            console.log('🔄 Synchronisation des utilisateurs visibles...');

            // Seul l'utilisateur connecté peut être synchronisé côté client
            await this.ensureCurrentUserInFirestore();

            return {
                success: true,
                count: 1,
            };

        } catch (error: any) {
            console.error('❌ Erreur lors de la synchronisation:', error);
            return {
                success: false,
                count: 0,
                error: 'Erreur lors de la synchronisation des utilisateurs'
            };
        }
    }

    /**
     * Obtenir des statistiques sur les utilisateurs
     */
    async getUserStats(): Promise<{
        total: number;
        byRole: Record<UserRole, number>;
        active: number;
        inactive: number;
    }> {
        try {
            const users = await this.getAllUsers();

            const stats = {
                total: users.length,
                byRole: {
                    admin: 0,
                    supplier: 0,
                    customer: 0,
                    sourcer: 0
                } as Record<UserRole, number>,
                active: 0,
                inactive: 0
            };

            users.forEach(user => {
                stats.byRole[user.role]++;
                if (user.isActive) {
                    stats.active++;
                } else {
                    stats.inactive++;
                }
            });

            return stats;

        } catch (error) {
            console.error('❌ Erreur lors du calcul des statistiques:', error);
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
    }
}

export const adminUserServiceFixed = new AdminUserServiceFixed();
