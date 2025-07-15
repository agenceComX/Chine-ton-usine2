/**
 * Version simplifiée avec Firebase Client SDK (v9+)
 * Pour une utilisation rapide sans Firebase Admin SDK
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, limit } from 'firebase/firestore';

// Configuration Firebase - VÉRIFIEZ VOS PARAMÈTRES
const firebaseConfig = {
    apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
    authDomain: "chine-ton-usine.firebaseapp.com",
    projectId: "chine-ton-usine",
    storageBucket: "chine-ton-usine.firebasestorage.app",
    messagingSenderId: "528021984213",
    appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
    measurementId: "G-23BQZPXP86"
};

// Configuration du script
const CONFIG = {
    collectionName: 'users',
    batchSize: 50, // Plus petit pour éviter les timeouts
    delayBetweenBatches: 1000, // 1 seconde entre chaque lot
    maxRetries: 3, // Nombre de tentatives en cas d'échec
    confirmationRequired: true
};

/**
 * Initialise Firebase et retourne l'instance Firestore
 */
function initializeFirebase() {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        console.log('✅ Firebase Client SDK initialisé');
        console.log(`📊 Projet: ${firebaseConfig.projectId}`);
        return db;
    } catch (error) {
        console.error('❌ Erreur d\'initialisation Firebase:', error.message);
        throw error;
    }
}

/**
 * Compte le nombre total de documents
 */
async function countAllDocuments(db) {
    try {
        console.log('📊 Comptage des documents...');
        const snapshot = await getDocs(collection(db, CONFIG.collectionName));
        return snapshot.size;
    } catch (error) {
        console.error('❌ Erreur de comptage:', error.message);
        return 0;
    }
}

/**
 * Supprime un document avec gestion des erreurs
 */
