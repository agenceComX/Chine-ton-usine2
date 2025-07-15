import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, getDoc, CollectionReference, Query, DocumentData } from 'firebase/firestore';
import { db } from '../firebaseClient';
import { User, UserRole } from '../../types';
import { firebaseAuthService } from '../auth/services/firebaseAuthService';

class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const users: User[] = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<User, 'id'>)
      }) as User);
      return users;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw new Error('Impossible de récupérer les utilisateurs.');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const userDocRef = doc(db, 'users', id);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return { id: userDoc.id, ...(userDoc.data() as Omit<User, 'id'>) } as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur par ID:', error);
      throw new Error('Impossible de récupérer l\'utilisateur.');
    }
  }

  async createUser(email: string, password: string, name: string, role: UserRole): Promise<User> {
    try {
      const result = await firebaseAuthService.signUp(email, password, name, role);

      if (result.error || !result.user) {
        throw new Error(result.error || 'Erreur lors de la création de l\'utilisateur.');
      }
      return result.user;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw new Error('Impossible de créer l\'utilisateur.');
    }
  }

  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        ...data,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw new Error('Impossible de mettre à jour l\'utilisateur.');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw new Error('Impossible de supprimer l\'utilisateur.');
    }
  }

  async searchUsers(searchTerm: string, roleFilter?: UserRole): Promise<User[]> {
    try {
      let q: Query<DocumentData> | CollectionReference<DocumentData> = collection(db, 'users');
      
      if (searchTerm) {
        const allUsers = await this.getUsers();
        const filteredBySearch = allUsers.filter(user => 
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (roleFilter) {
          return filteredBySearch.filter(user => user.role === roleFilter);
        }
        return filteredBySearch;
      }

      if (roleFilter) {
        q = query(q, where('role', '==', roleFilter));
      }

      const querySnapshot = await getDocs(q);
      const users: User[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<User, 'id'>)
      }) as User);
      return users;
    } catch (error) {
      console.error('Erreur lors de la recherche des utilisateurs:', error);
      throw new Error('Impossible de rechercher les utilisateurs.');
    }
  }

  async updateUserLanguage(userId: string, language: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        language: language,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la langue utilisateur:', error);
      // Pas de throw pour éviter d'interrompre l'application si la mise à jour de la langue échoue
    }
  }
}

export const userService = new UserService();