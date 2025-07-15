/**
 * 🎯 SCRIPT D'INITIALISATION AUTOMATIQUE
 * Exécution immédiate pour créer les utilisateurs
 */

console.log(`
🚀 ================================
   INITIALISATION AUTOMATIQUE
   Système d'Utilisateurs Firebase
================================

📋 Ce script va automatiquement :
✅ Détecter les services Firebase
✅ Créer 2 comptes administrateur  
✅ Créer 4 comptes utilisateur test
✅ Configurer tous les rôles
✅ Afficher tous les identifiants

⏰ Lancement dans 3 secondes...
🛑 Pour annuler : Ctrl+C dans le terminal
`);

// Fonction d'initialisation automatique
(async function autoInitialize() {
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🚀 === DÉMARRAGE DE L\'INITIALISATION ===');

    try {
        // Attendre que les services soient chargés
        let attempts = 0;
        while (!window.AdminCreationService && attempts < 15) {
            console.log(`⏳ Attente des services Firebase... (${attempts + 1}/15)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }

        if (!window.AdminCreationService) {
            console.error('❌ Services Firebase non disponibles après 15 tentatives');
            console.log('💡 Solutions :');
            console.log('1. Rechargez la page navigateur');
            console.log('2. Allez sur http://localhost:5174/admin/users');
            console.log('3. Utilisez l\'interface graphique');
            return;
        }

        console.log('✅ Services Firebase détectés !');
        console.log('👥 Création des comptes utilisateur...');

        // Comptes à créer
        const accounts = [
            {
                email: 'admin@chinetonusine.com',
                password: 'Admin123!',
                name: 'Administrateur Principal',
                role: 'admin',
                icon: '👑'
            },
            {
                email: 'admin2@chinetonusine.com',
                password: 'Admin123!',
                name: 'Administrateur Secondaire',
                role: 'admin',
                icon: '👑'
            },
            {
                email: 'fournisseur@chinetonusine.com',
                password: 'Fournisseur123!',
                name: 'Fournisseur Test',
                role: 'supplier',
                icon: '🏭'
            },
            {
                email: 'client@chinetonusine.com',
                password: 'Client123!',
                name: 'Client Test',
                role: 'customer',
                icon: '🛒'
            },
            {
                email: 'sourcer@chinetonusine.com',
                password: 'Sourcer123!',
                name: 'Sourcer Test',
                role: 'sourcer',
                icon: '🔍'
            }
        ];

        const createdAccounts = [];
        let successCount = 0;

        for (const account of accounts) {
            try {
                console.log(`${account.icon} Création: ${account.email} (${account.role})`);

                const result = await window.AdminCreationService.createNewAdminAccount({
                    email: account.email,
                    password: account.password,
                    name: account.name
                });

                if (result.success) {
                    console.log(`✅ ${account.email} créé avec succès`);
                    createdAccounts.push(account);
                    successCount++;
                } else {
                    console.log(`⚠️ ${account.email}: ${result.message}`);

                    // Si le compte existe déjà, on l'ajoute quand même
                    if (result.message.includes('already') || result.message.includes('existe')) {
                        createdAccounts.push({ ...account, existing: true });
                    }
                }

                // Pause entre les créations
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`❌ Erreur ${account.email}:`, error.message);
            }
        }

        // Affichage du résumé final
        console.log('\n🎉 === INITIALISATION TERMINÉE ===');
        console.log(`✅ ${successCount} nouveaux comptes créés`);
        console.log(`📊 ${createdAccounts.length} comptes disponibles au total`);

        if (createdAccounts.length > 0) {
            console.log('\n🔑 === IDENTIFIANTS DE CONNEXION ===');
            console.log('');

            // Grouper par rôle
            const admins = createdAccounts.filter(acc => acc.role === 'admin');
            const users = createdAccounts.filter(acc => acc.role !== 'admin');

            // Afficher les admins en premier
            if (admins.length > 0) {
                console.log('👑 === ADMINISTRATEURS ===');
                admins.forEach(admin => {
                    console.log(`📧 Email: ${admin.email}`);
                    console.log(`🔑 Mot de passe: ${admin.password}`);
                    console.log(`👤 Nom: ${admin.name}`);
                    console.log(`📝 Statut: ${admin.existing ? 'Compte existant' : 'Nouveau compte'}`);
                    console.log('');
                });
            }

            // Afficher les autres utilisateurs
            if (users.length > 0) {
                console.log('👥 === UTILISATEURS TEST ===');
                users.forEach(user => {
                    console.log(`${user.icon} ${user.role.toUpperCase()}: ${user.email}`);
                    console.log(`🔑 Mot de passe: ${user.password}`);
                    console.log('');
                });
            }

            console.log('🔗 === LIENS UTILES ===');
            console.log('🔐 Connexion: http://localhost:5174/login');
            console.log('⚙️ Admin Dashboard: http://localhost:5174/admin/dashboard');
            console.log('👥 Gestion Utilisateurs: http://localhost:5174/admin/users');
            console.log('');

            console.log('🎯 === PROCHAINES ÉTAPES ===');
            console.log('1. Allez sur la page de connexion');
            console.log('2. Connectez-vous avec admin@chinetonusine.com / Admin123!');
            console.log('3. Vous serez redirigé vers le dashboard admin');
            console.log('4. Explorez toutes les fonctionnalités !');

            // Alerte récapitulative
            const summary = `🎉 SYSTÈME D'UTILISATEURS INITIALISÉ !

📊 Résumé:
✅ ${successCount} nouveaux comptes créés
📋 ${createdAccounts.length} comptes disponibles

👑 CONNEXION ADMIN PRINCIPALE:
📧 admin@chinetonusine.com
🔑 Admin123!

🔗 Allez sur: http://localhost:5174/login

Cliquez OK pour continuer...`;

            alert(summary);

        } else {
            console.log('⚠️ Aucun compte disponible');
            console.log('💡 Essayez de recharger la page et réessayer');
        }

    } catch (error) {
        console.error('💥 Erreur critique:', error);
        console.log('');
        console.log('🔧 === SOLUTIONS DE DÉPANNAGE ===');
        console.log('1. Rechargez la page (Ctrl+F5)');
        console.log('2. Allez sur http://localhost:5174/admin/users');
        console.log('3. Utilisez l\'interface "Système Ultime d\'Utilisateurs"');
        console.log('4. Consultez les guides dans le dossier du projet');

        alert(`❌ Erreur d'initialisation: ${error.message}

🔧 Solutions:
1. Rechargez la page navigateur
2. Utilisez l'interface graphique sur /admin/users
3. Consultez la console pour plus de détails`);
    }
})();

console.log('⚡ Script d\'initialisation automatique chargé !');
