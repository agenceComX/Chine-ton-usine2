/**
 * Script de console pour créer un compte admin Firebase
 * 
 * Usage dans la console du navigateur :
 * 1. Ouvrir l'application dans le navigateur
 * 2. Ouvrir les outils de développement (F12)
 * 3. Aller dans l'onglet Console
 * 4. Copier et coller ce script
 * 5. Exécuter avec : createAdminAccount()
 */

// Script pour créer un compte admin directement depuis la console
async function createAdminAccount(email = 'admin@chinetonusine.com', password = 'admin123456', name = 'Administrateur Principal') {
    try {
        console.log('🚀 Création du compte admin en cours...');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Mot de passe: ${password}`);
        console.log(`👤 Nom: ${name}`);

        // Importer le service de création admin depuis le window (si disponible)
        if (typeof window !== 'undefined' && window.AdminCreationService) {
            const result = await window.AdminCreationService.createNewAdminAccount({
                email,
                password,
                name
            });

            if (result.success) {
                console.log('✅ Compte admin créé avec succès !');
                console.log(`🆔 UID: ${result.uid}`);
                console.log('');
                console.log('🎯 Prochaines étapes :');
                console.log('1. Déconnectez-vous de votre session actuelle');
                console.log('2. Connectez-vous avec ces identifiants :');
                console.log(`   Email: ${email}`);
                console.log(`   Mot de passe: ${password}`);
                console.log('3. Vous devriez être redirigé vers /admin/dashboard');

                return {
                    success: true,
                    credentials: { email, password, name },
                    uid: result.uid
                };
            } else {
                console.error('❌ Erreur:', result.message);
                return { success: false, error: result.message };
            }
        } else {
            console.error('❌ Service AdminCreationService non disponible. Assurez-vous d\'être sur la page de l\'application.');
            console.log('💡 Astuce: Naviguez vers /admin/users pour utiliser l\'interface de création admin.');
            return { success: false, error: 'Service non disponible' };
        }
    } catch (error) {
        console.error('💥 Exception:', error);
        return { success: false, error: error.message };
    }
}

// Script pour créer le compte admin par défaut
async function createDefaultAdmin() {
    try {
        console.log('🚀 Création du compte admin par défaut...');

        if (typeof window !== 'undefined' && window.AdminCreationService) {
            const result = await window.AdminCreationService.createDefaultAdminAccount();

            if (result.success && result.credentials) {
                console.log('✅ Compte admin par défaut créé !');
                console.log('');
                console.log('🔑 Identifiants de connexion :');
                console.log(`📧 Email: ${result.credentials.email}`);
                console.log(`🔑 Mot de passe: ${result.credentials.password}`);
                console.log(`🆔 UID: ${result.uid}`);
                console.log('');
                console.log('🎯 Connexion :');
                console.log('1. Allez sur /login');
                console.log('2. Utilisez ces identifiants');
                console.log('3. Redirection automatique vers /admin/dashboard');

                return result;
            } else {
                console.error('❌ Erreur:', result.message);
                return result;
            }
        } else {
            console.error('❌ Service AdminCreationService non disponible.');
            return { success: false, error: 'Service non disponible' };
        }
    } catch (error) {
        console.error('💥 Exception:', error);
        return { success: false, error: error.message };
    }
}

// Afficher les instructions
console.log(`
🔧 === SCRIPTS DE CRÉATION ADMIN DISPONIBLES ===

1. Créer un compte admin personnalisé :
   createAdminAccount('votre-email@exemple.com', 'votre-mot-de-passe', 'Votre Nom')

2. Créer le compte admin par défaut :
   createDefaultAdmin()

3. Créer un compte avec les paramètres par défaut :
   createAdminAccount()

📋 Exemple d'utilisation :
   createAdminAccount('nouvel-admin@chinetonusine.com', 'motdepasse123', 'Nouvel Admin')

⚠️  Important : 
- Assurez-vous d'être sur la page de l'application
- Les services Firebase doivent être chargés
- Utilisez un mot de passe fort en production
`);

// Exposer les fonctions globalement pour faciliter l'utilisation
if (typeof window !== 'undefined') {
    window.createAdminAccount = createAdminAccount;
    window.createDefaultAdmin = createDefaultAdmin;
}
