/**
 * Script d'urgence pour créer un compte admin
 * À exécuter dans la console du navigateur sur http://localhost:5174
 */

(async function createEmergencyAdmin() {
    console.log('🚨 Script d\'urgence pour créer un compte admin');

    try {
        // Attendre que Firebase soit chargé
        let retries = 0;
        while ((!window.firebase || !window.AdminCreationService) && retries < 10) {
            console.log('⏳ Attente du chargement des services Firebase...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            retries++;
        }

        if (!window.AdminCreationService) {
            console.error('❌ AdminCreationService non disponible');
            console.log('💡 Essayez de recharger la page et relancer le script');
            return;
        }

        console.log('✅ Services Firebase détectés, création du compte...');

        // Données du compte admin d'urgence
        const adminData = {
            email: 'admin@chinetonusine.com',
            password: 'admin123456',
            name: 'Administrateur Principal'
        };

        console.log('📧 Création du compte:', adminData.email);

        const result = await window.AdminCreationService.createNewAdminAccount(adminData);

        if (result.success) {
            console.log('🎉 SUCCÈS ! Compte admin créé !');
            console.log('=====================================');
            console.log('📧 Email: admin@chinetonusine.com');
            console.log('🔑 Mot de passe: admin123456');
            console.log('🆔 UID:', result.uid);
            console.log('=====================================');
            console.log('');
            console.log('🔗 Étapes suivantes :');
            console.log('1. Allez sur: http://localhost:5174/login');
            console.log('2. Connectez-vous avec ces identifiants');
            console.log('3. Vous serez redirigé vers /admin/dashboard');
            console.log('');

            // Tenter une connexion automatique
            console.log('🔄 Tentative de connexion automatique...');
            if (window.firebase?.auth) {
                try {
                    await window.firebase.auth().signInWithEmailAndPassword(
                        adminData.email,
                        adminData.password
                    );
                    console.log('✅ Connexion automatique réussie !');
                    console.log('🔄 Rechargement de la page...');
                    setTimeout(() => window.location.reload(), 2000);
                } catch (authError) {
                    console.log('⚠️ Connexion automatique échouée, connectez-vous manuellement');
                }
            }

        } else {
            console.error('❌ Erreur lors de la création:', result.message);

            if (result.message.includes('email-already-in-use')) {
                console.log('💡 Le compte existe déjà ! Essayez de vous connecter avec :');
                console.log('📧 Email: admin@chinetonusine.com');
                console.log('🔑 Mot de passe: admin123456');
            }
        }

    } catch (error) {
        console.error('💥 Erreur critique:', error);
        console.log('');
        console.log('🔧 Solutions alternatives :');
        console.log('1. Rechargez la page et réessayez');
        console.log('2. Utilisez l\'interface /admin/users');
        console.log('3. Vérifiez la console pour d\'autres erreurs');
    }
})();

console.log(`
🚨 === SCRIPT D'URGENCE ADMIN ===

Ce script va automatiquement :
1. Détecter les services Firebase
2. Créer un compte admin@chinetonusine.com
3. Tenter une connexion automatique

⏳ Le script s'exécute automatiquement...
`);
