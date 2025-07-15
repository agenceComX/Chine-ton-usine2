import { auth, db } from '../lib/firebaseClient';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

/**
 * Service spécialisé pour gérer la redirection admin
 */
export class AdminFixService {
    private static readonly ADMIN_EMAIL = 'admin@chinetonusine.com';

    /**
     * Créer ou mettre à jour l'utilisateur admin avec le bon rôle
     */
    static async ensureAdminUser(password?: string): Promise<{ success: boolean; message: string }> {
        try {
            console.log('🔧 Correction de l\'utilisateur admin...');

            // Si un mot de passe est fourni, tenter la connexion
            if (password) {
                try {
                    await signInWithEmailAndPassword(auth, this.ADMIN_EMAIL, password);
                    console.log('✅ Connexion admin réussie');
                } catch (error: any) {
                    return {
                        success: false,
                        message: `Erreur de connexion: ${error.message}`
                    };
                }
            }

            const currentUser = auth.currentUser;
            if (!currentUser || currentUser.email !== this.ADMIN_EMAIL) {
                return {
                    success: false,
                    message: 'Vous devez être connecté avec admin@chinetonusine.com'
                };
            }

            // Vérifier si l'utilisateur existe déjà dans Firestore
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            const adminUserData = {
                uid: currentUser.uid,
                id: currentUser.uid,
                email: this.ADMIN_EMAIL,
                name: 'Admin Principal',
                role: 'admin',
                isActive: true,
                language: 'fr',
                currency: 'EUR',
                favorites: [],
                browsingHistory: [],
                messages: [],
                subscription: 'premium',
                createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                created_at: userDoc.exists() ? userDoc.data().created_at : new Date().toISOString(),
                updated_at: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            if (userDoc.exists()) {
                // Mettre à jour l'utilisateur existant
                await updateDoc(userDocRef, {
                    role: 'admin',
                    isActive: true,
                    name: 'Admin Principal',
                    subscription: 'premium',
                    updatedAt: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                });
                console.log('✅ Utilisateur admin mis à jour');
            } else {
                // Créer l'utilisateur admin
                await setDoc(userDocRef, adminUserData);
                console.log('✅ Utilisateur admin créé');
            }

            return {
                success: true,
                message: 'Utilisateur admin configuré avec succès. Reconnectez-vous pour tester la redirection.'
            };

        } catch (error: any) {
            console.error('❌ Erreur lors de la correction admin:', error);
            return {
                success: false,
                message: `Erreur: ${error.message}`
            };
        }
    }

    /**
     * Vérifier le statut de l'utilisateur admin
     */
    static async checkAdminStatus(): Promise<{ exists: boolean; hasAdminRole: boolean; isActive: boolean; details?: any }> {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                return { exists: false, hasAdminRole: false, isActive: false };
            }

            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                return { exists: false, hasAdminRole: false, isActive: false };
            }

            const userData = userDoc.data();
            return {
                exists: true,
                hasAdminRole: userData.role === 'admin',
                isActive: userData.isActive === true,
                details: userData
            };

        } catch (error) {
            console.error('Erreur lors de la vérification du statut admin:', error);
            return { exists: false, hasAdminRole: false, isActive: false };
        }
    }

    /**
     * Correction rapide depuis la console
     */
    static async quickFix(password: string) {
        console.log('🚀 Démarrage de la correction rapide admin...');
        const result = await this.ensureAdminUser(password);
        console.log(result.success ? '✅' : '❌', result.message);
        return result;
    }
}

// Exposer pour utilisation dans la console
(window as any).AdminFix = AdminFixService;
