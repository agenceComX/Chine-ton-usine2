import {
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    getDocs,
    deleteDoc,
    updateDoc,
    where
} from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';
import { User, UserRole } from '../types';

export interface CreateProductionUserData {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    isActive?: boolean;
    additionalData?: {
        phone?: string;
        company?: string;
        address?: string;
    };
}

export interface ProductionUserSummary {
    total: number;
    byRole: Record<UserRole, number>;
    active: number;
    inactive: number;
}

/**
 * Service de gestion des utilisateurs pour l'environnement de production
 * Gère la création, suppression et synchronisation des utilisateurs Firebase
 */
export class ProductionUserService {
    private static instance: ProductionUserService;
    private authStateUnsubscribe: (() => void) | null = null;

    public static getInstance(): ProductionUserService {
        if (!ProductionUserService.instance) {
            ProductionUserService.instance = new ProductionUserService();
        }
        return ProductionUserService.instance;
    }

    /**
     * Initialiser la surveillance de l'état d'authentification
     */
    public initializeAuthStateListener(): () => void {
        console.log('🔄 Initialisation de la surveillance d\'authentification...');

        this.authStateUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                console.log('👤 Utilisateur connecté détecté:', firebaseUser.email);
                await this.ensureUserSyncInFirestore(firebaseUser);
            }
        });

        return this.authStateUnsubscribe;
    }

    /**
     * Arrêter la surveillance de l'état d'authentification
     */
    public stopAuthStateListener(): void {
        if (this.authStateUnsubscribe) {
            this.authStateUnsubscribe();
            this.authStateUnsubscribe = null;
            console.log('🛑 Surveillance d\'authentification arrêtée');
        }
    }

    /**
     * Purger TOUS les utilisateurs existants (Firebase Auth + Firestore)
     * ⚠️ OPÉRATION IRRÉVERSIBLE - UTILISER AVEC PRÉCAUTION
     */
    public async purgeAllUsers(): Promise<{
        success: boolean;
        deletedCount: number;
        errors: string[];
    }> {
        console.log('🗑️ === PURGE COMPLÈTE DES UTILISATEURS ===');
        console.warn('⚠️ ATTENTION: Suppression de TOUS les utilisateurs existants');

        const errors: string[] = [];
        let deletedCount = 0;

        try {
            // 1. Récupérer tous les utilisateurs de Firestore
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);

            console.log(`📊 ${snapshot.size} utilisateurs trouvés dans Firestore`);

            // 2. Supprimer tous les documents Firestore
            const deletePromises = snapshot.docs.map(async (userDoc) => {
                try {
                    await deleteDoc(userDoc.ref);
                    deletedCount++;
                    console.log(`✅ Utilisateur Firestore supprimé: ${userDoc.id}`);
                } catch (error: any) {
                    const errorMsg = `Erreur suppression Firestore ${userDoc.id}: ${error.message}`;
                    errors.push(errorMsg);
                    console.error('❌', errorMsg);
                }
            });

            await Promise.all(deletePromises);

            // Note: Pour supprimer les utilisateurs Firebase Auth, il faudrait utiliser
            // le Firebase Admin SDK dans une Cloud Function ou un serveur backend
            console.log('ℹ️ Note: Les utilisateurs Firebase Auth ne peuvent être supprimés que côté serveur');

            return {
                success: errors.length === 0,
                deletedCount,
                errors
            };

        } catch (error: any) {
            console.error('💥 Erreur lors de la purge:', error);
            errors.push(`Erreur générale: ${error.message}`);

            return {
                success: false,
                deletedCount,
                errors
            };
        }
    }

    /**
     * Créer un utilisateur complet (Firebase Auth + Firestore)
     */
    public async createProductionUser(userData: CreateProductionUserData): Promise<{
        success: boolean;
        user?: User;
        firebaseUid?: string;
        error?: string;
    }> {
        console.log(`👤 Création utilisateur production: ${userData.email} (${userData.role})`);

        try {
            // 1. Validation des données
            const validation = this.validateUserData(userData);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }

            // 2. Vérifier si l'email existe déjà
            const emailExists = await this.checkEmailExists(userData.email);
            if (emailExists) {
                return { success: false, error: `L'email ${userData.email} existe déjà` };
            }

            // 3. Créer l'utilisateur dans Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );

            const firebaseUser = userCredential.user;
            console.log(`✅ Utilisateur Firebase Auth créé: ${firebaseUser.uid}`);

            // 4. Créer le profil complet dans Firestore
            const userProfile: User = {
                uid: firebaseUser.uid,
                id: firebaseUser.uid,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                isActive: userData.isActive ?? true,
                language: 'fr',
                currency: 'EUR',
                favorites: [],
                browsingHistory: [],
                messages: [],
                subscription: userData.role === 'admin' ? 'premium' : 'free',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                ...userData.additionalData
            };

            await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
            console.log(`✅ Profil Firestore créé: ${userData.email}`);

            // 5. Déconnecter l'utilisateur qui vient d'être créé pour éviter la confusion
            if (auth.currentUser?.uid === firebaseUser.uid) {
                await signOut(auth);
                console.log('🔄 Utilisateur créé déconnecté');
            }

            return {
                success: true,
                user: userProfile,
                firebaseUid: firebaseUser.uid
            };

        } catch (error: any) {
            console.error(`❌ Erreur création ${userData.email}:`, error);

            let errorMessage = 'Erreur lors de la création de l\'utilisateur';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Cette adresse email est déjà utilisée';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Format d\'email invalide';
            } else if (error.code === 'permission-denied') {
                errorMessage = 'Permissions insuffisantes. Vérifiez les règles Firestore';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return { success: false, error: errorMessage };
        }
    }

    /**
     * Créer plusieurs utilisateurs de production en batch
     */
    public async createProductionUsersBatch(users: CreateProductionUserData[]): Promise<{
        success: boolean;
        created: User[];
        failed: Array<{ email: string; error: string }>;
        summary: ProductionUserSummary;
    }> {
        console.log(`🚀 === CRÉATION BATCH DE ${users.length} UTILISATEURS ===`);

        const created: User[] = [];
        const failed: Array<{ email: string; error: string }> = [];

        for (const userData of users) {
            try {
                console.log(`⏳ Création: ${userData.email}...`);

                const result = await this.createProductionUser(userData);

                if (result.success && result.user) {
                    created.push(result.user);
                    console.log(`✅ ${userData.email} créé avec succès`);
                } else {
                    failed.push({
                        email: userData.email,
                        error: result.error || 'Erreur inconnue'
                    });
                    console.log(`❌ ${userData.email}: ${result.error}`);
                }

                // Pause entre les créations pour éviter la surcharge
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error: any) {
                failed.push({
                    email: userData.email,
                    error: error.message || 'Erreur inconnue'
                });
                console.error(`💥 Erreur critique ${userData.email}:`, error);
            }
        }

        // Générer le résumé
        const summary = await this.getUsersSummary();

        console.log(`\n📊 === RÉSUMÉ CRÉATION BATCH ===`);
        console.log(`✅ Créés: ${created.length}`);
        console.log(`❌ Échecs: ${failed.length}`);
        console.log(`📈 Total système: ${summary.total} utilisateurs`);

        return {
            success: failed.length === 0,
            created,
            failed,
            summary
        };
    }

    /**
     * Créer les utilisateurs essentiels pour la production
     */
    public async createEssentialProductionUsers(): Promise<{
        success: boolean;
        created: User[];
        failed: Array<{ email: string; error: string }>;
        credentials: Array<{ email: string; password: string; role: string; name: string }>;
    }> {
        console.log('🏭 === CRÉATION DES UTILISATEURS ESSENTIELS POUR LA PRODUCTION ===');

        const essentialUsers: CreateProductionUserData[] = [
            {
                email: 'admin@chinetonusine.com',
                password: 'ProductionAdmin2024!',
                name: 'Administrateur Principal',
                role: 'admin',
                isActive: true,
                additionalData: {
                    company: 'Chine Ton Usine',
                    phone: '+33 1 00 00 00 00'
                }
            },
            {
                email: 'admin.backup@chinetonusine.com',
                password: 'BackupAdmin2024!',
                name: 'Administrateur Backup',
                role: 'admin',
                isActive: true,
                additionalData: {
                    company: 'Chine Ton Usine',
                    phone: '+33 1 00 00 00 01'
                }
            },
            {
                email: 'support@chinetonusine.com',
                password: 'SupportTeam2024!',
                name: 'Équipe Support',
                role: 'admin',
                isActive: true,
                additionalData: {
                    company: 'Chine Ton Usine Support',
                    phone: '+33 1 00 00 00 02'
                }
            }
        ];

        const result = await this.createProductionUsersBatch(essentialUsers);

        // Créer la liste des identifiants pour affichage
        const credentials = essentialUsers.map(user => ({
            email: user.email,
            password: user.password,
            role: user.role,
            name: user.name
        }));

        return {
            ...result,
            credentials
        };
    }

    /**
     * S'assurer qu'un utilisateur Firebase Auth est synchronisé dans Firestore
     */
    private async ensureUserSyncInFirestore(firebaseUser: FirebaseUser): Promise<void> {
        try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                console.log(`🔄 Synchronisation utilisateur: ${firebaseUser.email}`);

                const userProfile: User = {
                    uid: firebaseUser.uid,
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: firebaseUser.displayName || firebaseUser.email || 'Utilisateur',
                    role: 'customer', // Rôle par défaut pour les nouveaux utilisateurs
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
                    updated_at: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                };

                await setDoc(userDocRef, userProfile);
                console.log(`✅ Utilisateur synchronisé dans Firestore: ${firebaseUser.email}`);
            } else {
                // Mettre à jour la dernière connexion
                await updateDoc(userDocRef, {
                    lastLogin: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
                console.log(`🔄 Dernière connexion mise à jour: ${firebaseUser.email}`);
            }
        } catch (error: any) {
            console.error(`❌ Erreur synchronisation ${firebaseUser.email}:`, error);
        }
    }

    /**
     * Obtenir un résumé des utilisateurs du système
     */
    public async getUsersSummary(): Promise<ProductionUserSummary> {
        try {
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);

            const summary: ProductionUserSummary = {
                total: snapshot.size,
                byRole: {
                    admin: 0,
                    supplier: 0,
                    customer: 0,
                    sourcer: 0,
                    influencer: 0
                },
                active: 0,
                inactive: 0
            };

            snapshot.docs.forEach(doc => {
                const userData = doc.data() as User;
                summary.byRole[userData.role]++;

                if (userData.isActive) {
                    summary.active++;
                } else {
                    summary.inactive++;
                }
            });

            return summary;
        } catch (error: any) {
            console.error('❌ Erreur obtention résumé:', error);
            return {
                total: 0,
                byRole: { admin: 0, supplier: 0, customer: 0, sourcer: 0, influencer: 0 },
                active: 0,
                inactive: 0
            };
        }
    }

    /**
     * Valider les données d'un utilisateur
     */
    private validateUserData(userData: CreateProductionUserData): { valid: boolean; error?: string } {
        if (!userData.email || !userData.email.includes('@')) {
            return { valid: false, error: 'Email invalide' };
        }

        if (!userData.password || userData.password.length < 8) {
            return { valid: false, error: 'Le mot de passe doit contenir au moins 8 caractères' };
        }

        if (!userData.name || userData.name.trim().length < 2) {
            return { valid: false, error: 'Le nom doit contenir au moins 2 caractères' };
        }

        if (!['admin', 'supplier', 'customer', 'influencer'].includes(userData.role)) {
            return { valid: false, error: 'Rôle invalide' };
        }

        return { valid: true };
    }

    /**
     * Vérifier si un email existe déjà dans Firestore
     */
    private async checkEmailExists(email: string): Promise<boolean> {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email));
            const snapshot = await getDocs(q);
            return !snapshot.empty;
        } catch (error: any) {
            console.error('❌ Erreur vérification email:', error);
            return false;
        }
    }
}

// Instance singleton pour utilisation globale
export const productionUserService = ProductionUserService.getInstance();

// Exposer le service dans la console pour les tests/debug
if (typeof window !== 'undefined') {
    (window as any).productionUserService = productionUserService;
}
