import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { secureAuthService } from '../services/secureAuthService';
import { productionUserService } from '../services/productionUserService';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{
        success: boolean;
        user?: User;
        error?: string;
        redirectTo?: string;
    }>;
    register: (email: string, password: string, name: string, role?: UserRole) => Promise<{ user: User | null; error?: string }>;
    signInWithGoogle: () => Promise<{ user: User | null; error?: string }>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: UserRole) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                console.log('🔐 Initialisation du contexte d\'authentification sécurisé...');

                // Initialiser le service de production
                const authStateUnsubscribe = productionUserService.initializeAuthStateListener();

                // Initialiser le service d'authentification sécurisé
                const currentUser = await secureAuthService.initialize();

                if (mounted) {
                    setUser(currentUser);
                    setLoading(false);

                    if (currentUser) {
                        console.log(`✅ Utilisateur connecté: ${currentUser.name} (${currentUser.role})`);
                    } else {
                        console.log('👋 Aucun utilisateur connecté');
                    }
                }

                // Nettoyer lors du démontage
                return () => {
                    if (authStateUnsubscribe) {
                        authStateUnsubscribe();
                    }
                    productionUserService.stopAuthStateListener();
                    secureAuthService.cleanup();
                };

            } catch (error: any) {
                console.error('❌ Erreur initialisation auth:', error);
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        const cleanup = initAuth();

        return () => {
            mounted = false;
            if (cleanup instanceof Promise) {
                cleanup.then(cleanupFn => {
                    if (cleanupFn && typeof cleanupFn === 'function') {
                        cleanupFn();
                    }
                });
            }
        };
    }, []);

    const login = async (email: string, password: string) => {
        console.log(`🔐 Tentative de connexion: ${email}`);

        try {
            const result = await secureAuthService.secureLogin(email, password);

            if (result.success && result.user) {
                setUser(result.user);
                console.log(`✅ Connexion réussie: ${result.user.name}`);
            } else {
                console.log(`❌ Connexion échouée: ${result.error}`);
            }

            return result;

        } catch (error: any) {
            console.error('❌ Erreur connexion:', error);
            return {
                success: false,
                error: error.message || 'Erreur de connexion'
            };
        }
    };

    const register = async (email: string, password: string, name: string, role: UserRole = 'customer') => {
        console.log(`📝 Tentative d'inscription: ${email}`);

        try {
            const result = await productionUserService.createProductionUser({
                email,
                password,
                name,
                role,
                isActive: true
            });

            if (result.success && result.user) {
                console.log(`✅ Inscription réussie: ${result.user.name}`);

                // Connecter automatiquement l'utilisateur après inscription
                const loginResult = await secureAuthService.secureLogin(email, password);
                if (loginResult.success && loginResult.user) {
                    setUser(loginResult.user);
                }

                return { user: result.user };
            } else {
                console.log(`❌ Inscription échouée: ${result.error}`);
                return { user: null, error: result.error };
            }

        } catch (error: any) {
            console.error('❌ Erreur inscription:', error);
            return { user: null, error: error.message || 'Erreur d\'inscription' };
        }
    };

    const signInWithGoogle = async () => {
        console.log('🔍 Connexion Google non implémentée en production');
        return {
            user: null,
            error: 'Connexion Google non disponible en production. Utilisez email/mot de passe.'
        };
    };

    const logout = async () => {
        console.log('👋 Déconnexion...');

        try {
            await secureAuthService.secureLogout();
            setUser(null);
            console.log('✅ Déconnexion réussie');

        } catch (error: any) {
            console.error('❌ Erreur déconnexion:', error);
            // Forcer la déconnexion côté client même en cas d'erreur
            setUser(null);
        }
    };

    const updateUser = async (userData: Partial<User>) => {
        console.log('🔄 Mise à jour utilisateur...');

        if (!user) {
            console.warn('⚠️ Aucun utilisateur connecté pour mise à jour');
            return;
        }

        try {
            // Mettre à jour l'état local
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);

            // TODO: Implémenter la mise à jour en base de données
            console.log('✅ Utilisateur mis à jour localement');

        } catch (error: any) {
            console.error('❌ Erreur mise à jour utilisateur:', error);
        }
    };

    const hasPermission = (permission: string): boolean => {
        return secureAuthService.hasPermission(permission);
    };

    const hasRole = (role: UserRole): boolean => {
        return secureAuthService.hasRole(role);
    };

    const hasAnyRole = (roles: UserRole[]): boolean => {
        return secureAuthService.hasAnyRole(roles);
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        signInWithGoogle,
        logout,
        updateUser,
        hasPermission,
        hasRole,
        hasAnyRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};

export default AuthContext;
