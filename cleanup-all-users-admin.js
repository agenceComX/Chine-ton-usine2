import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Configuration Firebase Admin SDK
const serviceAccountPath = './firebase-service-account.json';

/**
 * Initialise Firebase Admin SDK
 */
function initializeFirebaseAdmin() {
    try {
        if (admin.apps.length === 0) {
            let serviceAccount;

            try {
                serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
            } catch (error) {
                console.warn('⚠️  Fichier de service account non trouvé, utilisation de la configuration par défaut...');
                serviceAccount = {
                    type: "service_account",
                    project_id: "chine-ton-usine"
                };
            }

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: 'chine-ton-usine'
            });

            console.log('✅ Firebase Admin SDK initialisé');
        }

        return {
            auth: admin.auth(),
            firestore: admin.firestore()
        };

    } catch (error) {
        console.error('❌ Erreur initialisation Firebase Admin:', error.message);
        throw error;
    }
}

/**
 * Supprime tous les utilisateurs de Firebase Authentication
 */
async function deleteAllAuthUsers(auth) {
    console.log('🔐 Suppression des utilisateurs Firebase Authentication...');

    let deletedCount = 0;
    let nextPageToken;

    try {
        do {
            // Récupérer une page d'utilisateurs (max 1000)
            const listUsersResult = await auth.listUsers(1000, nextPageToken);

            if (listUsersResult.users.length === 0) {
                console.log('ℹ️  Aucun utilisateur trouvé dans Authentication');
                break;
            }

            // Extraire les UIDs
            const uids = listUsersResult.users.map(user => user.uid);

            console.log(`🗑️  Suppression de ${uids.length} utilisateurs Authentication...`);

            // Supprimer par batch (Firebase Admin SDK permet jusqu'à 1000 à la fois)
            const deleteResult = await auth.deleteUsers(uids);

            deletedCount += deleteResult.successCount;

            if (deleteResult.failureCount > 0) {
                console.warn(`⚠️  ${deleteResult.failureCount} suppressions échouées dans Authentication`);
                deleteResult.errors.forEach(error => {
                    console.error(`❌ Erreur suppression UID ${error.index}:`, error.error.message);
                });
            }

            nextPageToken = listUsersResult.pageToken;

            // Pause pour éviter les rate limits
            if (nextPageToken) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

        } while (nextPageToken);

        console.log(`✅ ${deletedCount} utilisateurs supprimés de Authentication`);
        return deletedCount;

    } catch (error) {
        console.error('❌ Erreur suppression utilisateurs Authentication:', error.message);
        throw error;
    }
}

/**
 * Supprime tous les documents de la collection users dans Firestore
 */
async function deleteAllFirestoreUsers(firestore) {
    console.log('📄 Suppression des documents Firestore users...');

    let deletedCount = 0;
    const batchSize = 500; // Taille de batch pour Firestore

    try {
        let hasMore = true;

        while (hasMore) {
            // Récupérer un batch de documents
            const snapshot = await firestore
                .collection('users')
                .limit(batchSize)
                .get();

            if (snapshot.empty) {
                console.log('ℹ️  Aucun document trouvé dans la collection users');
                hasMore = false;
                break;
            }

            // Créer un batch pour supprimer les documents
            const batch = firestore.batch();

            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            // Exécuter le batch
            await batch.commit();

            deletedCount += snapshot.docs.length;
            console.log(`🗑️  ${snapshot.docs.length} documents supprimés (total: ${deletedCount})`);

            // Si on a récupéré moins que la taille de batch, on a fini
            if (snapshot.docs.length < batchSize) {
                hasMore = false;
            }

            // Pause pour éviter les rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log(`✅ ${deletedCount} documents supprimés de Firestore`);
        return deletedCount;

    } catch (error) {
        console.error('❌ Erreur suppression documents Firestore:', error.message);
        throw error;
    }
}

/**
 * Vérifie que toutes les suppressions sont bien effectives
 */
async function verifyDeletion(auth, firestore) {
    console.log('🔍 Vérification de la suppression...');

    try {
        // Vérifier Authentication
        const authUsers = await auth.listUsers(10);
        const authCount = authUsers.users.length;

        // Vérifier Firestore
        const firestoreSnapshot = await firestore.collection('users').limit(10).get();
        const firestoreCount = firestoreSnapshot.size;

        console.log(`📊 Vérification terminée:`);
        console.log(`   - Authentication: ${authCount} utilisateurs restants`);
        console.log(`   - Firestore: ${firestoreCount} documents restants`);

        if (authCount === 0 && firestoreCount === 0) {
            console.log('✅ Suppression complète confirmée !');
            return true;
        } else {
            console.warn('⚠️  Suppression incomplète détectée');
            return false;
        }

    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error.message);
        return false;
    }
}

