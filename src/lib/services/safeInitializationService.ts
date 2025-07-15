import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseClient';
import { UserRole } from '../../types';

export interface SafeTestUser {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    company?: string;
}

// Utilisateurs de test à créer pour chaque rôle (Firestore seulement)
export const SAFE_TEST_USERS: SafeTestUser[] = [
    {
        email: 'admin@chinetonusine.com',
        password: 'Admin123!',
        name: 'Administrateur Principal',
        role: 'admin',
        company: 'ChineTonUsine Admin'
    },
    {
        email: 'supplier@technomax.com',
        password: 'Supplier123!',
        name: 'Wang Lei - TechnoMax',
        role: 'supplier',
        company: 'TechnoMax Solutions'
    },
    {
        email: 'client@entreprise.fr',
        password: 'Client123!',
        name: 'Marie Dubois',
        role: 'customer',
        company: 'Entreprise Solutions France'
    },
    {
        email: 'sourcer@global.com',
        password: 'Sourcer123!',
        name: 'Ahmed Benali',
        role: 'sourcer',
        company: 'Global Sourcing'
    }
];

/**
 * Service d'initialisation sécurisé qui n'utilise QUE Firestore
 * Évite les erreurs Auth et les déconnexions automatiques
 */
class SafeInitializationService {
    private isInitialized = false;

    /**
     * Initialise les utilisateurs de test SEULEMENT dans Firestore
     * (pas dans Firebase Auth pour éviter les déconnexions)
     */
    async initializeTestUsersFirestoreOnly(): Promise<void> {
        if (this.isInitialized) {
            console.log('✅ Utilisateurs de test déjà initialisés');
            return;
        }

        try {
            console.log('🔥 Initialisation des utilisateurs de test (Firestore seulement)...');

            // Vérifier si des utilisateurs existent déjà
            const usersCollection = collection(db, 'users');
            const snapshot = await getDocs(usersCollection);

            if (snapshot.size > 0) {
                console.log(`ℹ️ ${snapshot.size} utilisateurs existent déjà, pas d'initialisation`);
                this.isInitialized = true;
                return;
            }

            // Créer les utilisateurs de test
            const results = await this.createTestUsersFirestoreOnly();
            const successful = results.filter(r => r.success).length;
            const failed = results.filter(r => !r.success).length;

            console.log(`✅ Initialisation terminée: ${successful} créés, ${failed} échoués`);

            if (failed > 0) {
                console.warn('⚠️ Certains utilisateurs n\'ont pas pu être créés');
            }

            this.isInitialized = true;
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation sécurisée:', error);
            throw error;
        }
    }

    /**
     * Crée les utilisateurs de test SEULEMENT dans Firestore
     */
    private async createTestUsersFirestoreOnly(): Promise<Array<{ email: string, success: boolean, error?: string }>> {
        const results = [];

        for (const testUser of SAFE_TEST_USERS) {
            try {
                console.log(`Création Firestore: ${testUser.email} (${testUser.role})`);

                // Générer un UID unique
                const uid = `safe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const now = new Date().toISOString();

                const userDocument = {
                    uid: uid,
                    id: uid,
                    email: testUser.email,
                    name: testUser.name,
                    role: testUser.role,
                    company: testUser.company || '',
                    isActive: true,
                    language: 'fr',
                    currency: 'EUR',
                    favorites: [],
                    browsingHistory: [],
                    messages: [],
                    subscription: 'free',
                    createdAt: now,
                    updatedAt: now,
                    created_at: now,
                    updated_at: now,
                    // Mot de passe temporaire pour référence (production: Admin SDK)
                    temporaryPassword: testUser.password,
                    authType: 'firestore-only',
                    createdBy: 'safe-initialization-service'
                };

                // Sauvegarder SEULEMENT dans Firestore
                await setDoc(doc(db, 'users', uid), userDocument);

                console.log(`✅ Utilisateur Firestore ${testUser.email} créé avec succès`);
                results.push({ email: testUser.email, success: true });

                // Délai pour éviter de surcharger Firestore
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error: any) {
                console.error(`❌ Erreur Firestore pour ${testUser.email}:`, error);
                results.push({
                    email: testUser.email,
                    success: false,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Affiche les identifiants de test (pour information)
     */
    displayTestCredentials(): void {
        console.log('🔑 Identifiants de test disponibles (Firestore seulement):');
        SAFE_TEST_USERS.forEach(user => {
            console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
        });
    }

    /**
     * Réinitialise le statut d'initialisation
     */
    reset(): void {
        this.isInitialized = false;
    }
}

export const safeInitializationService = new SafeInitializationService();
