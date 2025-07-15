/**
 * Script de suppression complète de la collection 'users' dans Firestore
 * 
 * ATTENTION: Ce script supprime DÉFINITIVEMENT tous les documents de la collection 'users'
 * Assurez-vous d'avoir une sauvegarde avant de l'exécuter en production !
 * 
 * Prérequis:
 * 1. Installer Firebase Admin SDK: npm install firebase-admin
 * 2. Télécharger le fichier de clé de service depuis Firebase Console > Paramètres > Comptes de service
 * 3. Remplacer le chemin vers votre fichier JSON de service account
 */

const admin = require('firebase-admin');
const path = require('path');

// Configuration - MODIFIEZ SELON VOTRE PROJET
const CONFIG = {
    // Chemin vers votre fichier de clé de service JSON
    // Téléchargez-le depuis: Firebase Console > Paramètres du projet > Comptes de service
    serviceAccountPath: './serviceAccountKey.json', // CHANGEZ CE CHEMIN

    // ID de votre projet Firebase
    projectId: 'chine-ton-usine',

    // Collection à nettoyer
    collectionName: 'users',

    // Taille des lots pour éviter les timeouts (max 500 pour les batches)
    batchSize: 100,

    // Délai entre les lots (en millisecondes) pour éviter la surcharge
    delayBetweenBatches: 500,

    // Mode confirmation (true = demander confirmation, false = exécution directe)
    confirmationMode: true
};

/**
 * Initialise Firebase Admin SDK
 */
function initializeFirebase() {
    try {
        // Vérifier si Firebase Admin est déjà initialisé
        if (admin.apps.length === 0) {
            const serviceAccount = require(path.resolve(CONFIG.serviceAccountPath));

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: CONFIG.projectId
            });

            console.log('✅ Firebase Admin SDK initialisé avec succès');
            console.log(`📊 Projet: ${CONFIG.projectId}`);
        }

        return admin.firestore();
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation Firebase:');
        console.error('   - Vérifiez le chemin vers serviceAccountKey.json');
        console.error('   - Vérifiez que le fichier JSON est valide');
        console.error('   - Détails:', error.message);
        process.exit(1);
    }
}

/**
 * Compte le nombre total de documents dans la collection
 */
async function countDocuments(db) {
    try {
        console.log('📊 Comptage des documents...');
        const snapshot = await db.collection(CONFIG.collectionName).get();
        return snapshot.size;
    } catch (error) {
        console.error('❌ Erreur lors du comptage:', error.message);
        return 0;
    }
}

/**
 * Supprime un lot de documents
 */
async function deleteBatch(db, documents) {
    const batch = db.batch();
    const deletedDocs = [];

    documents.forEach((doc) => {
        const docData = doc.data();
        console.log(`🗑️  Ajout à la suppression: ${doc.id}`);
        console.log(`   📧 Email: ${docData.email || 'Non défini'}`);
        console.log(`   👤 Nom: ${docData.name || 'Non défini'}`);
        console.log(`   🏢 Role: ${docData.role || 'Non défini'}`);

        batch.delete(doc.ref);
        deletedDocs.push({
            id: doc.id,
            email: docData.email,
            name: docData.name,
            role: docData.role
        });
    });

    try {
        await batch.commit();
        console.log(`✅ Lot de ${documents.length} document(s) supprimé avec succès`);
        return deletedDocs;
    } catch (error) {
        console.error(`❌ Erreur lors de la suppression du lot:`, error.message);
        throw error;
    }
}

/**
 * Fonction principale de suppression
 */
