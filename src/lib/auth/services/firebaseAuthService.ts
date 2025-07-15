import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../../firebaseClient';
import { User, UserRole } from '../../../types';

class FirebaseAuthService {
  private currentUser: FirebaseUser | null = null;

  constructor() {
    // Écouter les changements d'état d'authentification
    // onAuthStateChanged(auth, (user: FirebaseUser | null) => {
    //   this.currentUser = user;
    // });
  }

  // Expose Firebase onAuthStateChanged
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await this.getUserData(userCredential.user.uid);
      
      return {
        user: userDoc,
        error: null
      };
    } catch (error) {
      console.error('Erreur de connexion Firebase:', error);
      return {
        user: null,
        error: error instanceof Error ? error.message : 'Erreur de connexion inconnue.'
      };
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Vérifier si l'utilisateur existe déjà dans Firestore ou le créer
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Créer le document utilisateur si c'est une nouvelle inscription Google
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          role: 'customer', // Rôle par défaut pour les nouvelles inscriptions Google
          language: 'fr',
          currency: 'EUR',
          favorites: [],
          messages: [],
          browsingHistory: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await setDoc(userDocRef, userData);
        return { user: userData, error: null };
      } else {
        // Récupérer les données existantes de Firestore
        const userData = userDoc.data() as User;
        const hydratedUser: User = {
          ...userData,
          favorites: userData.favorites || [],
          messages: userData.messages || [],
          browsingHistory: userData.browsingHistory || []
        };
        return { user: hydratedUser, error: null };
      }
    } catch (error) {
      console.error('Erreur de connexion Google Firebase:', error);
      return {
        user: null,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion Google.'
      };
    }
  }

  async signUp(email: string, password: string, name: string, role: UserRole = 'customer') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Créer le document utilisateur dans Firestore
      const userData: User = {
        id: userCredential.user.uid,
        email: email,
        name: name,
        role: role,
        language: 'fr',
        currency: 'EUR',
        subscription: 'free',
        favorites: [],
        messages: [],
        browsingHistory: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      return {
        user: userData,
        error: null
      };
    } catch (error) {
      console.error('Erreur d\'inscription Firebase:', error);
      return {
        user: null,
        error: error instanceof Error ? error.message : 'Erreur d\'inscription inconnue.'
      };
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      console.error('Erreur de déconnexion Firebase:', error);
      return { error: error instanceof Error ? error.message : 'Erreur de déconnexion inconnue.' };
    }
  }

  async getCurrentUser() {
    if (!this.currentUser) return null;
    return this.getUserData(this.currentUser.uid);
  }

  async getSession() {
    if (!this.currentUser) return { session: null };
    
    const userData = await this.getUserData(this.currentUser.uid);
    return {
      session: userData ? {
        user: userData,
        access_token: await this.currentUser.getIdToken()
      } : null
    };
  }

  async updateUser(userId: string, userData: Partial<User>) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        updated_at: new Date().toISOString()
      });
      return { error: null };
    } catch (error) {
      console.error('Erreur de mise à jour Firebase:', error);
      return { error: error instanceof Error ? error.message : 'Erreur de mise à jour inconnue.' };
    }
  }

  async getUserData(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return null;
      const data = userDoc.data() as User;
      return {
        ...data,
        favorites: data.favorites || [],
        messages: data.messages || [],
        browsingHistory: data.browsingHistory || []
      };
    } catch (error) {
      console.error('Erreur de récupération des données utilisateur:', error);
      return null;
    }
  }

  async checkHealth() {
    try {
      // Vérifier l'authentification
      const user = await this.getCurrentUser();
      
      // Vérifier Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'admin'));
      await getDocs(q);

      return {
        isHealthy: !!user,
        error: null
      };
    } catch (error) {
      return {
        isHealthy: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Nouvelles méthodes CRUD pour la gestion des utilisateurs

  /**
   * Récupère tous les utilisateurs (admin uniquement)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });
      
      return users;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  /**
   * Recherche des utilisateurs par email ou nom
   */
  async searchUsers(searchTerm: string, roleFilter?: UserRole): Promise<User[]> {
    try {
      const users = await this.getAllUsers();
      
      let filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (roleFilter) {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }

      return filteredUsers;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      throw error;
    }
  }

  /**
   * Supprime un utilisateur (admin uniquement)
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Met à jour le rôle d'un utilisateur (admin uniquement)
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      throw error;
    }
  }

  /**
   * Obtient les statistiques des utilisateurs
   */
  async getUserStats(): Promise<{
    total: number;
    byRole: Record<UserRole, number>;
    recentSignups: number;
  }> {
    try {
      const users = await this.getAllUsers();
      
      const stats = {
        total: users.length,
        byRole: {
          admin: 0,
          supplier: 0,
          customer: 0,
          sourcer: 0,
          influencer: 0
        } as Record<UserRole, number>,
        recentSignups: 0
      };

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      users.forEach(user => {
        stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
        
        if (user.created_at) {
          const createdAt = new Date(user.created_at);
          if (createdAt > oneWeekAgo) {
            stats.recentSignups++;
          }
        }
      });

      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService(); 