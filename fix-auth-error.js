/**
 * Script de dépannage immédiat pour l'erreur auth/invalid-credential
 * À exécuter dans la console du navigateur
 */

console.log('🔧 === DÉPANNAGE ERREUR AUTH/INVALID-CREDENTIAL ===');

// Fonction de diagnostic et correction
async function fixAuthError() {
    console.log('1️⃣ Diagnostic de l\'erreur...');

    // Vérifier l'état de Firebase
    try {
        // Importer les modules Firebase depuis l'application
        const { auth, db } = await import('./src/lib/firebaseClient.js');
        console.log('✅ Modules Firebase importés');

        // Vérifier l'utilisateur actuel
        console.log('👤 Utilisateur actuel:', auth.currentUser?.email || 'Aucun');

        // Si aucun utilisateur, tenter la création
        if (!auth.currentUser) {
            console.log('2️⃣ Aucun utilisateur connecté, création du compte admin...');

            // Utiliser le service de création d'admin
            if (window.AdminCreationService) {
                console.log('🔧 Utilisation du service de création...');

                const result = await window.AdminCreationService.createNewAdminAccount({
                    email: 'admin@chinetonusine.com',
                    password: 'admin123456',
                    name: 'Administrateur Principal'
                });

                if (result.success) {
                    console.log('✅ Compte admin créé avec succès !');
                    console.log('🆔 UID:', result.uid);

                    // Tenter la connexion automatique
                    console.log('3️⃣ Tentative de connexion automatique...');

                    try {
                        const { signInWithEmailAndPassword } = await import('firebase/auth');
                        const userCredential = await signInWithEmailAndPassword(
                            auth,
                            'admin@chinetonusine.com',
                            'admin123456'
                        );

                        console.log('✅ Connexion réussie !');
                        console.log('👤 Utilisateur connecté:', userCredential.user.email);

                        // Rediriger vers l'admin
                        console.log('🔄 Redirection vers l\'admin...');
                        window.location.href = '/admin/dashboard';

                    } catch (loginError) {
                        console.error('❌ Erreur de connexion:', loginError);
                        console.log('🔗 Connectez-vous manuellement sur /login');
                    }

                } else {
                    console.error('❌ Erreur de création:', result.message);

                    // Si le compte existe déjà, tenter la connexion
                    if (result.message.includes('already') || result.message.includes('email-already-in-use')) {
                        console.log('💡 Le compte existe déjà, tentative de connexion...');

                        try {
                            const { signInWithEmailAndPassword } = await import('firebase/auth');
                            const userCredential = await signInWithEmailAndPassword(
                                auth,
                                'admin@chinetonusine.com',
                                'admin123456'
                            );

                            console.log('✅ Connexion avec compte existant réussie !');
                            window.location.href = '/admin/dashboard';

                        } catch (existingLoginError) {
                            console.error('❌ Erreur avec compte existant:', existingLoginError);
                            console.log('🔧 Solutions possibles :');
                            console.log('1. Le mot de passe par défaut a été changé');
                            console.log('2. Utilisez la réinitialisation de mot de passe');
                            console.log('3. Créez un nouveau compte avec un autre email');
                        }
                    }
                }

            } else {
                console.error('❌ AdminCreationService non disponible');
                console.log('🔄 Rechargez la page et réessayez');
            }
        } else {
            console.log('ℹ️ Utilisateur déjà connecté, vérification du rôle...');
            // Vérifier si l'utilisateur est admin
            // Implementation de vérification du rôle...
        }

    } catch (importError) {
        console.error('❌ Erreur d\'import Firebase:', importError);
        console.log('🔄 Rechargez la page et réessayez');
    }
}

// Fonction de création simple
async function createAdminSimple() {
    console.log('🚀 Création simple du compte admin...');

    if (!window.AdminCreationService) {
        console.log('⚠️ Service non disponible, attente...');
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    if (window.AdminCreationService) {
        try {
            const result = await window.AdminCreationService.createDefaultAdminAccount();

            if (result.success) {
                console.log('✅ Compte créé !');
                console.log('📧 Email:', result.credentials.email);
                console.log('🔑 Mot de passe:', result.credentials.password);
                console.log('');
                console.log('🔗 Connectez-vous sur: http://localhost:5174/login');

                alert(`✅ Compte admin créé !\n\nEmail: ${result.credentials.email}\nMot de passe: ${result.credentials.password}\n\nConnectez-vous maintenant !`);

                // Rediriger vers la page de connexion
                window.location.href = '/login';

            } else {
                console.error('❌ Erreur:', result.message);
                alert('❌ Erreur: ' + result.message);
            }
        } catch (error) {
            console.error('💥 Exception:', error);
            alert('💥 Exception: ' + error.message);
        }
    } else {
        console.log('❌ Service toujours non disponible');
        alert('❌ Service non disponible. Rechargez la page.');
    }
}

// Exposer les fonctions
window.fixAuthError = fixAuthError;
window.createAdminSimple = createAdminSimple;

// Instructions
console.log(`
🎯 === COMMANDES DISPONIBLES ===

1. Diagnostic et correction complète :
   fixAuthError()

2. Création simple du compte admin :
   createAdminSimple()

⚡ SOLUTION RAPIDE :
   createAdminSimple()

📋 Instructions :
1. Exécutez une des commandes ci-dessus
2. Attendez la confirmation
3. Connectez-vous avec les identifiants affichés
`);

// Auto-exécution après 2 secondes
console.log('⏰ Lancement automatique de createAdminSimple() dans 2 secondes...');
console.log('🛑 Pour annuler, tapez: clearTimeout(autoFix)');

const autoFix = setTimeout(() => {
    console.log('🚀 Lancement automatique...');
    createAdminSimple();
}, 2000);
