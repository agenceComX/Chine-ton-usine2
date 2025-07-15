import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser,
    AuthError
} from 'firebase/auth';
import {
    doc,
    getDoc,
    updateDoc
} from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';
import { User, UserRole } from '../types';

/**
 * Interface pour les résultats de connexion
 */
export interface LoginResult {
    success: boolean;
    user?: User;
    error?: string;
    redirectTo?: string;
}

/**
 * Interface pour la gestion des sessions
 */
export interface SessionInfo {
    user: User;
    loginTime: string;
    lastActivity: string;
    expiresAt: string;
}

/**
 * Service d'authentification sécurisé pour la production
 * Gère les connexions, redirections et sécurité des sessions
 */
export class SecureAuthService {
    private static instance: SecureAuthService;
    private currentUser: User | null = null;
    private authStateUnsubscribe: (() => void) | null = null;
    private sessionTimeout: NodeJS.Timeout | null = null;
    private readonly SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 heures
    private readonly ACTIVITY_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

    public static getInstance(): SecureAuthService {
        if (!SecureAuthService.instance) {
            SecureAuthService.instance = new SecureAuthService();
        }
        return SecureAuthService.instance;
    }

    /**
     * Initialiser le service d'authentification
     */
    public initialize(): Promise<User | null> {
        return new Promise((resolve) => {
            console.log('🔐 Initialisation du service d\'authentification sécurisé...');

            this.authStateUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    console.log('👤 Utilisateur Firebase détecté:', firebaseUser.email);
                    const user = await this.loadUserProfile(firebaseUser);

                    if (user) {
                        this.currentUser = user;
                        this.startSessionMonitoring();
                        await this.updateLastActivity();
                        console.log(`✅ Session initialisée pour ${user.name} (${user.role})`);
                    }

                    resolve(user);
                } else {
                    console.log('👋 Aucun utilisateur connecté');
                    this.currentUser = null;
                    this.stopSessionMonitoring();
                    resolve(null);
                }
            });
        });
    }

    /**
     * Connexion sécurisée avec validation des rôles
     */
    public async secureLogin(email: string, password: string): Promise<LoginResult> {
        console.log(`🔐 Tentative de connexion: ${email}`);

        try {
            // 1. Validation des entrées
            const validation = this.validateLoginInput(email, password);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }

            // 2. Authentification Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            console.log(`✅ Authentification Firebase réussie: ${firebaseUser.uid}`);

            // 3. Charger le profil utilisateur depuis Firestore
            const user = await this.loadUserProfile(firebaseUser);
            if (!user) {
                await signOut(auth); // Déconnecter l'utilisateur sans profil
                return {
                    success: false,
                    error: 'Profil utilisateur non trouvé. Contactez l\'administrateur.'
                };
            }

            // 4. Vérifier si l'utilisateur est actif
            if (user.isActive === false) {
                await signOut(auth);
                return {
                    success: false,
                    error: 'Compte désactivé. Contactez l\'administrateur.'
                };
            }

            // 5. Mettre à jour la dernière connexion
            await this.updateLastLogin(user.id);

            // 6. Déterminer la redirection selon le rôle
            const redirectTo = this.determineRedirection(user.role);

            this.currentUser = user;
            this.startSessionMonitoring();

            console.log(`🎉 Connexion réussie: ${user.name} → ${redirectTo}`);

            return {
                success: true,
                user,
                redirectTo
            };

        } catch (error: any) {
            console.error('❌ Erreur de connexion:', error);
            return {
                success: false,
                error: this.formatAuthError(error)
            };
        }
    }

    /**
     * Déconnexion sécurisée
     */
    public async secureLogout(): Promise<void> {
        console.log('👋 Déconnexion en cours...');

        try {
            // Arrêter la surveillance de session
            this.stopSessionMonitoring();

            // Déconnecter de Firebase
            await signOut(auth);

            // Nettoyer l'état local
            this.currentUser = null;

            console.log('✅ Déconnexion réussie');

        } catch (error: any) {
            console.error('❌ Erreur lors de la déconnexion:', error);
            // Forcer le nettoyage même en cas d'erreur
            this.currentUser = null;
            this.stopSessionMonitoring();
        }
    }

    /**
     * Obtenir l'utilisateur actuel
     */
    public getCurrentUser(): User | null {
        return this.currentUser;
    }

    /**
     * Vérifier si l'utilisateur a une permission spécifique
     */
    public hasPermission(permission: string): boolean {
        if (!this.currentUser) return false;

        const rolePermissions: Record<UserRole, string[]> = {
            admin: ['*'], // Toutes les permissions
            supplier: ['manage_products', 'view_orders', 'manage_customers', 'view_analytics'],
            customer: ['place_orders', 'view_products', 'manage_profile'],
            sourcer: ['view_products', 'manage_sourcing', 'view_analytics'],
            influencer: ['view_products', 'manage_content', 'view_analytics']
        };

        const userPermissions = rolePermissions[this.currentUser.role] || [];
        return userPermissions.includes('*') || userPermissions.includes(permission);
    }

    /**
     * Vérifier si l'utilisateur a un rôle spécifique
     */
    public hasRole(role: UserRole): boolean {
        return this.currentUser?.role === role;
    }

    /**
     * Vérifier si l'utilisateur a l'un des rôles spécifiés
     */
    public hasAnyRole(roles: UserRole[]): boolean {
        if (!this.currentUser) return false;
        return roles.includes(this.currentUser.role);
    }

    /**
     * Nettoyer le service lors de la destruction
     */
    public cleanup(): void {
        console.log('🧹 Nettoyage du service d\'authentification...');

        if (this.authStateUnsubscribe) {
            this.authStateUnsubscribe();
            this.authStateUnsubscribe = null;
        }

        this.stopSessionMonitoring();
        this.currentUser = null;
    }

    /**
     * Charger le profil utilisateur depuis Firestore
     */
    private async loadUserProfile(firebaseUser: FirebaseUser): Promise<User | null> {
        try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                console.error(`❌ Profil utilisateur non trouvé: ${firebaseUser.uid}`);
                return null;
            }

            const userData = userDoc.data() as User;

            // Assurer la cohérence des données
            const user: User = {
                ...userData,
                uid: firebaseUser.uid,
                id: userData.id || firebaseUser.uid,
                email: userData.email || firebaseUser.email || '',
                name: userData.name || firebaseUser.displayName || 'Utilisateur'
            };

            console.log(`✅ Profil chargé: ${user.name} (${user.role})`);
            return user;

        } catch (error: any) {
            console.error('❌ Erreur chargement profil:', error);
            return null;
        }
    }

    /**
     * Déterminer la redirection selon le rôle
     */
    private determineRedirection(role: UserRole): string {
        const redirections: Record<UserRole, string> = {
            admin: '/admin/dashboard',
            supplier: '/supplier/dashboard',
            customer: '/dashboard',
            sourcer: '/sourcer/dashboard',
            influencer: '/sourcer/dashboard'
        };

        return redirections[role] || '/dashboard';
    }

    /**
     * Valider les données de connexion
     */
    private validateLoginInput(email: string, password: string): { valid: boolean; error?: string } {
        if (!email || !email.trim()) {
            return { valid: false, error: 'L\'adresse email est requise' };
        }

        if (!email.includes('@') || !email.includes('.')) {
            return { valid: false, error: 'Format d\'email invalide' };
        }

        if (!password || password.length < 6) {
            return { valid: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
        }

        return { valid: true };
    }

    /**
     * Formater les erreurs d'authentification
     */
    private formatAuthError(error: AuthError): string {
        const errorMessages: Record<string, string> = {
            'auth/user-not-found': 'Aucun compte associé à cette adresse email',
            'auth/wrong-password': 'Mot de passe incorrect',
            'auth/invalid-credential': 'Identifiants invalides',
            'auth/user-disabled': 'Ce compte a été désactivé',
            'auth/too-many-requests': 'Trop de tentatives de connexion. Réessayez plus tard',
            'auth/network-request-failed': 'Erreur de connexion. Vérifiez votre internet',
            'auth/invalid-email': 'Format d\'email invalide'
        };

        return errorMessages[error.code] || error.message || 'Erreur de connexion inconnue';
    }

    /**
     * Mettre à jour la dernière connexion
     */
    private async updateLastLogin(userId: string): Promise<void> {
        try {
            const userDocRef = doc(db, 'users', userId);
            const now = new Date().toISOString();

            await updateDoc(userDocRef, {
                lastLogin: now,
                last_login: now,
                updatedAt: now,
                updated_at: now
            });

            console.log('🔄 Dernière connexion mise à jour');
        } catch (error: any) {
            console.warn('⚠️ Erreur mise à jour dernière connexion:', error);
        }
    }

    /**
     * Mettre à jour la dernière activité
     */
    private async updateLastActivity(): Promise<void> {
        if (!this.currentUser) return;

        try {
            const userDocRef = doc(db, 'users', this.currentUser.id);
            const now = new Date().toISOString();

            await updateDoc(userDocRef, {
                lastActivity: now,
                updatedAt: now,
                updated_at: now
            });

        } catch (error: any) {
            console.warn('⚠️ Erreur mise à jour activité:', error);
        }
    }

    /**
     * Démarrer la surveillance de session
     */
    private startSessionMonitoring(): void {
        this.stopSessionMonitoring(); // S'assurer qu'aucune surveillance n'est en cours

        // Vérifier l'activité périodiquement
        this.sessionTimeout = setInterval(async () => {
            await this.updateLastActivity();
        }, this.ACTIVITY_CHECK_INTERVAL);

        console.log('🔄 Surveillance de session démarrée');
    }

    /**
     * Arrêter la surveillance de session
     */
    private stopSessionMonitoring(): void {
        if (this.sessionTimeout) {
            clearInterval(this.sessionTimeout);
            this.sessionTimeout = null;
            console.log('🛑 Surveillance de session arrêtée');
        }
    }
}

// Instance singleton pour utilisation globale
export const secureAuthService = SecureAuthService.getInstance();

// Exposer le service dans la console pour debug (développement seulement)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).secureAuthService = secureAuthService;
}
