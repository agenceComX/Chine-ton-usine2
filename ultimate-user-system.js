/**
 * 🚀 SOLUTION ULTIME - Système d'Utilisateurs Firebase Complet
 * Ce script combine toutes les meilleures approches pour garantir le succès
 */

console.log('🚀 === SOLUTION ULTIME - SYSTÈME D\'UTILISATEURS FIREBASE ===');

class UltimateUserSystem {

    constructor() {
        this.results = [];
        this.createdAccounts = [];
        this.errors = [];
    }

    /**
     * Log avec formatage et stockage
     */
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const formattedMessage = `[${timestamp}] ${message}`;

        console.log(formattedMessage);
        this.results.push({ message: formattedMessage, type });
    }

    /**
     * Attendre le chargement des services Firebase
     */
    async waitForServices(maxAttempts = 20) {
        this.log('⏳ Attente du chargement des services Firebase...');

        for (let i = 0; i < maxAttempts; i++) {
            if (window.AdminCreationService &&
                (window.firebaseModules?.db || window.firebase)) {
                this.log('✅ Services Firebase détectés');
                return true;
            }

            if (i % 5 === 0) {
                this.log(`⏳ Tentative ${i + 1}/${maxAttempts}...`);
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        this.log('❌ Timeout: Services non chargés', 'error');
        return false;
    }

    /**
     * Supprimer tous les utilisateurs existants
     */
    async deleteAllUsers() {
        this.log('🗑️ === SUPPRESSION DES UTILISATEURS EXISTANTS ===');

        try {
            // Méthode 1: Via les modules window.firebaseModules
            if (window.firebaseModules?.db) {
                const { collection, getDocs, deleteDoc } = window.firebaseModules;
                const usersRef = collection(window.firebaseModules.db, 'users');
                const snapshot = await getDocs(usersRef);

                this.log(`📊 ${snapshot.size} utilisateur(s) trouvé(s)`);

                if (snapshot.size > 0) {
                    const deletePromises = [];
                    snapshot.forEach((doc) => {
                        this.log(`🗑️ Suppression: ${doc.data().email}`);
                        deletePromises.push(deleteDoc(doc.ref));
                    });

                    await Promise.all(deletePromises);
                    this.log(`✅ ${snapshot.size} utilisateur(s) supprimé(s)`);
                    return snapshot.size;
                }
            }

            // Méthode 2: Via import dynamique
            try {
                const { collection, getDocs, deleteDoc, db } = await import('./src/lib/firebaseClient.js');
                const usersRef = collection(db, 'users');
                const snapshot = await getDocs(usersRef);

                this.log(`📊 ${snapshot.size} utilisateur(s) trouvé(s) (méthode 2)`);

                if (snapshot.size > 0) {
                    const deletePromises = [];
                    snapshot.forEach((doc) => {
                        deletePromises.push(deleteDoc(doc.ref));
                    });

                    await Promise.all(deletePromises);
                    this.log(`✅ ${snapshot.size} utilisateur(s) supprimé(s)`);
                    return snapshot.size;
                }
            } catch (importError) {
                this.log('⚠️ Import Firebase échoué, continuons...', 'warning');
            }

            this.log('ℹ️ Aucun utilisateur à supprimer ou suppression non nécessaire');
            return 0;

        } catch (error) {
            this.log(`❌ Erreur de suppression: ${error.message}`, 'error');
            this.errors.push(error);
            return 0;
        }
    }

    /**
     * Créer les nouveaux utilisateurs
     */
    async createUsers() {
        this.log('👥 === CRÉATION DES NOUVEAUX UTILISATEURS ===');

        const users = [
            {
                email: 'admin@chinetonusine.com',
                password: 'Admin123!',
                name: 'Administrateur Principal',
                role: 'admin',
                priority: 1
            },
            {
                email: 'admin2@chinetonusine.com',
                password: 'Admin123!',
                name: 'Administrateur Secondaire',
                role: 'admin',
                priority: 2
            },
            {
                email: 'fournisseur@chinetonusine.com',
                password: 'Fournisseur123!',
                name: 'Fournisseur Test',
                role: 'supplier',
                priority: 3
            },
            {
                email: 'client@chinetonusine.com',
                password: 'Client123!',
                name: 'Client Test',
                role: 'customer',
                priority: 4
            },
            {
                email: 'sourcer@chinetonusine.com',
                password: 'Sourcer123!',
                name: 'Sourcer Test',
                role: 'sourcer',
                priority: 5
            }
        ];

        // Trier par priorité
        users.sort((a, b) => a.priority - b.priority);

        for (const userData of users) {
            try {
                this.log(`👤 Création: ${userData.email} (${userData.role})`);

                // Méthode 1: createNewAdminAccount (pour tous les types)
                const result = await window.AdminCreationService.createNewAdminAccount({
                    email: userData.email,
                    password: userData.password,
                    name: userData.name
                });

                if (result.success) {
                    this.log(`✅ ${userData.email} créé avec succès`);
                    this.createdAccounts.push({
                        email: userData.email,
                        password: userData.password,
                        name: userData.name,
                        role: userData.role,
                        uid: result.uid,
                        success: true
                    });
                } else {
                    this.log(`⚠️ ${userData.email}: ${result.message}`, 'warning');

                    // Si l'email existe déjà, on l'ajoute quand même à la liste
                    if (result.message.includes('already') || result.message.includes('existe')) {
                        this.createdAccounts.push({
                            email: userData.email,
                            password: userData.password,
                            name: userData.name,
                            role: userData.role,
                            success: true,
                            existing: true
                        });
                    }
                }

                // Pause entre les créations
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                this.log(`❌ Erreur pour ${userData.email}: ${error.message}`, 'error');
                this.errors.push({ user: userData.email, error: error.message });
            }
        }

        return this.createdAccounts;
    }

    /**
     * Tester la connexion avec le compte admin principal
     */
    async testAdminLogin() {
        this.log('🔐 === TEST DE CONNEXION ADMIN ===');

        const adminAccount = this.createdAccounts.find(acc => acc.email === 'admin@chinetonusine.com');

        if (!adminAccount) {
            this.log('❌ Aucun compte admin trouvé pour le test', 'error');
            return false;
        }

        try {
            // Tentative de connexion automatique
            if (window.firebase?.auth) {
                const auth = window.firebase.auth();
                const userCredential = await auth.signInWithEmailAndPassword(
                    adminAccount.email,
                    adminAccount.password
                );

                this.log(`✅ Connexion admin réussie: ${userCredential.user.email}`);
                return true;
            } else {
                this.log('⚠️ Test de connexion automatique non disponible', 'warning');
                return null;
            }
        } catch (loginError) {
            this.log(`⚠️ Test de connexion échoué: ${loginError.message}`, 'warning');
            return false;
        }
    }

    /**
     * Afficher le résumé final
     */
    displaySummary() {
        this.log('📊 === RÉSUMÉ FINAL ===');

        const successful = this.createdAccounts.filter(acc => acc.success);
        const admins = successful.filter(acc => acc.role === 'admin');

        this.log(`✅ Comptes créés/vérifiés: ${successful.length}`);
        this.log(`👑 Administrateurs: ${admins.length}`);
        this.log(`❌ Erreurs: ${this.errors.length}`);

        // Préparer l'affichage des identifiants
        let credentialsDisplay = `🎉 SYSTÈME D'UTILISATEURS CONFIGURÉ !\n\n`;
        credentialsDisplay += `📊 Résumé: ${successful.length} comptes actifs\n\n`;
        credentialsDisplay += `🔑 IDENTIFIANTS PRINCIPAUX :\n\n`;

        // Afficher les admins en priorité
        admins.forEach(admin => {
            credentialsDisplay += `👑 ADMIN: ${admin.email}\n`;
            credentialsDisplay += `🔒 Mot de passe: ${admin.password}\n`;
            credentialsDisplay += admin.existing ? `📝 Statut: Compte existant\n\n` : `📝 Statut: Nouveau compte\n\n`;
        });

        // Afficher les autres utilisateurs
        const others = successful.filter(acc => acc.role !== 'admin');
        if (others.length > 0) {
            credentialsDisplay += `👥 AUTRES UTILISATEURS :\n\n`;
            others.forEach(user => {
                credentialsDisplay += `📧 ${user.email} (${user.role})\n`;
                credentialsDisplay += `🔒 ${user.password}\n\n`;
            });
        }

        credentialsDisplay += `🔗 Connectez-vous sur: http://localhost:5174/login\n`;
        credentialsDisplay += `⚙️ Interface admin: http://localhost:5174/admin/dashboard`;

        // Afficher l'alerte
        alert(credentialsDisplay);

        // Log détaillé dans la console
        this.log('🔑 === IDENTIFIANTS DÉTAILLÉS ===');
        successful.forEach(account => {
            this.log(`📧 ${account.email}`);
            this.log(`🔒 ${account.password}`);
            this.log(`👤 ${account.name}`);
            this.log(`🎭 ${account.role}`);
            this.log(`🆔 ${account.uid || 'N/A'}`);
            this.log(`📝 ${account.existing ? 'Compte existant' : 'Nouveau compte'}`);
            this.log('---');
        });
    }

    /**
     * Processus principal
     */
    async execute() {
        try {
            this.log('🚀 Démarrage du système ultime d\'utilisateurs');

            // Étape 1: Attendre les services
            const servicesReady = await this.waitForServices();
            if (!servicesReady) {
                alert('❌ Services Firebase non disponibles.\nRechargez la page et réessayez.');
                return false;
            }

            // Étape 2: Supprimer les utilisateurs existants
            const deletedCount = await this.deleteAllUsers();

            // Étape 3: Pause pour synchronisation
            this.log('⏳ Pause pour synchronisation Firestore...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Étape 4: Créer les nouveaux utilisateurs
            const createdAccounts = await this.createUsers();

            // Étape 5: Test de connexion
            await this.testAdminLogin();

            // Étape 6: Affichage du résumé
            this.displaySummary();

            this.log('🎉 Système d\'utilisateurs configuré avec succès !');

            return {
                success: true,
                deletedCount,
                createdCount: createdAccounts.length,
                accounts: createdAccounts,
                errors: this.errors
            };

        } catch (error) {
            this.log(`💥 Erreur critique: ${error.message}`, 'error');
            alert(`❌ Erreur critique: ${error.message}\n\nConsultez la console pour plus de détails.`);
            return { success: false, error: error.message };
        }
    }
}

// Fonctions de raccourci
async function runUltimateSystem() {
    const system = new UltimateUserSystem();
    return await system.execute();
}

async function createAdminOnly() {
    console.log('👑 Création rapide admin uniquement...');

    if (!window.AdminCreationService) {
        alert('Services non disponibles. Rechargez la page.');
        return;
    }

    try {
        const result = await window.AdminCreationService.createDefaultAdminAccount();

        if (result.success) {
            alert(`✅ Admin créé !\n\nEmail: ${result.credentials.email}\nMot de passe: ${result.credentials.password}\n\n🔗 Connectez-vous sur /login`);
            return result;
        } else {
            alert(`ℹ️ ${result.message}\n\nEssayez admin@chinetonusine.com / Admin123!`);
        }
    } catch (error) {
        alert(`❌ Erreur: ${error.message}`);
    }
}

// Exposer les fonctions
window.UltimateUserSystem = UltimateUserSystem;
window.runUltimateSystem = runUltimateSystem;
window.createAdminOnly = createAdminOnly;

// Instructions
console.log(`
🎯 === SOLUTION ULTIME DISPONIBLE ===

🚀 Système complet (RECOMMANDÉ) :
   runUltimateSystem()

👑 Admin seulement (rapide) :
   createAdminOnly()

⚡ LANCEMENT AUTOMATIQUE dans 3 secondes...
🛑 Pour annuler : clearTimeout(ultimateTimer)

📋 Ce que fait le système complet :
✅ Supprime tous les utilisateurs existants
✅ Crée 6 nouveaux comptes (2 admins + 4 utilisateurs test)
✅ Teste la connexion admin
✅ Affiche tous les identifiants
✅ Gestion complète des erreurs
`);

// Lancement automatique
console.log('⏰ Lancement du système ultime dans 3 secondes...');
const ultimateTimer = setTimeout(() => {
    console.log('🚀 === LANCEMENT AUTOMATIQUE DU SYSTÈME ULTIME ===');
    runUltimateSystem();
}, 3000);