async function deleteAllUsers() {
    console.log('🧹 SCRIPT DE SUPPRESSION COMPLÈTE - COLLECTION USERS');
    console.log('='.repeat(70));
    console.log(`📂 Collection cible: ${CONFIG.collectionName}`);
    console.log(`🔥 Projet Firebase: ${CONFIG.projectId}`);
    console.log('⚠️  ATTENTION: Cette opération est IRRÉVERSIBLE !');
    console.log('');

    try {
        // Initialisation
        const db = initializeFirebase();

        // Comptage initial
        const totalCount = await countDocuments(db);

        if (totalCount === 0) {
            console.log('✅ La collection est déjà vide - Aucune suppression nécessaire');
            return;
        }

        console.log(`📋 ${totalCount} document(s) trouvé(s) à supprimer`);
        console.log('');

        // Demande de confirmation si activée
        if (CONFIG.confirmationMode) {
            const readline = require('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const confirmation = await new Promise((resolve) => {
                rl.question(`❓ Voulez-vous vraiment supprimer ${totalCount} document(s) ? (oui/non): `, (answer) => {
                    rl.close();
                    resolve(answer.toLowerCase());
                });
            });

            if (confirmation !== 'oui' && confirmation !== 'o' && confirmation !== 'yes' && confirmation !== 'y') {
                console.log('❌ Suppression annulée par l\'utilisateur');
                return;
            }
        }

        console.log('🚀 Début de la suppression...');
        console.log('');

        let deletedCount = 0;
        let batchNumber = 1;
        const allDeletedDocs = [];

        // Suppression par lots
        while (true) {
            console.log(`📦 Lot ${batchNumber}: Récupération de ${CONFIG.batchSize} documents...`);

            // Récupérer un lot de documents
            const snapshot = await db.collection(CONFIG.collectionName)
                .limit(CONFIG.batchSize)
                .get();

            if (snapshot.empty) {
                console.log('✅ Plus de documents à supprimer');
                break;
            }

            console.log(`📋 ${snapshot.size} document(s) récupéré(s) pour ce lot`);

            try {
                // Supprimer le lot
                const deletedDocs = await deleteBatch(db, snapshot.docs);
                allDeletedDocs.push(...deletedDocs);
                deletedCount += snapshot.size;

                console.log(`✅ Lot ${batchNumber} terminé`);
                console.log(`📊 Progression: ${deletedCount}/${totalCount} (${Math.round((deletedCount / totalCount) * 100)}%)`);
                console.log('');

                batchNumber++;

                // Délai entre les lots pour éviter la surcharge
                if (CONFIG.delayBetweenBatches > 0) {
                    console.log(`⏳ Pause de ${CONFIG.delayBetweenBatches}ms...`);
                    await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenBatches));
                }

            } catch (error) {
                console.error(`❌ Échec du lot ${batchNumber}:`, error.message);
                console.log('🔄 Tentative de continuer avec le lot suivant...');
                batchNumber++;
            }
        }

        // Vérification finale
        console.log('🔍 VÉRIFICATION FINALE...');
        const remainingCount = await countDocuments(db);

        if (remainingCount === 0) {
            console.log('✅ SUPPRESSION COMPLÈTE RÉUSSIE !');
            console.log(`🎯 ${deletedCount} document(s) supprimé(s) au total`);
            console.log('🔥 Collection users maintenant vide');
        } else {
            console.log(`⚠️  ${remainingCount} document(s) n'ont pas pu être supprimés`);
            console.log('🔄 Vous pouvez relancer le script pour terminer');
        }

        // Rapport détaillé
        console.log('');
        console.log('📄 RAPPORT DE SUPPRESSION:');
        console.log('-'.repeat(50));
        console.log(`📊 Documents traités: ${deletedCount}`);
        console.log(`✅ Suppressions réussies: ${allDeletedDocs.length}`);
        console.log(`❌ Documents restants: ${remainingCount}`);
        console.log(`🕒 Lots traités: ${batchNumber - 1}`);

        // Optionnel: Sauvegarder la liste des documents supprimés
        if (allDeletedDocs.length > 0) {
            const fs = require('fs');
            const reportPath = `deleted_users_${Date.now()}.json`;
            fs.writeFileSync(reportPath, JSON.stringify(allDeletedDocs, null, 2));
            console.log(`💾 Rapport détaillé sauvegardé: ${reportPath}`);
        }

    } catch (error) {
        console.error('💥 ERREUR CRITIQUE:', error.message);
        console.error('📋 Stack trace:', error.stack);
        process.exit(1);
    }
}

/**
 * Fonction de nettoyage et gestion des erreurs globales
 */
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Erreur non gérée:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Exception non capturée:', error.message);
    process.exit(1);
});

// Point d'entrée principal
if (require.main === module) {
    console.log('🚀 Démarrage du script de suppression...');
    console.log('');

    deleteAllUsers()
        .then(() => {
            console.log('');
            console.log('🎉 SCRIPT TERMINÉ AVEC SUCCÈS');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 ÉCHEC DU SCRIPT:', error.message);
            process.exit(1);
        });
}

module.exports = { deleteAllUsers };
