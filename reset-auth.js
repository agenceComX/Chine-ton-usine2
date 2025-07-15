/**
 * Script de réinitialisation complète de l'authentification
 * Pour résoudre les erreurs persistantes auth/invalid-credential
 */

console.log('🔄 === RÉINITIALISATION COMPLÈTE DE L\'AUTHENTIFICATION ===');

async function resetAuthCompletely() {
    try {
        console.log('1️⃣ Déconnexion de tous les utilisateurs...');

        // Déconnecter l'utilisateur actuel si connecté
        if (window.firebase?.auth?.currentUser) {
            await window.firebase.auth.signOut();
            console.log('✅ Déconnexion effectuée');
        } else {
            console.log('ℹ️ Aucun utilisateur connecté');
        }

        console.log('2️⃣ Nettoyage du stockage local...');

        // Nettoyer le localStorage et sessionStorage
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ Stockage local nettoyé');

        console.log('3️⃣ Attente et rechargement...');

        // Attendre un peu puis recharger
        setTimeout(() => {
            console.log('🔄 Rechargement de la page...');
            window.location.reload();
        }, 2000);

    } catch (error) {
        console.error('❌ Erreur lors de la réinitialisation:', error);

        // Forcer le rechargement même en cas d'erreur
        console.log('🔄 Rechargement forcé...');
        window.location.reload();
    }
}

async function createFreshAdmin() {
    console.log('🆕 Création d\'un nouveau compte admin...');

    // Attendre que les services soient chargés
    let attempts = 0;
    while (!window.AdminCreationService && attempts < 10) {
        console.log(`⏳ Attente des services... (${attempts + 1}/10)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
    }

    if (!window.AdminCreationService) {
        console.error('❌ Services non disponibles après 10 tentatives');
        console.log('💡 Essayez de recharger la page manuellement');
        return;
    }

    try {
        // Essayer de créer le compte par défaut
        console.log('📧 Création du compte admin@chinetonusine.com...');

        const result = await window.AdminCreationService.createDefaultAdminAccount();

        if (result.success) {
            console.log('✅ SUCCÈS ! Compte admin créé');
            console.log('');
            console.log('📋 INFORMATIONS DE CONNEXION :');
            console.log('📧 Email:', result.credentials.email);
            console.log('🔑 Mot de passe:', result.credentials.password);
            console.log('');

            // Afficher une alerte avec les informations
            alert(`🎉 Compte admin créé avec succès !
            
📧 Email: ${result.credentials.email}
🔑 Mot de passe: ${result.credentials.password}

🔗 Vous allez être redirigé vers la page de connexion.`);

            // Rediriger vers la page de connexion
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } else {
            console.error('❌ Erreur de création:', result.message);

            // Si le compte existe déjà
            if (result.message.includes('already') || result.message.includes('existe')) {
                console.log('💡 Le compte existe déjà !');
                console.log('📧 Essayez de vous connecter avec: admin@chinetonusine.com');
                console.log('🔑 Mot de passe: admin123456');

                alert(`ℹ️ Le compte admin existe déjà !

📧 Email: admin@chinetonusine.com
🔑 Mot de passe: admin123456

🔗 Essayez de vous connecter avec ces identifiants.`);

                // Rediriger vers la page de connexion
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                alert('❌ Erreur: ' + result.message);
            }
        }

    } catch (error) {
        console.error('💥 Exception:', error);
        alert('💥 Erreur technique: ' + error.message);
    }
}

// Exposer les fonctions
window.resetAuthCompletely = resetAuthCompletely;
window.createFreshAdmin = createFreshAdmin;

// Menu d'options
console.log(`
🛠️ === OPTIONS DE RÉPARATION ===

1. Réinitialisation complète (recommandée) :
   resetAuthCompletely()

2. Création d'un nouveau compte admin :
   createFreshAdmin()

⚡ SOLUTION AUTOMATIQUE :
   Le script va automatiquement créer un compte admin dans 3 secondes.

🛑 Pour annuler l'automatisation :
   clearTimeout(autoCreateTimer)
`);

// Lancement automatique
const autoCreateTimer = setTimeout(() => {
    console.log('🚀 Lancement automatique de la création d\'admin...');
    createFreshAdmin();
}, 3000);

console.log('⏰ Création automatique dans 3 secondes...');
