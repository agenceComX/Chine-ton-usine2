/**
 * Script de test pour valider la création d'un compte admin
 * Testez ce script dans la console du navigateur
 */

async function testAdminCreation() {
    console.log('🧪 === TEST DE CRÉATION ADMIN ===');

    try {
        // Étape 1 : Vérifier que les services sont disponibles
        console.log('1️⃣ Vérification des services...');
        if (!window.AdminCreationService) {
            throw new Error('AdminCreationService non disponible');
        }
        console.log('✅ Services disponibles');

        // Étape 2 : Créer un compte admin de test
        console.log('2️⃣ Création du compte admin de test...');
        const testEmail = `test-admin-${Date.now()}@chinetonusine.com`;
        const testPassword = 'TestAdmin123!';
        const testName = 'Admin Test';

        const result = await window.AdminCreationService.createNewAdminAccount({
            email: testEmail,
            password: testPassword,
            name: testName
        });

        console.log('📊 Résultat de création:', result);

        if (result.success) {
            console.log('✅ Compte créé avec succès !');
            console.log(`📧 Email: ${testEmail}`);
            console.log(`🔑 Mot de passe: ${testPassword}`);
            console.log(`🆔 UID: ${result.uid}`);

            // Étape 3 : Instructions pour tester la connexion
            console.log('3️⃣ Test de connexion :');
            console.log('📝 Pour tester la connexion :');
            console.log('1. Ouvrez un nouvel onglet incognito');
            console.log('2. Allez sur http://localhost:5174/login');
            console.log(`3. Connectez-vous avec ${testEmail} / ${testPassword}`);
            console.log('4. Vérifiez la redirection vers /admin/dashboard');

            return {
                success: true,
                testCredentials: {
                    email: testEmail,
                    password: testPassword,
                    name: testName
                },
                uid: result.uid
            };
        } else {
            console.error('❌ Échec de création:', result.message);
            return { success: false, error: result.message };
        }

    } catch (error) {
        console.error('💥 Erreur de test:', error);
        return { success: false, error: error.message };
    }
}

async function testDefaultAdminCreation() {
    console.log('🧪 === TEST ADMIN PAR DÉFAUT ===');

    try {
        console.log('🚀 Création du compte admin par défaut...');
        const result = await window.AdminCreationService.createDefaultAdminAccount();

        console.log('📊 Résultat:', result);

        if (result.success && result.credentials) {
            console.log('✅ Compte admin par défaut créé !');
            console.log(`📧 Email: ${result.credentials.email}`);
            console.log(`🔑 Mot de passe: ${result.credentials.password}`);
            console.log(`🆔 UID: ${result.uid}`);

            console.log('🎯 Test de connexion :');
            console.log('1. Déconnectez-vous si connecté');
            console.log('2. Allez sur /login');
            console.log('3. Connectez-vous avec les identifiants ci-dessus');
            console.log('4. Vérifiez la redirection vers /admin/dashboard');

            return result;
        } else {
            console.error('❌ Échec:', result.message);
            return result;
        }
    } catch (error) {
        console.error('💥 Erreur:', error);
        return { success: false, error: error.message };
    }
}

async function runFullTest() {
    console.log('🔄 === TEST COMPLET ===');

    // Test 1 : Compte personnalisé
    console.log('\n--- Test 1: Compte personnalisé ---');
    const test1 = await testAdminCreation();

    // Test 2 : Compte par défaut
    console.log('\n--- Test 2: Compte par défaut ---');
    const test2 = await testDefaultAdminCreation();

    // Résumé
    console.log('\n📋 === RÉSUMÉ DES TESTS ===');
    console.log(`Test compte personnalisé: ${test1.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
    console.log(`Test compte par défaut: ${test2.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);

    if (test1.success || test2.success) {
        console.log('\n🎉 Au moins un compte admin a été créé avec succès !');
        console.log('🔗 Accédez à l\'interface admin : http://localhost:5174/admin/users');
    } else {
        console.log('\n⚠️  Aucun compte n\'a pu être créé. Vérifiez la configuration Firebase.');
    }

    return {
        personalizedAccount: test1,
        defaultAccount: test2
    };
}

// Exposer les fonctions de test
if (typeof window !== 'undefined') {
    window.testAdminCreation = testAdminCreation;
    window.testDefaultAdminCreation = testDefaultAdminCreation;
    window.runFullTest = runFullTest;
}

console.log(`
🧪 === SCRIPTS DE TEST DISPONIBLES ===

1. Tester la création d'un compte personnalisé :
   testAdminCreation()

2. Tester la création du compte par défaut :
   testDefaultAdminCreation()

3. Exécuter tous les tests :
   runFullTest()

📍 Application disponible sur : http://localhost:5174/
📋 Interface admin : http://localhost:5174/admin/users
🔑 Page de connexion : http://localhost:5174/login
`);