/**
 * Fonction principale de nettoyage complet
 */
async function cleanupAllUsers() {
    console.log('🧹 NETTOYAGE COMPLET DES UTILISATEURS');
    console.log('='.repeat(50));
    console.log('🏭 Projet: chine-ton-usine');
    console.log('⚠️  ATTENTION: Cette opération va supprimer TOUS les utilisateurs');
    console.log('📋 Zones impactées: Firebase Auth + Firestore users');

    try {
        // Initialisation
        const { auth, firestore } = initializeFirebaseAdmin();

        console.log('\n🚀 Début du nettoyage...');

        // 1. Supprimer tous les utilisateurs de Firebase Authentication
        console.log('\n📱 ÉTAPE 1: Nettoyage Firebase Authentication');
        console.log('-'.repeat(40));
        const authDeleted = await deleteAllAuthUsers(auth);

        // 2. Supprimer tous les documents de la collection users
        console.log('\n📄 ÉTAPE 2: Nettoyage Firestore');
        console.log('-'.repeat(40));
        const firestoreDeleted = await deleteAllFirestoreUsers(firestore);

        // 3. Vérification finale
        console.log('\n🔍 ÉTAPE 3: Vérification');
        console.log('-'.repeat(40));
        const isClean = await verifyDeletion(auth, firestore);

        // Résumé final
        console.log('\n📊 RÉSUMÉ DU NETTOYAGE');
        console.log('='.repeat(40));
        console.log(`🔐 Authentication: ${authDeleted} utilisateurs supprimés`);
        console.log(`📄 Firestore: ${firestoreDeleted} documents supprimés`);
        console.log(`✅ Nettoyage complet: ${isClean ? 'OUI' : 'NON'}`);

        if (isClean) {
            console.log('\n🎉 NETTOYAGE RÉUSSI !');
            console.log('💡 La base est maintenant vierge et prête pour les utilisateurs de production');
            console.log('🔄 Vous pouvez maintenant lancer le script de création des utilisateurs');
        } else {
            console.log('\n⚠️  NETTOYAGE PARTIEL');
            console.log('🔄 Vous pouvez relancer ce script pour compléter la suppression');
        }

        console.log('\n🎯 Prochaines étapes:');
        console.log('1. Exécuter create-production-users-admin.js');
        console.log('2. Tester les connexions');
        console.log('3. Configurer les règles de sécurité');

    } catch (error) {
        console.error('\n❌ ERREUR CRITIQUE:', error.message);
        console.error('📋 Stack trace:', error.stack);

        console.log('\n🔧 ACTIONS SUGGÉRÉES:');
        console.log('1. Vérifier les permissions Firebase Admin');
        console.log('2. Contrôler la connectivité internet');
        console.log('3. Vérifier la configuration du service account');

        process.exit(1);
    }
}

// Fonction de confirmation interactive
function askConfirmation() {
    return new Promise((resolve) => {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log('\n⚠️  ATTENTION: SUPPRESSION DÉFINITIVE');
        console.log('Cette action va supprimer TOUS les utilisateurs existants.');
        console.log('Cette opération est IRRÉVERSIBLE.');

        rl.question('\n❓ Êtes-vous sûr de vouloir continuer? (tapez "OUI" pour confirmer): ', (answer) => {
            rl.close();
            resolve(answer.trim().toUpperCase() === 'OUI');
        });
    });
}

// Exécution du script avec confirmation
if (import.meta.url === `file://${process.argv[1]}`) {
    (async () => {
        try {
            // Demander confirmation avant suppression
            const confirmed = await askConfirmation();

            if (!confirmed) {
                console.log('\n❌ Opération annulée par l\'utilisateur');
                console.log('💡 Aucune modification effectuée');
                process.exit(0);
            }

            console.log('\n✅ Confirmation reçue, début du nettoyage...');
            await cleanupAllUsers();

            console.log('\n🏁 Script de nettoyage terminé');
            process.exit(0);

        } catch (error) {
            console.error('\n💥 Échec du nettoyage:', error.message);
            process.exit(1);
        }
    })();
}

export { cleanupAllUsers };
