import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, limit } from 'firebase/firestore';

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

async function deleteAllUsersRecursive() {
    console.log('🧹 SUPPRESSION RÉCURSIVE DE TOUS LES DOCUMENTS USERS');
    console.log('='.repeat(70));
    console.log('⚠️  Cette méthode supprime les documents par petits lots pour éviter les timeouts');

    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const usersCollection = collection(db, 'users');

        let totalDeleted = 0;
        let batchNumber = 1;

        while (true) {
            // Récupérer un petit lot de documents (100 max)
            console.log(`\n📊 Batch ${batchNumber}: Récupération de documents...`);
            const q = query(usersCollection, limit(100));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                console.log('✅ Plus aucun document trouvé - Collection complètement vidée');
                break;
            }

            console.log(`📋 ${snapshot.size} document(s) trouvé(s) dans ce batch`);

            // Supprimer chaque document individuellement
            const promises = [];
            snapshot.forEach((document) => {
                const docData = document.data();
                console.log(`🗑️  Suppression: ${document.id} (${docData.email || docData.name || 'non défini'})`);
                promises.push(deleteDoc(doc(db, 'users', document.id)));
            });

            // Attendre que toutes les suppressions de ce batch soient terminées
            await Promise.all(promises);
            totalDeleted += snapshot.size;

            console.log(`✅ Batch ${batchNumber} terminé - ${snapshot.size} documents supprimés`);
            console.log(`📊 Total supprimé jusqu'ici: ${totalDeleted}`);

            batchNumber++;

            // Petite pause pour éviter de surcharger Firebase
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Vérification finale
        console.log('\n🔍 VÉRIFICATION FINALE...');
        const finalCheck = await getDocs(usersCollection);

        if (finalCheck.empty) {
            console.log('✅ SUPPRESSION COMPLÈTE RÉUSSIE');
            console.log(`🎯 ${totalDeleted} document(s) supprimé(s) au total`);
            console.log('🔥 Collection users maintenant complètement vide');
        } else {
            console.log(`⚠️  ${finalCheck.size} document(s) encore présent(s)`);
            console.log('🔄 Vous pouvez relancer le script pour terminer le nettoyage');
        }

        console.log('\n🎉 NETTOYAGE RÉCURSIF TERMINÉ');

    } catch (error) {
        console.error('❌ Erreur lors de la suppression récursive:', error);
        process.exit(1);
    }
}

deleteAllUsersRecursive();
