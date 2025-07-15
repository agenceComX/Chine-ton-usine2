import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Configuration Firebase Admin
// Vous devez avoir votre fichier de clé de service JSON
// Téléchargez-le depuis la console Firebase > Paramètres du projet > Comptes de service
const serviceAccount = {
    "type": "service_account",
    "project_id": "chine-ton-usine",
    "private_key_id": "", // À remplir
    "private_key": "", // À remplir
    "client_email": "", // À remplir
    "client_id": "", // À remplir
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "" // À remplir
};

// Mapping des rôles basé sur les emails
const roleMapping = {
    'admin@chinetonusine.com': {
        role: 'admin',
        name: 'Administrateur Principal',
        company: 'ChineTonUsine'
    },
    'fournisseur@chinetonusine.com': {
        role: 'supplier',
        name: 'Fournisseur Demo',
        company: 'Supplier Corp'
    },
    'client@chinetonusine.com': {
        role: 'customer',
        name: 'Client Demo',
        company: 'Client Corp'
    },
    'influenceur@chinetonusine.com': {
        role: 'influencer',
        name: 'Influenceur Demo',
        company: 'Influence Agency'
    }
};

async function syncUsersWithAdmin() {
    console.log('🔄 SYNCHRONISATION AVEC FIREBASE ADMIN');
    console.log('='.repeat(60));

    try {
        // Initialisation Firebase Admin
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: 'chine-ton-usine'
            });
        }

        const auth = admin.auth();
        const db = admin.firestore();

        // Récupération de tous les utilisateurs
        console.log('📊 Récupération des utilisateurs depuis Firebase Auth...');
        const listUsersResult = await auth.listUsers();
        const users = listUsersResult.users;

        console.log(`✅ ${users.length} utilisateur(s) trouvé(s) dans Auth`);

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const user of users) {
            const email = user.email;
            const uid = user.uid;

            console.log(`\n🔄 Traitement: ${email} (${uid})`);

            // Vérification si l'utilisateur est dans notre mapping
            const userData = roleMapping[email];
            if (!userData) {
                console.log(`⚠️  Email non reconnu, ignoré: ${email}`);
                continue;
            }

            try {
                // Vérification si le document existe déjà
                const userDoc = await db.collection('users').doc(uid).get();

                if (userDoc.exists) {
                    console.log(`📄 Document Firestore déjà existant pour ${email}`);
                    continue;
                }

                // Création du document Firestore
                const firestoreData = {
                    email: email,
                    role: userData.role,
                    name: userData.name,
                    company: userData.company,
                    isActive: true,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    lastLoginAt: null,
                    settings: {
                        notifications: true,
                        language: 'fr',
                        theme: 'light'
                    }
                };

                await db.collection('users').doc(uid).set(firestoreData);
                console.log(`✅ Document Firestore créé pour ${email}`);
                successCount++;

            } catch (error) {
                console.error(`❌ Erreur pour ${email}:`, error.message);
                errors.push(`${email}: ${error.message}`);
                errorCount++;
            }
        }

        // Résumé final
        console.log('\n' + '='.repeat(60));
        console.log('🎉 SYNCHRONISATION TERMINÉE');
        console.log('='.repeat(30));
        console.log(`✅ Succès: ${successCount}`);
        console.log(`❌ Échecs: ${errorCount}`);

        if (errors.length > 0) {
            console.log('\n❌ Détails des erreurs:');
            errors.forEach(error => console.log(`   - ${error}`));
        }

        console.log('\n💡 PROCHAINES ÉTAPES:');
        console.log('1. Vérifiez les utilisateurs: npm run users:verify');
        console.log('2. Revenez aux règles de production: npm run rules:production');
        console.log('3. Testez votre application web');

    } catch (error) {
        console.error('💥 Erreur critique:', error);
        process.exit(1);
    }
}

syncUsersWithAdmin();
