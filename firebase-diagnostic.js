/**
 * Script de diagnostic Firebase
 * À coller dans la console du navigateur pour diagnostiquer les problèmes
 */

(function firebaseDiagnostic() {
    console.log('🔍 === DIAGNOSTIC FIREBASE ===');

    // 1. Vérifier les variables globales
    console.log('1️⃣ Vérification des variables globales...');
    console.log('- window.firebase:', !!window.firebase);
    console.log('- window.AdminCreationService:', !!window.AdminCreationService);
    console.log('- window.AdminRedirectionDiagnostic:', !!window.AdminRedirectionDiagnostic);

    // 2. Vérifier les modules Firebase
    console.log('\n2️⃣ Vérification des modules Firebase...');
    try {
        const { auth, db } = window.firebaseModules || {};
        console.log('- auth module:', !!auth);
        console.log('- db module:', !!db);

        if (auth) {
            console.log('- Current user:', auth.currentUser?.email || 'None');
        }
    } catch (e) {
        console.log('- Erreur modules:', e.message);
    }

    // 3. Tester une connexion de base
    console.log('\n3️⃣ Test de connexion basique...');
    if (window.AdminCreationService) {
        console.log('✅ Service de création disponible');

        // Test de validation
        try {
            const testData = {
                email: 'test@test.com',
                password: 'test123456',
                name: 'Test User'
            };
            console.log('📝 Test de validation des données...');
            // Note: Nous ne pouvons pas appeler la méthode privée validateAdminData directement
        } catch (e) {
            console.error('❌ Erreur validation:', e.message);
        }

    } else {
        console.log('❌ Service de création NON disponible');
        console.log('💡 Suggestion: Rechargez la page et réessayez');
    }

    // 4. Instructions de résolution
    console.log('\n🔧 === INSTRUCTIONS DE RÉSOLUTION ===');
    console.log('Si les services ne sont pas disponibles :');
    console.log('1. Rechargez la page (Ctrl+F5)');
    console.log('2. Attendez le chargement complet');
    console.log('3. Réexécutez ce diagnostic');
    console.log('');
    console.log('Si les services sont disponibles :');
    console.log('1. Exécutez: createDefaultAdmin()');
    console.log('2. Ou utilisez l\'interface /admin/users');
    console.log('');
    console.log('🆘 En cas de problème persistant :');
    console.log('1. Vérifiez la console pour des erreurs');
    console.log('2. Vérifiez la configuration Firebase');
    console.log('3. Testez avec un autre navigateur');

})();

// Fonction d'attente pour les services
async function waitForServices() {
    console.log('⏳ Attente du chargement des services...');

    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
        if (window.AdminCreationService && window.AdminRedirectionDiagnostic) {
            console.log('✅ Services chargés après', attempts, 'tentatives');
            console.log('🚀 Vous pouvez maintenant exécuter : createDefaultAdmin()');
            return true;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;

        if (attempts % 5 === 0) {
            console.log(`⏳ Tentative ${attempts}/${maxAttempts}...`);
        }
    }

    console.log('❌ Timeout: Services non chargés après', maxAttempts, 'tentatives');
    console.log('💡 Essayez de recharger la page');
    return false;
}

// Exposer la fonction d'attente
window.waitForServices = waitForServices;
