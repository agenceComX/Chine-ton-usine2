/**
 * Test direct Firebase - Script minimal pour résoudre auth/invalid-credential
 * À coller dans la console du navigateur sur http://localhost:5174
 */

console.log('🔥 Test direct Firebase - Résolution auth/invalid-credential');

// Script auto-exécutable
(async function directFirebaseTest() {
    console.log('🚀 Démarrage du test direct...');

    try {
        // Étape 1: Attendre le chargement
        console.log('⏳ Attente du chargement des services...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Étape 2: Vérifier la disponibilité des services
        if (!window.AdminCreationService) {
            console.log('❌ AdminCreationService non disponible');
            console.log('🔄 Rechargement de la page recommandé');

            // Proposer un rechargement
            if (confirm('Services non chargés. Voulez-vous recharger la page ?')) {
                window.location.reload();
            }
            return;
        }

        console.log('✅ Services détectés, création du compte...');

        // Étape 3: Créer le compte admin
        const result = await window.AdminCreationService.createDefaultAdminAccount();

        if (result.success && result.credentials) {
            // Succès
            console.log('🎉 SUCCÈS ! Compte créé');
            console.log('');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔑 IDENTIFIANTS DE CONNEXION');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📧 Email:', result.credentials.email);
            console.log('🔒 Mot de passe:', result.credentials.password);
            console.log('🆔 UID:', result.uid || 'N/A');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');

            // Notification utilisateur
            const message = `✅ Compte admin créé avec succès !

📧 Email: ${result.credentials.email}
🔒 Mot de passe: ${result.credentials.password}

🔗 Cliquez OK pour aller à la page de connexion.`;

            alert(message);

            // Redirection automatique
            window.location.href = '/login';

        } else {
            // Erreur ou compte existant
            console.log('⚠️ Résultat:', result);

            if (result.message && result.message.includes('already')) {
                // Compte existe déjà
                console.log('ℹ️ Le compte admin existe déjà !');

                const existingMessage = `ℹ️ Le compte admin existe déjà !

📧 Email: admin@chinetonusine.com
🔒 Mot de passe: admin123456

🔗 Essayez de vous connecter avec ces identifiants.`;

                alert(existingMessage);
                window.location.href = '/login';

            } else {
                // Autre erreur
                console.error('❌ Erreur:', result.message);
                alert('❌ Erreur: ' + result.message);
            }
        }

    } catch (error) {
        console.error('💥 Erreur critique:', error);

        const errorMessage = `💥 Erreur critique: ${error.message}

🔧 Solutions possibles:
1. Rechargez la page (F5)
2. Videz le cache du navigateur
3. Utilisez un autre navigateur
4. Vérifiez la connexion internet`;

        alert(errorMessage);
    }
})();

console.log(`
🎯 === INFORMATIONS IMPORTANTES ===

Ce script va automatiquement :
1. ⏳ Attendre le chargement des services
2. 🔧 Créer le compte admin@chinetonusine.com
3. 🔗 Vous rediriger vers /login

Si ça ne marche pas :
- Rechargez la page (F5)
- Réexécutez ce script
- Ou utilisez l'interface /admin/users

⚡ Le script se lance automatiquement !
`);
