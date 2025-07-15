/**
 * Script de réinitialisation complète des utilisateurs Firebase
 * Ce script supprime tous les utilisateurs existants et en crée de nouveaux
 */

console.log('🔄 === RÉINITIALISATION COMPLÈTE DES UTILISATEURS ===');

class UserResetService {

    /**
     * Supprimer tous les utilisateurs de Firestore
     */
    static async deleteAllUsers() {
        console.log('🗑️ Suppression de tous les utilisateurs...');

        try {
            // Importer les modules Firebase
            const { collection, getDocs, deleteDoc, doc } = await import('firebase/firestore');
            const { db } = await import('./src/lib/firebaseClient.js');

            // Récupérer tous les utilisateurs
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);

            console.log(`📊 ${usersSnapshot.size} utilisateur(s) trouvé(s)`);

            if (usersSnapshot.size === 0) {
                console.log('ℹ️ Aucun utilisateur à supprimer');
                return { success: true, deletedCount: 0 };
            }

            // Supprimer chaque utilisateur
            const deletePromises = [];
            usersSnapshot.forEach((userDoc) => {
                console.log(`🗑️ Suppression: ${userDoc.data().email}`);
                deletePromises.push(deleteDoc(doc(db, 'users', userDoc.id)));
            });

            await Promise.all(deletePromises);

            console.log(`✅ ${usersSnapshot.size} utilisateur(s) supprimé(s) de Firestore`);

            return {
                success: true,
                deletedCount: usersSnapshot.size
            };

        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Créer de nouveaux utilisateurs synchronisés
     */
    static async createNewUsers() {
        console.log('👥 Création de nouveaux utilisateurs...');

        const newUsers = [
            {
                email: 'admin@chinetonusine.com',
                password: 'admin123456',
                name: 'Administrateur Principal',
                role: 'admin'
            },
            {
                email: 'admin2@chinetonusine.com',
                password: 'admin123456',
                name: 'Administrateur Secondaire',
                role: 'admin'
            },
            {
                email: 'fournisseur@chinetonusine.com',
                password: 'fournisseur123',
                name: 'Fournisseur Test',
                role: 'supplier'
            },
            {
                email: 'client@chinetonusine.com',
                password: 'client123',
                name: 'Client Test',
                role: 'customer'
            },
            {
                email: 'sourcer@chinetonusine.com',
                password: 'sourcer123',
                name: 'Sourcer Test',
                role: 'sourcer'
            }
        ];

        const results = [];

        for (const userData of newUsers) {
            try {
                console.log(`👤 Création: ${userData.email} (${userData.role})`);

                if (window.AdminCreationService) {
                    const result = await window.AdminCreationService.createNewAdminAccount({
                        email: userData.email,
                        password: userData.password,
                        name: userData.name
                    });

                    if (result.success) {
                        console.log(`✅ ${userData.email} créé avec succès`);
                        results.push({
                            email: userData.email,
                            password: userData.password,
                            role: userData.role,
                            success: true,
                            uid: result.uid
                        });
                    } else {
                        console.log(`⚠️ ${userData.email}: ${result.message}`);
                        results.push({
                            email: userData.email,
                            success: false,
                            error: result.message
                        });
                    }
                } else {
                    console.error('❌ AdminCreationService non disponible');
                    break;
                }

                // Pause entre les créations
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`❌ Erreur pour ${userData.email}:`, error);
                results.push({
                    email: userData.email,
                    success: false,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Processus complet de réinitialisation
     */
    static async fullReset() {
        console.log('🚀 Démarrage de la réinitialisation complète...');

        try {
            // Étape 1: Supprimer tous les utilisateurs existants
            console.log('\n1️⃣ === SUPPRESSION ===');
            const deleteResult = await this.deleteAllUsers();

            if (!deleteResult.success) {
                throw new Error('Échec de la suppression: ' + deleteResult.error);
            }

            // Pause pour s'assurer que la suppression est complète
            console.log('⏳ Pause pour synchronisation...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Étape 2: Créer de nouveaux utilisateurs
            console.log('\n2️⃣ === CRÉATION ===');
            const createResults = await this.createNewUsers();

            // Résumé
            console.log('\n📊 === RÉSUMÉ ===');
            console.log(`🗑️ Utilisateurs supprimés: ${deleteResult.deletedCount}`);

            const successful = createResults.filter(r => r.success);
            const failed = createResults.filter(r => !r.success);

            console.log(`✅ Utilisateurs créés: ${successful.length}`);
            console.log(`❌ Échecs: ${failed.length}`);

            if (successful.length > 0) {
                console.log('\n🔑 === NOUVEAUX COMPTES ===');
                successful.forEach(user => {
                    console.log(`📧 ${user.email}`);
                    console.log(`🔒 ${user.password}`);
                    console.log(`👤 ${user.role}`);
                    console.log(`🆔 ${user.uid}`);
                    console.log('---');
                });

                // Afficher une alerte récapitulative
                const credentials = successful.map(u =>
                    `📧 ${u.email}\n🔒 ${u.password}\n👤 ${u.role}`
                ).join('\n\n');

                alert(`✅ Réinitialisation terminée !\n\n${successful.length} comptes créés:\n\n${credentials}\n\n🔗 Connectez-vous sur /login`);
            }

            if (failed.length > 0) {
                console.log('\n⚠️ === ÉCHECS ===');
                failed.forEach(user => {
                    console.log(`❌ ${user.email}: ${user.error}`);
                });
            }

            return {
                success: true,
                deleted: deleteResult.deletedCount,
                created: successful.length,
                failed: failed.length,
                accounts: successful
            };

        } catch (error) {
            console.error('💥 Erreur lors de la réinitialisation:', error);
            alert('❌ Erreur: ' + error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Fonctions de raccourci
async function deleteAllUsers() {
    return await UserResetService.deleteAllUsers();
}

async function createNewUsers() {
    return await UserResetService.createNewUsers();
}

async function resetAllUsers() {
    return await UserResetService.fullReset();
}

// Exposer les fonctions globalement
window.UserResetService = UserResetService;
window.deleteAllUsers = deleteAllUsers;
window.createNewUsers = createNewUsers;
window.resetAllUsers = resetAllUsers;

// Instructions
console.log(`
🎯 === COMMANDES DISPONIBLES ===

🔄 Réinitialisation complète (recommandée) :
   resetAllUsers()

🗑️ Supprimer tous les utilisateurs seulement :
   deleteAllUsers()

👥 Créer de nouveaux utilisateurs seulement :
   createNewUsers()

⚡ LANCEMENT AUTOMATIQUE dans 5 secondes...
🛑 Pour annuler : clearTimeout(autoReset)
`);

// Lancement automatique après 5 secondes
console.log('⏰ Réinitialisation automatique dans 5 secondes...');
const autoReset = setTimeout(() => {
    console.log('🚀 Lancement automatique de la réinitialisation...');
    resetAllUsers();
}, 5000);
