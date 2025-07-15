/**
 * 🎯 SERVICE FINAL - Création d'utilisateur simple et efficace
 * 
 * Ce service sauvegarde simplement l'utilisateur dans Firestore
 * avec toutes les informations nécessaires pour votre application
 */

import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';
import { UserRole } from '../types';

export interface CreateUserData {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    isActive?: boolean;
}

export interface SavedUser {
    uid: string;
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    language: string;
    currency: string;
    favorites: any[];
    browsingHistory: any[];
    messages: any[];
    subscription: string;
    createdAt: string;
    updatedAt: string;
    created_at: string;
    updated_at: string;
}

/**
 * Service de création d'utilisateur pour sauvegarde en base
 */
class FinalUserCreationService {
    private collectionName = 'users';

    /**
     * Vérifier si un email existe déjà
     */
    private async checkEmailExists(email: string): Promise<boolean> {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('email', '==', email)
            );
            const snapshot = await getDocs(q);
            return !snapshot.empty;
        } catch (error) {
            console.error('Erreur vérification email:', error);
            return false;
        }
    }

    /**
     * Créer et sauvegarder un utilisateur dans la base de données
     */
    async createAndSaveUser(userData: CreateUserData): Promise<{
        success: boolean;
        user?: SavedUser;
        error?: string;
    }> {
        try {
            console.log('💾 Sauvegarde utilisateur en base:', userData.email);

            // Validations
            if (!userData.email || !userData.email.includes('@')) {
                return { success: false, error: 'Email invalide' };
            }

            if (!userData.name || userData.name.trim().length < 2) {
                return { success: false, error: 'Nom invalide' };
            }

            if (!userData.password || userData.password.length < 6) {
                return { success: false, error: 'Mot de passe trop court (min 6 caractères)' };
            }

            // Vérifier si l'email existe
            const emailExists = await this.checkEmailExists(userData.email);
            if (emailExists) {
                return { success: false, error: 'Cet email est déjà utilisé' };
            }

            // Générer un ID unique
            const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const now = new Date().toISOString();

            // Créer le document utilisateur complet
            const userDocument: SavedUser = {
                uid: uid,
                id: uid,
                email: userData.email.trim(),
                name: userData.name.trim(),
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
                updated_at: now
            };

            // Sauvegarder en base de données
            await setDoc(doc(db, this.collectionName, uid), userDocument);

            console.log('✅ Utilisateur sauvegardé avec succès en base de données');
            console.log('📊 Données sauvegardées:', {
                uid: userDocument.uid,
                email: userDocument.email,
                name: userDocument.name,
                role: userDocument.role
            });

            return {
                success: true,
                user: userDocument
            };

        } catch (error: any) {
            console.error('❌ Erreur lors de la sauvegarde:', error);

            let errorMessage = 'Erreur lors de la sauvegarde en base de données';
            if (error.code === 'permission-denied') {
                errorMessage = 'Permissions insuffisantes pour écrire en base';
            } else if (error.code === 'network-request-failed') {
                errorMessage = 'Erreur de connexion réseau';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return { success: false, error: errorMessage };
        }
    }

    /**
     * Récupérer tous les utilisateurs de la base (lecture seule)
     */
    async getAllUsersFromDatabase(): Promise<SavedUser[]> {
        try {
            const snapshot = await getDocs(collection(db, this.collectionName));
            const users: SavedUser[] = [];

            snapshot.forEach((doc) => {
                users.push({
                    uid: doc.id,
                    ...doc.data()
                } as SavedUser);
            });

            return users.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

        } catch (error) {
            console.error('❌ Erreur récupération utilisateurs:', error);
            return [];
        }
    }
}

export const finalUserCreationService = new FinalUserCreationService();
