import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';

export interface CreateAdminUserData {
    email: string;
    password: string;
    name: string;
}

/**
 * Service pour créer un nouveau compte administrateur
 */
export class AdminCreationService {

    /**
     * Créer un nouveau compte admin complet
     */
    static async createNewAdminAccount(userData: CreateAdminUserData): Promise<{
        success: boolean;
        message: string;
        uid?: string;
    }> {
        try {
            console.log('🔥 Création d\'un nouveau compte admin:', userData.email);

            // 1. Validation des données
            const validation = this.validateAdminData(userData);
            if (!validation.valid) {
                return {
                    success: false,
                    message: validation.message
                };
            }

            // 2. Créer l'utilisateur dans Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );

            const firebaseUser = userCredential.user;
            console.log('✅ Utilisateur Firebase Auth créé:', firebaseUser.uid);

            // 3. Créer le profil admin dans Firestore
            const adminUserProfile = {
                uid: firebaseUser.uid,
                id: firebaseUser.uid,
                email: userData.email,
                name: userData.name,
                role: 'admin',
                isActive: true,
                language: 'fr',
                currency: 'EUR',
                favorites: [],
                browsingHistory: [],
                messages: [],
                subscription: 'premium',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            await setDoc(doc(db, 'users', firebaseUser.uid), adminUserProfile);
            console.log('✅ Profil admin créé dans Firestore');

            return {
                success: true,
                message: `Compte admin créé avec succès pour ${userData.email}`,
                uid: firebaseUser.uid
            };

        } catch (error: any) {
            console.error('❌ Erreur lors de la création du compte admin:', error);

            let errorMessage = 'Erreur lors de la création du compte admin';

            // Messages d'erreur spécifiques
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Cet email est déjà utilisé';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Format d\'email invalide';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    }

    /**
     * Valider les données de création d'admin
     */
    private static validateAdminData(userData: CreateAdminUserData): {
        valid: boolean;
        message: string;
    } {
        if (!userData.email || !userData.email.includes('@')) {
            return {
                valid: false,
                message: 'Email invalide'
            };
        }

        if (!userData.password || userData.password.length < 6) {
            return {
                valid: false,
                message: 'Le mot de passe doit contenir au moins 6 caractères'
            };
        }

        if (!userData.name || userData.name.trim().length < 2) {
            return {
                valid: false,
                message: 'Le nom doit contenir au moins 2 caractères'
            };
        }

        return {
            valid: true,
            message: 'Validation réussie'
        };
    }

    /**
     * Créer un compte admin par défaut
     */
    static async createDefaultAdminAccount(): Promise<{
        success: boolean;
        message: string;
        credentials?: { email: string; password: string };
        uid?: string;
    }> {
        const defaultAdmin: CreateAdminUserData = {
            email: 'admin@chinetonusine.com',
            password: 'admin123456',
            name: 'Administrateur Principal'
        };

        try {
            const result = await this.createNewAdminAccount(defaultAdmin);

            if (result.success) {
                return {
                    success: true,
                    message: result.message,
                    credentials: {
                        email: defaultAdmin.email,
                        password: defaultAdmin.password
                    },
                    uid: result.uid
                };
            } else {
                return {
                    success: false,
                    message: result.message
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: `Erreur lors de la création du compte par défaut: ${error.message}`
            };
        }
    }

    /**
     * Créer plusieurs comptes admin de test
     */
    static async createTestAdminAccounts(): Promise<{
        success: boolean;
        message: string;
        createdAccounts?: Array<{ email: string; password: string; uid: string }>;
    }> {
        const testAdmins: CreateAdminUserData[] = [
            {
                email: 'admin@chinetonusine.com',
                password: 'admin123456',
                name: 'Administrateur Principal'
            },
            {
                email: 'admin2@chinetonusine.com',
                password: 'admin654321',
                name: 'Administrateur Secondaire'
            },
            {
                email: 'superadmin@chinetonusine.com',
                password: 'superadmin123',
                name: 'Super Administrateur'
            }
        ];

        const createdAccounts: Array<{ email: string; password: string; uid: string }> = [];
        const errors: string[] = [];

        for (const adminData of testAdmins) {
            try {
                const result = await this.createNewAdminAccount(adminData);

                if (result.success && result.uid) {
                    createdAccounts.push({
                        email: adminData.email,
                        password: adminData.password,
                        uid: result.uid
                    });
                    console.log(`✅ Compte créé: ${adminData.email}`);
                } else {
                    errors.push(`${adminData.email}: ${result.message}`);
                    console.log(`❌ Échec: ${adminData.email} - ${result.message}`);
                }
            } catch (error: any) {
                errors.push(`${adminData.email}: ${error.message}`);
                console.log(`💥 Erreur: ${adminData.email} - ${error.message}`);
            }
        }

        if (createdAccounts.length > 0) {
            return {
                success: true,
                message: `${createdAccounts.length} compte(s) admin créé(s) avec succès${errors.length > 0 ? ` (${errors.length} erreur(s))` : ''}`,
                createdAccounts
            };
        } else {
            return {
                success: false,
                message: `Aucun compte créé. Erreurs: ${errors.join(', ')}`
            };
        }
    }
}

// Exposer pour utilisation dans la console
(window as any).AdminCreation = AdminCreationService;
