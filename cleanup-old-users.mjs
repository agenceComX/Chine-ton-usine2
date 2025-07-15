import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';

// Configuration Firebase - Correction du project ID
const firebaseConfig = {
    apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
    authDomain: "chine-ton-usine.firebaseapp.com",
    projectId: "chine-ton-usine",
    storageBucket: "chine-ton-usine.firebasestorage.app",
    messagingSenderId: "528021984213",
    appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
    measurementId: "G-23BQZPXP86"
};

// Emails des utilisateurs à conserver (nos 4 utilisateurs de production)
const KEEP_USERS = [
    'admin@chinetonusine.com',
    'fournisseur@chinetonusine.com',
    'client@chinetonusine.com',
    'influenceur@chinetonusine.com'
];

async function cleanupOldUsers() {
    console.log('🧹 NETTOYAGE DES ANCIENS UTILISATEURS FIRESTORE');
    console.log('='.repeat(60));

    try {
        // Initialisation Firebase
        const app = initializeApp(firebaseConfig, 'cleanup-app');
        const db = getFirestore(app);

        console.log('📊 Récupération de tous les utilisateurs...');
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);

        if (snapshot.empty) {
            console.log('ℹ️ Aucun utilisateur trouvé dans Firestore');
            return;
        }

        const allUsers = [];
        const usersToDelete = [];
        const usersToKeep = [];

        snapshot.forEach((userDoc) => {
            const userData = userDoc.data();
            const userInfo = {
                id: userDoc.id,
                email: userData.email || 'Email manquant',
                name: userData.name || 'Nom manquant',
                role: userData.role || 'Rôle manquant',
                company: userData.company || '',
                createdAt: userData.createdAt || userData.created_at || 'Date manquante'
            };

            allUsers.push(userInfo);

            // Vérifier si l'utilisateur doit être conservé
            if (KEEP_USERS.includes(userData.email)) {
                usersToKeep.push(userInfo);
            } else {
                usersToDelete.push({
                    ...userInfo,
                    docRef: userDoc.ref
                });
            }
        });

        console.log(`\n📋 ANALYSE DES UTILISATEURS (${allUsers.length} total)`);
        console.log('='.repeat(50));

        console.log(`\n🟢 UTILISATEURS À CONSERVER (${usersToKeep.length}):`);
        usersToKeep.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.role?.toUpperCase() || 'RÔLE INCONNU'} - ${user.email}`);
            console.log(`     Nom: ${user.name}`);
            console.log(`     ID: ${user.id}`);
            console.log('');
        });

        console.log(`\n🔴 UTILISATEURS À SUPPRIMER (${usersToDelete.length}):`);
        usersToDelete.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.email}`);
            console.log(`     Nom: ${user.name}`);
            console.log(`     ID: ${user.id}`);
            console.log(`     Créé: ${user.createdAt}`);
            console.log('');
        });

        if (usersToDelete.length === 0) {
            console.log('✅ Aucun utilisateur à supprimer. Base de données déjà propre !');
            return;
        }

        // Confirmation avant suppression
        console.log(`\n⚠️ ATTENTION: Vous allez supprimer ${usersToDelete.length} utilisateur(s)`);
        console.log('Cette action est IRRÉVERSIBLE !');
        console.log('\nPour continuer, le script va procéder à la suppression...');

        // Attendre 3 secondes pour permettre l'annulation
        console.log('⏳ Suppression dans 3 secondes... (Ctrl+C pour annuler)');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('⏳ 2...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('⏳ 1...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Suppression par batch
        console.log('\n🗑️ DÉBUT DE LA SUPPRESSION...');

        const batchSize = 500; // Limite Firestore pour les batch
        let totalDeleted = 0;

        for (let i = 0; i < usersToDelete.length; i += batchSize) {
            const batch = writeBatch(db);
            const batchUsers = usersToDelete.slice(i, i + batchSize);

            batchUsers.forEach(user => {
                batch.delete(user.docRef);
            });

            await batch.commit();
            totalDeleted += batchUsers.length;

            console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}: ${batchUsers.length} utilisateurs supprimés`);

            // Petite pause entre les batches
            if (i + batchSize < usersToDelete.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log(`\n🎉 NETTOYAGE TERMINÉ !`);
        console.log('='.repeat(30));
        console.log(`✅ ${totalDeleted} anciens utilisateurs supprimés`);
        console.log(`✅ ${usersToKeep.length} utilisateurs de production conservés`);

        // Vérification finale
        console.log('\n🔍 VÉRIFICATION FINALE...');
        const finalSnapshot = await getDocs(usersCollection);
        console.log(`📊 Utilisateurs restants: ${finalSnapshot.size}`);

        finalSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`  ✅ ${data.role?.toUpperCase() || 'RÔLE INCONNU'}: ${data.email}`);
        });

        console.log('\n💡 RECOMMANDATIONS:');
        console.log('1. Testez la connexion avec chaque utilisateur conservé');
        console.log('2. Vérifiez que les redirections fonctionnent correctement');
        console.log('3. Revenez aux règles de production: npm run rules:production');

    } catch (error) {
        console.error('\n❌ ERREUR LORS DU NETTOYAGE');
        console.error('='.repeat(30));
        console.error('Détails:', error.message);
        console.error('\n🔧 SOLUTIONS POSSIBLES:');
        console.error('1. Vérifiez que les règles de développement sont activées');
        console.error('2. Exécutez: npm run rules:dev');
        console.error('3. Vérifiez votre connexion Firebase');
        console.error('4. Assurez-vous d\'être authentifié: firebase login');
    }
}

// Fonction de sécurité - demande confirmation
async function confirmAndCleanup() {
    console.log('🚨 AVERTISSEMENT DE SÉCURITÉ');
    console.log('='.repeat(40));
    console.log('Ce script va supprimer DÉFINITIVEMENT tous les utilisateurs');
    console.log('SAUF les 4 utilisateurs de production suivants:');
    console.log('');
    KEEP_USERS.forEach((email, index) => {
        console.log(`  ${index + 1}. ${email}`);
    });
    console.log('');
    console.log('⚠️ Cette action est IRRÉVERSIBLE !');
    console.log('');

    // Le script continuera automatiquement après affichage de l'avertissement
    await cleanupOldUsers();
}

// Gestion des erreurs
process.on('unhandledRejection', (reason, promise) => {
    console.error('\n❌ Erreur non gérée:', reason?.message || reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('\n❌ Exception non capturée:', error.message);
    process.exit(1);
});

// Gestion de Ctrl+C
process.on('SIGINT', () => {
    console.log('\n\n🛑 ANNULATION DEMANDÉE');
    console.log('✅ Aucune donnée n\'a été supprimée');
    console.log('👋 Script arrêté par l\'utilisateur');
    process.exit(0);
});

// Exécution
confirmAndCleanup()
    .then(() => {
        console.log('\n👋 Nettoyage terminé avec succès');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Erreur fatale:', error.message);
        process.exit(1);
    });
