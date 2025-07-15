// ⚡ SCRIPT ULTRA-SIMPLE POUR CRÉER UN ADMIN
// Copiez et collez ce code dans la console du navigateur

console.log('🚀 Script ultra-simple pour créer un admin');

// Fonction simplifiée
async function createAdminNow() {
    try {
        console.log('📧 Création de admin@chinetonusine.com...');

        // Essayer avec le service global
        if (window.AdminCreationService) {
            const result = await window.AdminCreationService.createDefaultAdminAccount();

            if (result.success) {
                console.log('✅ SUCCÈS !');
                console.log('');
                console.log('🔑 IDENTIFIANTS :');
                console.log('📧 Email: admin@chinetonusine.com');
                console.log('🔒 Mot de passe: admin123456');
                console.log('');
                console.log('🔗 Allez sur: http://localhost:5174/login');
                console.log('');
                alert('✅ Compte admin créé !\nEmail: admin@chinetonusine.com\nMot de passe: admin123456');
            } else {
                console.log('❌ Erreur:', result.message);
                if (result.message.includes('already')) {
                    console.log('💡 Le compte existe déjà ! Connectez-vous avec :');
                    console.log('📧 admin@chinetonusine.com');
                    console.log('🔒 admin123456');
                    alert('ℹ️ Le compte admin existe déjà !\nUtilisez: admin@chinetonusine.com / admin123456');
                }
            }
        } else {
            console.log('❌ Service non disponible');
            console.log('💡 Rechargez la page et réessayez dans 5 secondes');
            alert('⚠️ Services non chargés.\nRechargez la page et réessayez.');
        }
    } catch (error) {
        console.error('💥 Erreur:', error);
        alert('❌ Erreur: ' + error.message);
    }
}

// Exécution automatique après 3 secondes
console.log('⏳ Lancement automatique dans 3 secondes...');
console.log('🛑 Pour arrêter, tapez: clearTimeout(autoTimer)');

const autoTimer = setTimeout(() => {
    createAdminNow();
}, 3000);

// Exposer la fonction
window.createAdminNow = createAdminNow;

console.log('');
console.log('🎮 COMMANDES DISPONIBLES :');
console.log('- createAdminNow()    : Créer le compte admin');
console.log('- clearTimeout(autoTimer) : Annuler le lancement auto');
console.log('');
