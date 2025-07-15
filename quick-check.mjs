import admin from 'firebase-admin';

// Simple script pour vérifier l'état des utilisateurs sans service account
async function quickCheck() {
    try {
        console.log('🔍 Vérification rapide des utilisateurs...\n');

        // Essayer d'initialiser avec les variables d'environnement
        if (admin.apps.length === 0) {
            // Configuration basique pour test
            const serviceAccount = {
                type: "service_account",
                project_id: "chine-ton-usine"
            };

            admin.initializeApp({
                projectId: 'chine-ton-usine'
            });
        }

        const auth = admin.auth();

        // Lister les utilisateurs
        const listUsers = await auth.listUsers();

        console.log(`📊 Nombre d'utilisateurs trouvés: ${listUsers.users.length}\n`);

        if (listUsers.users.length === 0) {
            console.log('✅ Aucun utilisateur existant - prêt pour la création');
        } else {
            console.log('👥 Utilisateurs existants:');
            listUsers.users.forEach(user => {
                console.log(`  📧 ${user.email} - UID: ${user.uid}`);
            });
        }

    } catch (error) {
        console.log('⚠️  Impossible de vérifier sans configuration Firebase Admin');
        console.log('💡 Ceci est normal si le service account n\'est pas configuré');
        console.log('🚀 Vous pouvez procéder à l\'exécution du script principal\n');
    }
}

quickCheck();
