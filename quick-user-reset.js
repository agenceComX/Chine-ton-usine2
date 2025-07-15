/**
 * Script simple pour supprimer et recréer les utilisateurs Firebase
 * Version allégée et rapide
 */

console.log('⚡ Script de réinitialisation express des utilisateurs');

// Fonction express de réinitialisation
async function quickUserReset() {
    console.log('🚀 Début de la réinitialisation express...');

    try {
        // Attendre que les services soient disponibles
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!window.AdminCreationService) {
            console.error('❌ Services non disponibles');
            alert('⚠️ Rechargez la page et réessayez');
            return;
        }

        console.log('1️⃣ Suppression des utilisateurs existants...');

        // Supprimer via Firestore directement
        try {
            const { collection, getDocs, deleteDoc, doc, db } = window.firebaseModules || {};

            if (db) {
                const usersRef = collection(db, 'users');
                const snapshot = await getDocs(usersRef);

                console.log(`🗑️ ${snapshot.size} utilisateurs à supprimer`);

                const deletePromises = [];
                snapshot.forEach((userDoc) => {
                    deletePromises.push(deleteDoc(userDoc.ref));
                });

                await Promise.all(deletePromises);
                console.log('✅ Suppression terminée');
            }
        } catch (deleteError) {
            console.log('⚠️ Erreur de suppression, continuons...');
        }

        console.log('2️⃣ Création des nouveaux utilisateurs...');

        // Définir les nouveaux utilisateurs
        const users = [
            { email: 'admin@chinetonusine.com', password: 'Admin123!', name: 'Admin Principal', role: 'admin' },
            { email: 'admin2@chinetonusine.com', password: 'Admin123!', name: 'Admin Secondaire', role: 'admin' },
            { email: 'fournisseur@test.com', password: 'Fournisseur123!', name: 'Fournisseur Test', role: 'supplier' },
            { email: 'client@test.com', password: 'Client123!', name: 'Client Test', role: 'customer' },
            { email: 'sourcer@test.com', password: 'Sourcer123!', name: 'Sourcer Test', role: 'sourcer' }
        ];

        const createdUsers = [];

        for (const userData of users) {
            try {
                console.log(`👤 Création: ${userData.email}`);

                const result = await window.AdminCreationService.createNewAdminAccount({
                    email: userData.email,
                    password: userData.password,
                    name: userData.name
                });

                if (result.success) {
                    console.log(`✅ ${userData.email} créé`);
                    createdUsers.push({
                        email: userData.email,
                        password: userData.password,
                        role: userData.role,
                        uid: result.uid
                    });
                } else {
                    console.log(`⚠️ ${userData.email}: ${result.message}`);
                }

                // Petite pause
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`❌ ${userData.email}:`, error.message);
            }
        }

        // Résumé
        console.log('\n🎉 === RÉINITIALISATION TERMINÉE ===');
        console.log(`✅ ${createdUsers.length} utilisateurs créés`);

        if (createdUsers.length > 0) {
            console.log('\n🔑 === IDENTIFIANTS ===');
            let credentials = '';

            createdUsers.forEach(user => {
                const info = `📧 ${user.email}\n🔒 ${user.password}\n👤 ${user.role}\n`;
                console.log(info);
                credentials += info + '\n';
            });

            alert(`🎉 Réinitialisation réussie !\n\n${createdUsers.length} nouveaux comptes:\n\n${credentials}\n🔗 Connectez-vous sur /login`);
        }

        return {
            success: true,
            created: createdUsers.length,
            accounts: createdUsers
        };

    } catch (error) {
        console.error('💥 Erreur:', error);
        alert('❌ Erreur: ' + error.message);
        return { success: false, error: error.message };
    }
}

// Fonction pour créer seulement les comptes essentiels
async function createEssentialAccounts() {
    console.log('⚡ Création des comptes essentiels...');

    const essentialUsers = [
        { email: 'admin@chinetonusine.com', password: 'Admin123!', name: 'Administrateur', role: 'admin' },
        { email: 'test@chinetonusine.com', password: 'Test123!', name: 'Utilisateur Test', role: 'customer' }
    ];

    if (!window.AdminCreationService) {
        alert('⚠️ Services non disponibles. Rechargez la page.');
        return;
    }

    const created = [];

    for (const user of essentialUsers) {
        try {
            const result = await window.AdminCreationService.createNewAdminAccount({
                email: user.email,
                password: user.password,
                name: user.name
            });

            if (result.success) {
                created.push(user);
                console.log(`✅ ${user.email} créé`);
            }
        } catch (error) {
            console.error(`❌ ${user.email}:`, error);
        }
    }

    if (created.length > 0) {
        const creds = created.map(u => `📧 ${u.email}\n🔒 ${u.password}`).join('\n\n');
        alert(`✅ Comptes essentiels créés !\n\n${creds}\n\n🔗 Connectez-vous sur /login`);
    }
}

// Exposer les fonctions
window.quickUserReset = quickUserReset;
window.createEssentialAccounts = createEssentialAccounts;

console.log(`
⚡ === COMMANDES EXPRESS ===

🔄 Réinitialisation complète et rapide :
   quickUserReset()

⚡ Créer seulement les comptes essentiels :
   createEssentialAccounts()

🚀 LANCEMENT AUTOMATIQUE dans 3 secondes...
🛑 Pour annuler : clearTimeout(quickTimer)
`);

// Lancement automatique
const quickTimer = setTimeout(() => {
    console.log('🚀 Lancement automatique...');
    quickUserReset();
}, 3000);
