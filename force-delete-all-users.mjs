import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, limit, startAfter, orderBy } from 'firebase/firestore';

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

async function forceDeleteAllUsers() {
    console.log('🔥 SUPPRESSION FORCÉE DE TOUS LES DOCUMENTS USERS');
    console.log('='.repeat(70));
    console.log('⚠️  MODE AGRESSIF - Suppression par pagination complète');
    console.log('🔍 Récupération de TOUS les documents, même cachés');

    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        let totalDeleted = 0;
        let totalErrors = 0;
        let pageNumber = 1;
        let lastDoc = null;

        // Méthode 1: Suppression par pagination pour capturer TOUS les documents
        console.log('\n📋 MÉTHODE 1: Suppression par pagination');
        console.log('-'.repeat(50));

        while (true) {
            console.log(`\n📄 Page ${pageNumber}: Récupération par lots de 25...`);

            try {
                // Construire la requête avec pagination
                let q;
                if (lastDoc) {
                    q = query(
                        collection(db, 'users'),
                        orderBy('__name__'),
                        startAfter(lastDoc),
                        limit(25)
                    );
                } else {
                    q = query(
                        collection(db, 'users'),
                        orderBy('__name__'),
                        limit(25)
                    );
                }

                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    console.log('✅ Plus de documents trouvés avec cette méthode');
                    break;
                }

                console.log(`📋 ${snapshot.size} document(s) trouvé(s) sur cette page`);

                // Supprimer chaque document
                for (const docSnapshot of snapshot.docs) {
                    try {
                        const docData = docSnapshot.data();
                        console.log(`🗑️  Suppression: ${docSnapshot.id}`);
                        console.log(`   📧 Email: ${docData.email || 'non défini'}`);
                        console.log(`   👤 Nom: ${docData.name || 'non défini'}`);

                        await deleteDoc(doc(db, 'users', docSnapshot.id));
                        totalDeleted++;
                        console.log(`   ✅ Supprimé avec succès`);

                        // Pause entre suppressions
                        await new Promise(resolve => setTimeout(resolve, 100));

                    } catch (deleteError) {
                        console.error(`   ❌ Erreur suppression ${docSnapshot.id}:`, deleteError.message);
                        totalErrors++;
                    }
                }

                // Mémoriser le dernier document pour la pagination
                lastDoc = snapshot.docs[snapshot.docs.length - 1];
                pageNumber++;

                // Pause entre les pages
                console.log(`⏳ Pause 1 seconde avant page suivante...`);
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (pageError) {
                console.error(`❌ Erreur sur la page ${pageNumber}:`, pageError.message);
                break;
            }
        }

        // Méthode 2: Suppression directe sans ordre pour capturer les documents restants
        console.log('\n📋 MÉTHODE 2: Suppression directe sans tri');
        console.log('-'.repeat(50));

        let round = 1;
        while (round <= 5) { // Maximum 5 tours
            console.log(`\n🔄 Tour ${round}: Récupération directe...`);

            try {
                const directSnapshot = await getDocs(collection(db, 'users'));

                if (directSnapshot.empty) {
                    console.log('✅ Collection maintenant vide');
                    break;
                }

                console.log(`📋 ${directSnapshot.size} document(s) trouvé(s) en suppression directe`);

                for (const docSnapshot of directSnapshot.docs) {
                    try {
                        const docData = docSnapshot.data();
                        console.log(`🗑️  Suppression directe: ${docSnapshot.id} (${docData.email || 'non défini'})`);

                        await deleteDoc(doc(db, 'users', docSnapshot.id));
                        totalDeleted++;

                        await new Promise(resolve => setTimeout(resolve, 50));

                    } catch (deleteError) {
                        console.error(`❌ Erreur suppression directe ${docSnapshot.id}:`, deleteError.message);
                        totalErrors++;
                    }
                }

                round++;

                if (round <= 5) {
                    console.log(`⏳ Pause 2 secondes avant tour suivant...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

            } catch (roundError) {
                console.error(`❌ Erreur tour ${round}:`, roundError.message);
                round++;
            }
        }

        // Vérification finale agressive
        console.log('\n🔍 VÉRIFICATION FINALE MULTIPLE');
        console.log('-'.repeat(50));

        // Vérification 1: getDocs simple
        let finalCheck1;
        try {
            finalCheck1 = await getDocs(collection(db, 'users'));
            console.log(`📊 Vérification 1 (getDocs): ${finalCheck1.size} document(s)`);
        } catch (error) {
            console.error('❌ Erreur vérification 1:', error.message);
        }

        // Vérification 2: query avec orderBy
        let finalCheck2;
        try {
            const qCheck = query(collection(db, 'users'), orderBy('__name__'), limit(100));
            finalCheck2 = await getDocs(qCheck);
            console.log(`📊 Vérification 2 (query): ${finalCheck2.size} document(s)`);
        } catch (error) {
            console.error('❌ Erreur vérification 2:', error.message);
        }

        // Résumé final
        console.log('\n🎯 RÉSUMÉ FINAL DE LA SUPPRESSION FORCÉE');
        console.log('='.repeat(60));
        console.log(`✅ Total supprimé: ${totalDeleted} document(s)`);
        console.log(`❌ Erreurs: ${totalErrors}`);
        console.log(`📄 Pages traitées: ${pageNumber - 1}`);
        console.log(`🔄 Tours directs: ${round - 1}`);

        const finalCount = finalCheck1 ? finalCheck1.size : (finalCheck2 ? finalCheck2.size : 'inconnu');
        console.log(`📋 Documents restants: ${finalCount}`);

        if (finalCount === 0) {
            console.log('\n🎉 SUPPRESSION FORCÉE RÉUSSIE !');
            console.log('🔥 Collection users complètement vidée');
        } else {
            console.log('\n⚠️  Suppression partielle');
            console.log('🔄 Vous pouvez relancer le script ou utiliser la console Firebase');
        }

        // Afficher quelques IDs des documents restants si possible
        if (finalCheck1 && !finalCheck1.empty) {
            console.log('\n📋 Exemples de documents restants:');
            finalCheck1.docs.slice(0, 5).forEach(doc => {
                const data = doc.data();
                console.log(`   - ${doc.id}: ${data.email || data.name || 'non défini'}`);
            });
        }

    } catch (error) {
        console.error('\n💥 ERREUR CRITIQUE:', error.message);
        console.error('📋 Stack:', error.stack);
    }
}

forceDeleteAllUsers();
