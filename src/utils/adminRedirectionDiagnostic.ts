import { adminUserServiceFixed } from '../services/adminUserServiceFixed';
import { auth, db } from '../lib/firebaseClient';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

/**
 * Script de diagnostic pour le problème de redirection admin
 * Ce script vérifie et corrige la configuration de l'utilisateur admin@chinetonusine.com
 */
export class AdminRedirectionDiagnostic {
    private adminEmail = 'admin@chinetonusine.com';

    /**
     * Diagnostic complet de l'utilisateur admin
     */
    async runFullDiagnostic() {
        console.log('🔍 === DIAGNOSTIC REDIRECTION ADMIN ===');
        console.log(`Vérification de l'utilisateur: ${this.adminEmail}`);

        // 1. Vérifier l'utilisateur connecté
        await this.checkCurrentUser();

        // 2. Vérifier l'existence en Firestore
        await this.checkFirestoreUser();

        // 3. Vérifier le rôle dans Firestore
        await this.checkUserRole();

        // 4. Corriger automatiquement si nécessaire
        await this.fixAdminUser();

        // 5. Test de synchronisation
        await this.testSynchronization();

        console.log('✅ === DIAGNOSTIC TERMINÉ ===');
    }

    /**
     * Vérifier l'utilisateur actuellement connecté
     */
    private async checkCurrentUser() {
        console.log('\n📱 Vérification de l\'utilisateur connecté...');

        const currentUser = auth.currentUser;
        if (!currentUser) {
            console.log('❌ Aucun utilisateur connecté');
            return;
        }

        console.log(`✅ Utilisateur connecté: ${currentUser.email}`);
        console.log(`   UID: ${currentUser.uid}`);
        console.log(`   Nom: ${currentUser.displayName || 'Non défini'}`);
        console.log(`   Email vérifié: ${currentUser.emailVerified}`);
        console.log(`   Dernière connexion: ${currentUser.metadata.lastSignInTime}`);
    }

    /**
     * Vérifier l'existence de l'utilisateur en Firestore
     */
    private async checkFirestoreUser() {
        console.log('\n💾 Vérification en Firestore...');

        try {
            // Rechercher par email
            const users = await adminUserServiceFixed.getAllUsers();
            const adminUser = users.find(user => user.email === this.adminEmail);

            if (adminUser) {
                console.log(`✅ Utilisateur trouvé en Firestore:`);
                console.log(`   UID: ${adminUser.uid}`);
                console.log(`   Email: ${adminUser.email}`);
                console.log(`   Nom: ${adminUser.name}`);
                console.log(`   Rôle: ${adminUser.role}`);
                console.log(`   Actif: ${adminUser.isActive}`);
                console.log(`   Dernière connexion: ${adminUser.lastLogin || 'Jamais'}`);
            } else {
                console.log('❌ Utilisateur admin non trouvé en Firestore');
                console.log('   L\'utilisateur doit être créé ou synchronisé');
            }
        } catch (error) {
            console.error('❌ Erreur lors de la vérification Firestore:', error);
        }
    }

    /**
     * Vérifier spécifiquement le rôle admin
     */
    private async checkUserRole() {
        console.log('\n🔐 Vérification du rôle admin...');

        try {
            const users = await adminUserServiceFixed.getAllUsers();
            const adminUser = users.find(user => user.email === this.adminEmail);

            if (adminUser) {
                if (adminUser.role === 'admin') {
                    console.log('✅ Rôle admin correctement défini');
                } else {
                    console.log(`❌ Rôle incorrect: ${adminUser.role} (devrait être 'admin')`);
                }
            } else {
                console.log('❌ Impossible de vérifier le rôle - utilisateur non trouvé');
            }
        } catch (error) {
            console.error('❌ Erreur lors de la vérification du rôle:', error);
        }
    }

    /**
     * Corriger automatiquement l'utilisateur admin
     */
    private async fixAdminUser() {
        console.log('\n🔧 Correction automatique de l\'utilisateur admin...');

        try {
            const users = await adminUserServiceFixed.getAllUsers();
            const adminUser = users.find(user => user.email === this.adminEmail);

            if (adminUser) {
                // Mettre à jour le rôle si nécessaire
                if (adminUser.role !== 'admin') {
                    console.log('🔄 Mise à jour du rôle vers admin...');

                    const userRef = doc(db, 'users', adminUser.uid);
                    await updateDoc(userRef, {
                        role: 'admin',
                        updated_at: new Date().toISOString()
                    });

                    console.log('✅ Rôle mis à jour vers admin');
                } else {
                    console.log('✅ Rôle admin déjà correct');
                }

                // S'assurer que l'utilisateur est actif
                if (!adminUser.isActive) {
                    console.log('🔄 Activation de l\'utilisateur...');

                    const userRef = doc(db, 'users', adminUser.uid);
                    await updateDoc(userRef, {
                        isActive: true,
                        updated_at: new Date().toISOString()
                    });

                    console.log('✅ Utilisateur activé');
                }
            } else {
                console.log('🔄 Création de l\'utilisateur admin...');

                // Créer l'utilisateur admin s'il n'existe pas
                const currentUser = auth.currentUser;
                if (currentUser && currentUser.email === this.adminEmail) {
                    const adminUserData = {
                        uid: currentUser.uid,
                        id: currentUser.uid,
                        email: this.adminEmail,
                        name: 'Admin Principal',
                        role: 'admin' as const,
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

                    const userRef = doc(db, 'users', currentUser.uid);
                    await setDoc(userRef, adminUserData);

                    console.log('✅ Utilisateur admin créé en Firestore');
                } else {
                    console.log('❌ Impossible de créer l\'utilisateur - non connecté avec le bon email');
                }
            }
        } catch (error) {
            console.error('❌ Erreur lors de la correction:', error);
        }
    }

    /**
     * Tester la synchronisation
     */
    private async testSynchronization() {
        console.log('\n🔄 Test de synchronisation...');

        try {
            const result = await adminUserServiceFixed.syncAllVisibleUsers();

            if (result.success) {
                console.log(`✅ Synchronisation réussie: ${result.count} utilisateur(s) synchronisé(s)`);
            } else {
                console.log(`❌ Échec de la synchronisation: ${result.error}`);
            }
        } catch (error) {
            console.error('❌ Erreur lors du test de synchronisation:', error);
        }
    }

    /**
     * Afficher les statistiques utilisateurs
     */
    async showUserStats() {
        console.log('\n📊 Statistiques des utilisateurs...');

        try {
            const stats = await adminUserServiceFixed.getUserStats();

            console.log(`Total: ${stats.total}`);
            console.log(`Admins: ${stats.byRole.admin}`);
            console.log(`Fournisseurs: ${stats.byRole.supplier}`);
            console.log(`Clients: ${stats.byRole.customer}`);
            console.log(`Actifs: ${stats.active}`);
            console.log(`Inactifs: ${stats.inactive}`);
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des statistiques:', error);
        }
    }

    /**
     * Lancer un diagnostic rapide depuis la console
     */
    static async quickDiagnostic() {
        const diagnostic = new AdminRedirectionDiagnostic();
        await diagnostic.runFullDiagnostic();
        await diagnostic.showUserStats();
    }
}

// Exporter pour utilisation dans la console
(window as any).AdminDiagnostic = AdminRedirectionDiagnostic;
