import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
    authDomain: "chine-ton-usine.firebaseapp.com",
    projectId: "chine-ton-usine",
    storageBucket: "chine-ton-usine.firebasestorage.app",
    messagingSenderId: "528021984213",
    appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
    measurementId: "G-23BQZPXP86"
};

async function deleteAllUsers() {
    console.log('🧹 SUPPRESSION COMPLÈTE DE TOUS LES UTILISATEURS');
    console.log('='.repeat(60));
    console.log('⚠️  ATTENTION: Cette opération supprime TOUS les documents de la collection users');
    console.log('📊 Méthode: Suppression par lots optimisée');
    console.log('🔄 Gestion des erreurs: Activée');

    let totalDeleted = 0;
    let totalErrors = 0;
    let retryCount = 0;
    const maxRetries = 3;

    try {
        // Initialisation Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Boucle de suppression avec retry automatique
        while (retryCount <= maxRetries) {
            console.log(`\n🔄 Tentative ${retryCount + 1}/${maxRetries + 1}`);

            // Récupération de TOUS les documents de la collection users
            console.log('📊 Récupération de tous les documents users...');
            const usersCollection = collection(db, 'users');
            const snapshot = await getDocs(usersCollection);

            if (snapshot.empty) {
                console.log('✅ La collection users est maintenant vide');
                break;
            }

            console.log(`📋 ${snapshot.size} document(s) trouvé(s) à supprimer`);

            // Suppression individuelle avec gestion d'erreur par document
            let batchSuccess = 0;
            let batchErrors = 0;

            for (const document of snapshot.docs) {
                try {
                    const docData = document.data();
                    console.log(`🗑️  Suppression: ${document.id} (${docData.email || 'email non défini'})`);

                    await deleteDoc(doc(db, 'users', document.id));
                    batchSuccess++;
                    totalDeleted++;

                    // Petite pause pour éviter la surcharge
                    await new Promise(resolve => setTimeout(resolve, 50));

                } catch (docError) {
                    console.error(`❌ Erreur pour ${document.id}:`, docError.message);
                    batchErrors++;
                    totalErrors++;
                }
            }

            console.log(`✅ Résultats de cette tentative: ${batchSuccess} succès, ${batchErrors} erreurs`);

            // Si tous les documents ont été traités avec succès, sortir de la boucle
            if (batchErrors === 0) {
                break;
            }

            retryCount++;

            // Pause avant retry
            if (retryCount <= maxRetries) {
                console.log(`⏳ Pause de 2 secondes avant nouvelle tentative...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // Vérification finale
        console.log('\n🔍 Vérification finale de la suppression...');
        const finalSnapshot = await getDocs(collection(db, 'users'));

        if (finalSnapshot.empty) {
            console.log('✅ SUPPRESSION COMPLÈTE RÉUSSIE - Collection users complètement vidée');
        } else {
            console.log(`⚠️  ${finalSnapshot.size} document(s) n'ont pas pu être supprimés`);
            console.log('🔄 Vous pouvez relancer le script pour terminer le nettoyage');
        }

        // Résumé final
        console.log('\n📊 RÉSUMÉ FINAL');
        console.log('='.repeat(40));
        console.log(`✅ Documents supprimés: ${totalDeleted}`);
        console.log(`❌ Erreurs rencontrées: ${totalErrors}`);
        console.log(`🔄 Tentatives utilisées: ${retryCount}/${maxRetries + 1}`);
        console.log(`📋 Documents restants: ${finalSnapshot.size}`);

        console.log('\n🎉 NETTOYAGE COMPLET TERMINÉ');
        console.log('💡 Prochaine étape: Recréer les 4 utilisateurs de production');

    } catch (error) {
        console.error('❌ Erreur critique lors de la suppression:', error);
        console.error('📋 Stack trace:', error.stack);

        // Tentative de vérification de l'état même en cas d'erreur
        try {
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
            const checkSnapshot = await getDocs(collection(db, 'users'));
            console.log(`📊 État actuel: ${checkSnapshot.size} document(s) restant(s)`);
        } catch (checkError) {
            console.error('❌ Impossible de vérifier l\'état final');
        }

        process.exit(1);
    }
}

deleteAllUsers();
