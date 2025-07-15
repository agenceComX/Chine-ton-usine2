/**
 * ✅ SOLUTION - Service de Création d'Utilisateur SANS déconnexion admin
 * 
 * Ce service permet de créer des utilisateurs depuis l'interface admin
 * sans déconnecter l'administrateur de sa session.
 */

import { doc, setDoc } from 'firebase/firestore';
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
}

/**
 * Service de création d'utilisateur pour admin qui PRÉSERVE LA SESSION ADMIN
 */
class AdminUserCreationServiceFixed {
    private collectionName = 'users';

    /**
     * Vérifier si un email existe déjà
     */
    private async checkIfEmailExists(email: string): Promise<boolean> {
        try {
            // Cette méthode vérifie seulement dans Firestore
            // En production, utilisez Firebase Admin SDK pour vérifier Auth aussi
            const snapshot = await import('firebase/firestore').then(({ collection, getDocs, query, where }) => {
                return getDocs(query(collection(db, this.collectionName), where('email', '==', email)));
            });
            return !snapshot.empty;
        } catch (error) {
            console.error('Erreur vérification email:', error);
            return false;
        }
    }

    /**
     * Créer un nouvel utilisateur SANS déconnecter l'admin
     * 
     * 🎯 SOLUTION : Cette méthode crée seulement le document Firestore
     * et n'utilise PAS createUserWithEmailAndPassword pour éviter la déconnexion
     */
    async createUser(userData: CreateUserData): Promise<{
        success: boolean;
        user?: AdminUser;
        error?: string;
        warning?: string;
    }> {
        try {
            console.log('🔥 Création d\'un nouvel utilisateur (sans déconnexion admin):', userData.email);

            // 1. Vérifier l'admin actuel
            const currentAdmin = auth.currentUser;
            if (!currentAdmin) {
                return {
                    success: false,
                    error: 'Vous devez être connecté en tant qu\'administrateur'
                };
            }

            console.log('👤 Admin connecté:', currentAdmin.email);

            // 2. Vérifications basiques
            if (!userData.email || !userData.email.includes('@')) {
                return {
                    success: false,
                    error: 'Format d\'email invalide'
                };
            }

            if (!userData.password || userData.password.length < 6) {
                return {
                    success: false,
                    error: 'Le mot de passe doit contenir au moins 6 caractères'
                };
            }

            // 3. Vérifier si l'email existe déjà
            const emailExists = await this.checkIfEmailExists(userData.email);
            if (emailExists) {
                return {
                    success: false,
                    error: 'Cet email est déjà utilisé'
                };
            }

            // 4. Générer un UID unique pour le nouvel utilisateur
            const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // 5. Créer le document utilisateur dans Firestore SEULEMENT
            const userDoc: any = {
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
                updated_at: new Date().toISOString(),
                // Note: En production, utiliser Firebase Admin SDK pour créer dans Auth
                userType: 'temp-firestore-only'
            };

            // 6. Sauvegarder dans Firestore
            await setDoc(doc(db, this.collectionName, uid), userDoc);
            console.log('📄 Document Firestore créé avec succès');

            // 7. Créer l'objet utilisateur à retourner
            const newUser: AdminUser = {
                ...userDoc,
                uid
            };

            console.log('✅ Utilisateur créé avec succès (session admin préservée):', newUser.email);
            console.log('👤 Admin toujours connecté:', currentAdmin.email);

            return {
                success: true,
                user: newUser,
                warning: 'Utilisateur créé dans Firestore uniquement. En production, utilisez Firebase Admin SDK pour créer aussi dans Firebase Auth.'
            };

        } catch (error: any) {
            console.error('❌ Erreur lors de la création de l\'utilisateur:', error);

            let errorMessage = 'Erreur lors de la création de l\'utilisateur';
            if (error.code === 'permission-denied') {
                errorMessage = 'Permissions insuffisantes. Vérifiez les règles Firestore.';
            } else if (error.code === 'network-request-failed') {
                errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return { success: false, error: errorMessage };
        }
    }

    /**
     * Récupérer tous les utilisateurs
     */
    async getAllUsers(): Promise<AdminUser[]> {
        try {
            const { collection, getDocs, orderBy, query } = await import('firebase/firestore');

            const usersQuery = query(
                collection(db, this.collectionName),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(usersQuery);

            return snapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            } as AdminUser));

        } catch (error) {
            console.error('❌ Erreur récupération utilisateurs:', error);
            return [];
        }
    }
}

export const adminUserCreationServiceFixed = new AdminUserCreationServiceFixed();

// Note importante pour la production
console.log(`
🚨 IMPORTANT - Service de création d'utilisateur temporaire

Ce service crée des utilisateurs SEULEMENT dans Firestore pour éviter
la déconnexion de l'admin. En production, il faut :

1. ✅ Utiliser Firebase Admin SDK (côté serveur)
2. ✅ Ou créer une Cloud Function
3. ✅ Ou un endpoint API backend

Avantages de cette solution temporaire :
✅ L'admin reste connecté
✅ Aucune redirection non désirée
✅ Interface admin fonctionnelle

Limitations :
⚠️ Pas de compte Firebase Auth réel
⚠️ Stockage Firestore uniquement
⚠️ Sécurité réduite
`);
