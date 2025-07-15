import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

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

async function verifyUsers() {
    console.log('🔍 VÉRIFICATION DES UTILISATEURS CRÉÉS');
    console.log('='.repeat(60));

    try {
        // Initialisation Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Récupération des utilisateurs
        console.log('📊 Récupération des utilisateurs depuis Firestore...');
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('❌ Aucun utilisateur trouvé dans Firestore');
            return;
        }

        const users = [];
        snapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`\n✅ ${users.length} utilisateur(s) trouvé(s)\n`);

        // Affichage détaillé des utilisateurs
        console.log('📋 LISTE DES UTILISATEURS');
        console.log('='.repeat(50));

        const roleColors = {
            admin: '🔴',
            supplier: '🟢',
            customer: '🔵',
            influencer: '🟣'
        };

        const roleCounts = {
            admin: 0,
            supplier: 0,
            customer: 0,
            influencer: 0
        };

        users.forEach((user, index) => {
            const roleIcon = roleColors[user.role] || '⚪';
            roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;

            console.log(`\n${index + 1}. ${roleIcon} ${user.role.toUpperCase()}`);
            console.log(`   📧 Email: ${user.email}`);
            console.log(`   👤 Nom: ${user.name}`);
            console.log(`   🏢 Entreprise: ${user.company || 'Non spécifiée'}`);
            console.log(`   🆔 UID: ${user.uid || user.id}`);
            console.log(`   📅 Créé: ${user.createdAt ? new Date(user.createdAt).toLocaleString('fr-FR') : 'Non spécifié'}`);
            console.log(`   🔓 Actif: ${user.isActive ? '✅ Oui' : '❌ Non'}`);
            console.log(`   💳 Abonnement: ${user.subscription || 'Non spécifié'}`);
        });

        // Résumé par rôle
        console.log('\n📊 RÉSUMÉ PAR RÔLE');
        console.log('='.repeat(30));
        Object.entries(roleCounts).forEach(([role, count]) => {
            const icon = roleColors[role] || '⚪';
            console.log(`${icon} ${role.toUpperCase()}: ${count} utilisateur(s)`);
        });

        // Vérification des données requises
        console.log('\n🔍 VÉRIFICATION DES DONNÉES');
        console.log('='.repeat(35));

        let allValid = true;
        users.forEach((user, index) => {
            const requiredFields = ['email', 'role', 'name', 'uid'];
            const missingFields = requiredFields.filter(field => !user[field]);

            if (missingFields.length > 0) {
                console.log(`❌ Utilisateur ${index + 1} (${user.email}): Champs manquants: ${missingFields.join(', ')}`);
                allValid = false;
            }
        });

        if (allValid) {
            console.log('✅ Toutes les données sont valides');
        }

        // Informations de connexion
        console.log('\n🔐 INFORMATIONS DE CONNEXION');
        console.log('='.repeat(40));

        const credentials = {
            admin: 'Admin2024!Secure',
            supplier: 'Supplier2024!Secure',
            customer: 'Client2024!Secure',
            influencer: 'Influencer2024!Secure'
        };

        users.forEach(user => {
            const password = credentials[user.role] || 'Mot de passe non trouvé';
            console.log(`${roleColors[user.role]} ${user.role.toUpperCase()}: ${user.email} | ${password}`);
        });

        // Recommandations
        console.log('\n💡 RECOMMANDATIONS');
        console.log('='.repeat(25));

        if (roleCounts.admin === 0) {
            console.log('⚠️ Aucun administrateur trouvé - Créez un compte admin');
        }

        if (users.length < 4) {
            console.log('⚠️ Moins de 4 utilisateurs - Il manque certains rôles');
        }

        console.log('✅ Testez la connexion avec chaque compte');
        console.log('✅ Vérifiez les redirections selon le rôle');
        console.log('✅ Changez les mots de passe par défaut en production');

        console.log('\n🎉 Vérification terminée avec succès !');

    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error.message);
        console.error('\n🔧 Actions suggérées:');
        console.error('1. Vérifiez votre connexion Firebase');
        console.error('2. Assurez-vous que les règles Firestore permettent la lecture');
        console.error('3. Exécutez: npm run firebase:check');
    }
}

// Exécution
verifyUsers()
    .then(() => {
        console.log('\n👋 Vérification terminée');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Erreur fatale:', error.message);
        process.exit(1);
    });
