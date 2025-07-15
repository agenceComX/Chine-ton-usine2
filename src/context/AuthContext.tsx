import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { firebaseAuthService } from '../lib/auth/services/firebaseAuthService';
import { initializationService } from '../lib/services/initializationService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<{ user: User | null; error?: string }>;
  signInWithGoogle: () => Promise<{ user: User | null; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('Initialisation du contexte d\'authentification...');

        // 🚨 DÉSACTIVÉ - cause les erreurs Auth et déconnexions
        // Initialiser la base de données avec les utilisateurs et données de test
        try {
          // await initializationService.initializeDatabase();
          // initializationService.displayTestCredentials();
          console.log('⚠️ Service d\'initialisation automatique désactivé pour éviter les erreurs Auth');
        } catch (initError) {
          console.warn('⚠️ Erreur lors de l\'initialisation de la base:', initError);
          // Continuer même si l'initialisation échoue
        }

        // Vérifier l'état du service
        const health = await firebaseAuthService.checkHealth();
        console.log('État du service Firebase:', health);

        // Pour les tests : simuler un utilisateur fournisseur connecté
        // TODO: Retirer cette simulation en production
        // Code de connexion automatique désactivé pour permettre l'utilisation normale
        /*
        if (mounted && !user) {
          const testUser: User = {
            id: 'supplier-1',
            email: 'wang.lei@technomax.com',
            name: 'Wang Lei',
            role: 'supplier',
            language: 'fr',
            currency: 'EUR',
            favorites: [],
            browsingHistory: [],
            messages: [],
            created_at: '2024-01-15T00:00:00Z',
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            subscription: 'premium'
          };
          setUser(testUser);
          console.log('✅ Utilisateur de test chargé:', testUser);
        }
        */

        // Indiquer que le chargement initial est terminé une fois l'écouteur mis en place
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    // S'abonner aux changements d'état d'authentification Firebase
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      if (mounted) {
        console.log('Changement d\'état Firebase détecté:', firebaseUser?.email || 'Déconnecté');
        if (firebaseUser) {
          // Récupérer les données utilisateur de Firestore
          try {
            const userData = await firebaseAuthService.getUserData(firebaseUser.uid);
            if (mounted) {
              setUser(userData);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération des données utilisateur Firestore:", error);
            // Ne pas effacer l'utilisateur de test en cas d'erreur Firebase
            if (mounted && !user) {
              setUser(null);
            }
          }
        } else {
          // Déconnexion complète si pas d'utilisateur Firebase
          if (mounted) {
            setUser(null);
          }
          console.log('Utilisateur déconnecté');
        }
      }
    });

    initAuth(); // Exécute l'initialisation sans attendre le premier onAuthStateChanged pour le loading state

    return () => {
      mounted = false;
      unsubscribe(); // Nettoyage de l'écouteur
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log('Tentative de connexion depuis le contexte...');
      const { user, error } = await firebaseAuthService.signIn(email, password);
      if (error) throw new Error(error);
      if (!user) throw new Error('Échec de la connexion');

      // L'écouteur onAuthStateChanged s'occupera de mettre à jour l'état 'user'
      console.log('Connexion réussie depuis le contexte');
      return user;
    } catch (error) {
      console.error('Erreur de connexion dans le contexte:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole = 'customer') => {
    try {
      console.log('Tentative d\'inscription depuis le contexte...');
      const result = await firebaseAuthService.signUp(email, password, name, role);

      console.log('Inscription depuis le contexte:', result.user ? 'réussie' : 'échouée');

      if (result.error) {
        return { user: null, error: result.error };
      } else if (result.user) {
        return { user: result.user, error: undefined };
      } else {
        return { user: null, error: 'Une erreur inattendue est survenue lors de l\'inscription.' };
      }
    } catch (error) {
      console.error('Erreur d\'inscription dans le contexte:', error);
      return { user: null, error: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Tentative de connexion Google depuis le contexte...');
      const result = await firebaseAuthService.signInWithGoogle();

      console.log('Connexion Google depuis le contexte:', result.user ? 'réussie' : 'échouée');

      if (result.error) {
        return { user: null, error: result.error };
      } else if (result.user) {
        // L'écouteur onAuthStateChanged s'occupera de mettre à jour l'état 'user'
        return { user: result.user, error: undefined };
      } else {
        return { user: null, error: 'Une erreur inattendue est survenue lors de la connexion Google.' };
      }
    } catch (error) {
      console.error('Erreur de connexion Google dans le contexte:', error);
      return { user: null, error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion Google' };
    }
  };

  const logout = async () => {
    try {
      console.log('Déconnexion depuis le contexte...');

      // Déconnexion Firebase
      await firebaseAuthService.signOut();

      // Nettoyer toutes les données de session localStorage
      localStorage.removeItem('demoUser');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('lastLogin');

      // Nettoyer l'état local
      setUser(null);

      console.log('✅ Déconnexion complète effectuée');
    } catch (error) {
      console.error('Erreur de déconnexion dans le contexte:', error);
      // Même en cas d'erreur, nettoyer l'état local
      setUser(null);
      localStorage.removeItem('demoUser');
      localStorage.removeItem('user');
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      console.log('Mise à jour de l\'utilisateur:', userData);
      const { error } = await firebaseAuthService.updateUser(user.id, userData);

      if (error) throw error;

      // Mettre à jour l'état local
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      console.log('Utilisateur mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Admin a toutes les permissions
    if (user.role === 'admin') return true;

    // Logique des permissions par rôle
    const rolePermissions: Record<UserRole, string[]> = {
      admin: ['*'],
      supplier: ['manage_products', 'view_products', 'manage_orders', 'view_orders'],
      customer: ['view_products', 'view_orders'],
      sourcer: ['view_products', 'manage_sourcing'],
      influencer: ['view_products', 'create_content', 'manage_influence']
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      signInWithGoogle,
      logout,
      updateUser,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};