async function deleteDocumentSafely(db, docId, docData, retryCount = 0) {
    try {
        await deleteDoc(doc(db, CONFIG.collectionName, docId));
        console.log(`✅ Supprimé: ${docId}`);
        console.log(`   📧 ${docData.email || 'Email non défini'}`);
        console.log(`   👤 ${docData.name || 'Nom non défini'}`);
        console.log(`   🏢 ${docData.role || 'Rôle non défini'}`);
        return { success: true, id: docId, data: docData };
    } catch (error) {
        if (retryCount < CONFIG.maxRetries) {
            console.log(`⚠️  Erreur sur ${docId}, tentative ${retryCount + 1}/${CONFIG.maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return deleteDocumentSafely(db, docId, docData, retryCount + 1);
        } else {
            console.error(`❌ Échec définitif pour ${docId}:`, error.message);
            return { success: false, id: docId, error: error.message };
        }
    }
}

/**
 * Traite un lot de documents
 */
async function processBatch(db, batchNumber) {
    console.log(`\n📦 LOT ${batchNumber}`);
    console.log('-'.repeat(40));

    try {
        // Récupération du lot
        const q = query(collection(db, CONFIG.collectionName), limit(CONFIG.batchSize));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('✅ Plus de documents à traiter');
            return { hasMore: false, processed: 0, errors: [] };
        }

        console.log(`📋 ${snapshot.size} document(s) à traiter dans ce lot`);

        // Suppression document par document
        const results = [];
        const errors = [];

        for (const docSnapshot of snapshot.docs) {
            const docData = docSnapshot.data();
            const result = await deleteDocumentSafely(db, docSnapshot.id, docData);

            if (result.success) {
                results.push(result);
            } else {
                errors.push(result);
            }

            // Petite pause entre chaque document
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`✅ Lot terminé: ${results.length} réussites, ${errors.length} échecs`);

        return {
            hasMore: snapshot.size === CONFIG.batchSize,
            processed: results.length,
            errors: errors
        };

    } catch (error) {
        console.error(`❌ Erreur sur le lot ${batchNumber}:`, error.message);
        return { hasMore: false, processed: 0, errors: [{ error: error.message }] };
    }
}

/**
 * Demande confirmation à l'utilisateur
 */
async function askConfirmation(totalCount) {
    if (!CONFIG.confirmationRequired) return true;

    // Note: Dans Node.js, utilisez readline. Ici version simplifiée.
    console.log(`\n❓ CONFIRMATION REQUISE`);
    console.log(`   ${totalCount} document(s) seront supprimés DÉFINITIVEMENT`);
    console.log(`   Cette action est IRRÉVERSIBLE`);
    console.log(`\n   Pour continuer, modifiez CONFIG.confirmationRequired = false`);
    console.log(`   ou implémentez readline pour une vraie confirmation interactive.`);

    // En production, implémentez une vraie confirmation
    return false; // Par sécurité, refuser par défaut
}

/**
 * Fonction principale de suppression complète
 */
async function deleteAllUsersComplete() {
    console.log('🧹 SUPPRESSION COMPLÈTE DE LA COLLECTION USERS');
    console.log('='.repeat(60));
    console.log(`📂 Collection: ${CONFIG.collectionName}`);
    console.log(`📊 Taille des lots: ${CONFIG.batchSize}`);
    console.log(`⏱️  Délai entre lots: ${CONFIG.delayBetweenBatches}ms`);
    console.log('⚠️  ATTENTION: Suppression DÉFINITIVE !');

    let db;
    let totalProcessed = 0;
    let totalErrors = 0;
    let batchNumber = 1;

    try {
        // Initialisation
        db = initializeFirebase();

        // Comptage initial
        const initialCount = await countAllDocuments(db);

        if (initialCount === 0) {
            console.log('\n✅ Collection déjà vide - Rien à supprimer');
            return;
        }

        console.log(`\n📋 ${initialCount} document(s) trouvé(s)`);

        // Demande de confirmation
        const confirmed = await askConfirmation(initialCount);
        if (!confirmed) {
            console.log('\n❌ Suppression annulée');
            return;
        }

        console.log('\n🚀 DÉBUT DE LA SUPPRESSION');
        console.log('='.repeat(40));

        // Traitement par lots
        while (true) {
            const result = await processBatch(db, batchNumber);

            totalProcessed += result.processed;
            totalErrors += result.errors.length;

            if (result.errors.length > 0) {
                console.log(`⚠️  Erreurs dans le lot ${batchNumber}:`);
                result.errors.forEach(err => {
                    console.log(`   - ${err.id || 'ID inconnu'}: ${err.error}`);
                });
            }

            console.log(`📊 Progression: ${totalProcessed} supprimés, ${totalErrors} erreurs`);

            if (!result.hasMore) {
                break;
            }

            batchNumber++;

            // Délai entre les lots
            if (CONFIG.delayBetweenBatches > 0) {
                console.log(`⏳ Pause de ${CONFIG.delayBetweenBatches}ms...`);
                await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenBatches));
            }
        }

        // Vérification finale
        console.log('\n🔍 VÉRIFICATION FINALE...');
        const finalCount = await countAllDocuments(db);

        console.log('\n📊 RÉSUMÉ FINAL');
        console.log('='.repeat(30));
        console.log(`📋 Documents au début: ${initialCount}`);
        console.log(`✅ Documents supprimés: ${totalProcessed}`);
        console.log(`❌ Erreurs rencontrées: ${totalErrors}`);
        console.log(`📋 Documents restants: ${finalCount}`);
        console.log(`🏆 Taux de réussite: ${Math.round((totalProcessed / initialCount) * 100)}%`);

        if (finalCount === 0) {
            console.log('\n🎉 SUPPRESSION COMPLÈTE RÉUSSIE !');
            console.log('🔥 Collection users maintenant vide');
        } else {
            console.log('\n⚠️  Suppression partielle');
            console.log('🔄 Relancez le script pour terminer');
        }

    } catch (error) {
        console.error('\n💥 ERREUR CRITIQUE:', error.message);
        console.error('📋 Détails:', error);

        if (db) {
            console.log('\n🔍 Vérification de l\'état après erreur...');
            try {
                const currentCount = await countAllDocuments(db);
                console.log(`📊 Documents restants: ${currentCount}`);
            } catch (checkError) {
                console.error('❌ Impossible de vérifier l\'état final');
            }
        }

        throw error;
    }
}

/**
 * Fonction d'exécution principale
 */
async function executeDeleteScript() {
    console.log('🚀 DÉMARRAGE DU SCRIPT');
    console.log(`⏰ ${new Date().toLocaleString('fr-FR')}`);
    console.log('');

    try {
        await deleteAllUsersComplete();
        console.log('\n✅ SCRIPT TERMINÉ AVEC SUCCÈS');
    } catch (error) {
        console.error('\n❌ ÉCHEC DU SCRIPT:', error.message);
        process.exit(1);
    }
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    executeDeleteScript();
}

export { deleteAllUsersComplete };
