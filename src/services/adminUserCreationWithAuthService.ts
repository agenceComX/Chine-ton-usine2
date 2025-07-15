/**
 * 🎯 SOLUTION AVANCÉE - Création d'utilisateur AVEC Firebase Auth SANS déconnexion admin
 * 
 * Cette solution utilise une instance Firebase séparée pour créer l'utilisateur
 * tout en préservant la session de l'admin sur l'instance principale.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth as mainAuth, db } from '../lib/firebaseClient';
import { User, UserRole } from '../types';

// Configuration Firebase (même que l'app principale)
const firebaseConfig = {
    apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
    authDomain: "chine-ton-usine-2c999.firebaseapp.com",
    projectId: "chine-ton-usine-2c999",
    storageBucket: "chine-ton-usine-2c999.firebasestorage.app",
    messagingSenderId: "528021984213",
    appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
    measurementId: "G-23BQZPXP86"
};

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
 * Service de création d'utilisateur avec Firebase Auth COMPLET
 * qui PRÉSERVE la session admin
 */
class AdminUserCreationWithAuthService {
    private collectionName = 'users';
    private secondaryApp: any = null;
    private secondaryAuth: any = null;
    private secondaryDb: any = null;

    /**
     * Initialise une instance Firebase secondaire pour la création d'utilisateurs
     */
    private initializeSecondaryApp() {
        if (!this.secondaryApp) {
            // Créer une instance séparée avec un nom unique
            this.secondaryApp = initializeApp(firebaseConfig, `userCreationApp_${Date.now()}`);
            this.secondaryAuth = getAuth(this.secondaryApp);
            this.secondaryDb = getFirestore(this.secondaryApp);

            console.log('🔄 Instance Firebase secondaire initialisée pour création d\'utilisateur');
        }
    }

    /**
     * Vérifier si un email existe déjà
     */
    private async checkIfEmailExists(email: string): Promise<boolean> {
        try {
            const { collection, getDocs, query, where } = await import('firebase/firestore');
            const snapshot = await getDocs(query(collection(db, this.collectionName), where('email', '==', email)));
            return !snapshot.empty;
        } catch (error) {
            console.error('Erreur vérification email:', error);
            return false;
        }
    }

    /**
     * Créer un utilisateur complet (Firebase Auth + Firestore) SANS déconnecter l'admin
     * 
     * 🎯 TECHNIQUE AVANCÉE : Utilise une instance Firebase séparée
     */
    async createUserWithFirebaseAuth(userData: CreateUserData): Promise<{
        success: boolean;
        user?: AdminUser;
        error?: string;
        sessionPreserved?: boolean;
    }> {
        let tempUser: any = null;

        try {
            console.log('🔥 Création utilisateur complet (Auth + Firestore) sans déconnexion admin:', userData.email);

            // 1. Vérifier l'admin actuel sur l'instance principale
            const currentAdmin = mainAuth.currentUser;
            if (!currentAdmin) {
                return {
                    success: false,
                    error: 'Vous devez être connecté en tant qu\'administrateur'
                };
            }

            console.log('👤 Admin connecté (instance principale):', currentAdmin.email);

            // 2. Initialiser l'instance secondaire
            this.initializeSecondaryApp();

            // 3. Vérifications basiques
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

            // 4. Vérifier si l'email existe déjà
            const emailExists = await this.checkIfEmailExists(userData.email);
            if (emailExists) {
                return {
                    success: false,
                    error: 'Cet email est déjà utilisé'
                };
            }

            // 5. Créer l'utilisateur sur l'instance SECONDAIRE
            console.log('🔐 Création Firebase Auth sur instance secondaire...');
            const userCredential = await createUserWithEmailAndPassword(
                this.secondaryAuth,
                userData.email,
                userData.password
            );

            tempUser = userCredential.user;
            console.log('✅ Utilisateur Auth créé sur instance secondaire:', tempUser.uid);

            // 6. Mettre à jour le profil
            await updateProfile(tempUser, {
                displayName: userData.name
            });

            // 7. Créer le document Firestore (sur l'instance principale)
            const userDoc = {
                uid: tempUser.uid,
                id: tempUser.uid,
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
                emailVerified: tempUser.emailVerified,
                authType: 'firebase-complete'
            };

            await setDoc(doc(db, this.collectionName, tempUser.uid), userDoc);
            console.log('📄 Document Firestore créé sur instance principale');

            // 8. Se déconnecter de l'instance secondaire
            await signOut(this.secondaryAuth);
            console.log('🔓 Déconnexion de l\'instance secondaire');

            // 9. Vérifier que l'admin est toujours connecté sur l'instance principale
            const adminStillConnected = mainAuth.currentUser;
            console.log('✅ Admin toujours connecté:', adminStillConnected?.email);

            const newUser: AdminUser = userDoc as AdminUser;

            return {
                success: true,
                user: newUser,
                sessionPreserved: adminStillConnected?.uid === currentAdmin.uid
            };

        } catch (error: any) {
            console.error('❌ Erreur lors de la création de l\'utilisateur:', error);

            // Nettoyage en cas d'erreur
            try {
                if (tempUser && this.secondaryAuth) {
                    await signOut(this.secondaryAuth);
                    console.log('🧹 Nettoyage: déconnexion instance secondaire');
                }
            } catch (cleanupError) {
                console.warn('⚠️ Erreur lors du nettoyage:', cleanupError);
            }

            let errorMessage = 'Erreur lors de la création de l\'utilisateur';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Cet email est déjà utilisé dans Firebase Auth';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Format d\'email invalide';
            } else if (error.code === 'permission-denied') {
                errorMessage = 'Permissions insuffisantes. Vérifiez les règles Firestore.';
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

    /**
     * Nettoyer les instances secondaires
     */
    cleanup() {
        if (this.secondaryApp) {
            try {
                this.secondaryApp.delete();
                this.secondaryApp = null;
                this.secondaryAuth = null;
                this.secondaryDb = null;
                console.log('🧹 Instance Firebase secondaire nettoyée');
            } catch (error) {
                console.warn('⚠️ Erreur lors du nettoyage de l\'instance secondaire:', error);
            }
        }
    }
}

export const adminUserCreationWithAuthService = new AdminUserCreationWithAuthService();

// Auto-nettoyage lors du déchargement de la page
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        adminUserCreationWithAuthService.cleanup();
    });
}

console.log(`
🎯 SOLUTION AVANCÉE CHARGÉE - Création utilisateur avec Firebase Auth complet

Cette solution :
✅ Crée de VRAIS comptes Firebase Auth
✅ Préserve la session admin
✅ Utilise une instance Firebase séparée
✅ Aucune redirection non désirée
✅ Nettoyage automatique

Usage :
const result = await adminUserCreationWithAuthService.createUserWithFirebaseAuth(userData);
`);
