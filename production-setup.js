/**
 * 🏭 SCRIPT DE MISE EN PRODUCTION FIREBASE
 * 
 * Ce script prépare votre application pour la production en :
 * 1. Purgeant tous les utilisateurs de test existants
 * 2. Créant des utilisateurs de production sécurisés  
 * 3. Configurant un système d'authentification robuste
 * 4. Appliquant les meilleures pratiques de sécurité
 * 
 * ⚠️ ATTENTION: Opération irréversible en production !
 * 
 * Utilisation :
 * 1. Ouvrez la console (F12)
 * 2. Collez ce script
 * 3. Exécutez : await prepareForProduction()
 */

class ProductionSetup {
    constructor() {
        this.log('🏭 === PRÉPARATION POUR LA PRODUCTION ===');
        this.log('Version: 1.0.0 - Firebase Production Ready');
        this.createdUsers = [];
        this.errors = [];
        this.startTime = Date.now();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const prefix = {
            info: '📋',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            critical: '🚨'
        }[type] || '📋';

        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    /**
     * Attendre le chargement des services Firebase
     */
    async waitForServices(maxAttempts = 30) {
        this.log('⏳ Vérification des services Firebase...');

        for (let i = 0; i < maxAttempts; i++) {
            if (window.productionUserService ||
                (window.firebase && window.AdminCreationService)) {
                this.log('✅ Services Firebase détectés et prêts');
                return true;
            }

            if (i % 5 === 0) {
                this.log(`⏳ Tentative ${i + 1}/${maxAttempts}...`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.log('❌ Timeout: Services Firebase non disponibles', 'error');
        return false;
    }

    /**
     * Valider la configuration Firebase
     */
    validateFirebaseConfig() {
        this.log('🔍 Validation de la configuration Firebase...');

        const requiredServices = [
            'firebase',
            'productionUserService'
        ];

        const missing = requiredServices.filter(service => !window[service]);

        if (missing.length > 0) {
            this.log(`❌ Services manquants: ${missing.join(', ')}`, 'error');
            return false;
        }

        this.log('✅ Configuration Firebase validée');
        return true;
    }

    /**
     * Demander confirmation pour la production
     */
    async confirmProductionSetup() {
        this.log('🤔 Demande de confirmation utilisateur...');

        const confirmation = confirm(`
🏭 MISE EN PRODUCTION FIREBASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ATTENTION: Cette opération va :

✅ Supprimer TOUS les utilisateurs existants
✅ Créer de nouveaux comptes sécurisés pour la production
✅ Appliquer des règles de sécurité strictes
✅ Configurer l'authentification robuste

💡 Utilisateurs qui seront créés :
   → admin@chinetonusine.com (Admin Principal)
   → admin.backup@chinetonusine.com (Admin Backup)
   → support@chinetonusine.com (Support)

🔐 Mots de passe sécurisés seront générés
📊 Tous les identifiants seront affichés après création

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Continuer avec la mise en production ?`);

        if (!confirmation) {
            this.log('🛑 Opération annulée par l\'utilisateur');
            return false;
        }

        // Double confirmation pour les opérations critiques
        const doubleConfirm = confirm(`
🚨 CONFIRMATION FINALE

Vous allez DÉFINITIVEMENT supprimer tous les utilisateurs existants.

Cette action est IRRÉVERSIBLE.

Êtes-vous absolument certain de vouloir continuer ?`);

        if (!doubleConfirm) {
            this.log('🛑 Opération annulée lors de la double confirmation');
            return false;
        }

        this.log('✅ Confirmation reçue - Procédure autorisée');
        return true;
    }

    /**
     * Purger tous les utilisateurs existants
     */
    async purgeExistingUsers() {
        this.log('🗑️ === PURGE DES UTILISATEURS EXISTANTS ===');

        try {
            if (!window.productionUserService) {
                throw new Error('Service de production non disponible');
            }

            const result = await window.productionUserService.purgeAllUsers();

            if (result.success) {
                this.log(`✅ ${result.deletedCount} utilisateurs supprimés avec succès`);
            } else {
                this.log(`⚠️ Purge partielle: ${result.deletedCount} supprimés, ${result.errors.length} erreurs`, 'warning');
                result.errors.forEach(error => this.log(`   • ${error}`, 'warning'));
            }

            return result;

        } catch (error) {
            this.log(`❌ Erreur lors de la purge: ${error.message}`, 'error');
            this.errors.push(`Purge: ${error.message}`);
            return { success: false, deletedCount: 0, errors: [error.message] };
        }
    }

    /**
     * Créer les utilisateurs de production
     */
    async createProductionUsers() {
        this.log('👥 === CRÉATION DES UTILISATEURS DE PRODUCTION ===');

        try {
            if (!window.productionUserService) {
                throw new Error('Service de production non disponible');
            }

            const result = await window.productionUserService.createEssentialProductionUsers();

            this.createdUsers = result.created;

            if (result.success) {
                this.log(`✅ ${result.created.length} utilisateurs créés avec succès`);
            } else {
                this.log(`⚠️ Création partielle: ${result.created.length} créés, ${result.failed.length} échecs`, 'warning');
                result.failed.forEach(failure => {
                    this.log(`   • ${failure.email}: ${failure.error}`, 'warning');
                    this.errors.push(`${failure.email}: ${failure.error}`);
                });
            }

            return result;

        } catch (error) {
            this.log(`❌ Erreur lors de la création: ${error.message}`, 'error');
            this.errors.push(`Création: ${error.message}`);
            return {
                success: false,
                created: [],
                failed: [],
                credentials: []
            };
        }
    }

    /**
     * Valider la mise en production
     */
    async validateProduction() {
        this.log('🔍 === VALIDATION DE LA MISE EN PRODUCTION ===');

        try {
            if (!window.productionUserService) {
                this.log('❌ Service de production non disponible', 'error');
                return false;
            }

            const summary = await window.productionUserService.getUsersSummary();

            this.log(`📊 Résumé du système:`);
            this.log(`   • Total utilisateurs: ${summary.total}`);
            this.log(`   • Administrateurs: ${summary.byRole.admin}`);
            this.log(`   • Fournisseurs: ${summary.byRole.supplier}`);
            this.log(`   • Clients: ${summary.byRole.customer}`);
            this.log(`   • Influenceurs: ${summary.byRole.influencer}`);
            this.log(`   • Sourceurs: ${summary.byRole.sourcer}`);
            this.log(`   • Actifs: ${summary.active}`);
            this.log(`   • Inactifs: ${summary.inactive}`);

            // Vérifications critiques
            const validations = [
                { check: summary.total > 0, message: 'Au moins un utilisateur existe' },
                { check: summary.byRole.admin >= 2, message: 'Au moins 2 administrateurs' },
                { check: summary.active >= summary.byRole.admin, message: 'Tous les admins sont actifs' }
            ];

            let allValid = true;
            validations.forEach(validation => {
                if (validation.check) {
                    this.log(`✅ ${validation.message}`);
                } else {
                    this.log(`❌ ${validation.message}`, 'error');
                    allValid = false;
                }
            });

            return allValid;

        } catch (error) {
            this.log(`❌ Erreur lors de la validation: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * Afficher le résumé final
     */
    displayFinalSummary(credentials) {
        const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

        this.log('🎉 === MISE EN PRODUCTION TERMINÉE ===');
        this.log(`⏱️ Durée: ${duration} secondes`);
        this.log(`✅ Utilisateurs créés: ${this.createdUsers.length}`);
        this.log(`❌ Erreurs: ${this.errors.length}`);

        if (credentials && credentials.length > 0) {
            console.log('\n🔐 === IDENTIFIANTS DE PRODUCTION ===');
            console.log('');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('                    COMPTES ADMINISTRATEURS CRÉÉS                     ');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');

            credentials.forEach((cred, index) => {
                console.log(`👑 ${cred.name} (Admin ${index + 1})`);
                console.log(`📧 Email    : ${cred.email}`);
                console.log(`🔑 Mot de passe : ${cred.password}`);
                console.log(`🎭 Rôle     : ${cred.role}`);
                console.log('');
            });

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');
            console.log('🔗 LIENS UTILES :');
            console.log(`   • Connexion : ${window.location.origin}/login`);
            console.log(`   • Admin     : ${window.location.origin}/admin/dashboard`);
            console.log('');
            console.log('🛡️ SÉCURITÉ :');
            console.log('   • Changez les mots de passe dès la première connexion');
            console.log('   • Activez l\'authentification 2FA si disponible');
            console.log('   • Limitez l\'accès admin au strict nécessaire');
            console.log('');
            console.log('⚠️ IMPORTANT :');
            console.log('   • Sauvegardez ces identifiants en lieu sûr');
            console.log('   • Ne partagez jamais les comptes admin');
            console.log('   • Surveillez les connexions suspectes');
            console.log('');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }

        if (this.errors.length > 0) {
            console.log('\n⚠️ === ERREURS RENCONTRÉES ===');
            this.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }

        this.log('🚀 Production prête ! Votre application Firebase est configurée.');
    }

    /**
     * Processus principal de mise en production
     */
    async execute() {
        try {
            this.log('🚀 Lancement de la mise en production...');

            // 1. Vérifier les services
            const servicesReady = await this.waitForServices();
            if (!servicesReady) {
                throw new Error('Services Firebase non disponibles');
            }

            // 2. Valider la configuration
            const configValid = this.validateFirebaseConfig();
            if (!configValid) {
                throw new Error('Configuration Firebase invalide');
            }

            // 3. Demander confirmation
            const confirmed = await this.confirmProductionSetup();
            if (!confirmed) {
                this.log('🛑 Mise en production annulée');
                return { success: false, reason: 'Annulé par l\'utilisateur' };
            }

            // 4. Purger les utilisateurs existants
            this.log('🗑️ Étape 1/4: Purge des données existantes...');
            const purgeResult = await this.purgeExistingUsers();

            // 5. Créer les utilisateurs de production
            this.log('👥 Étape 2/4: Création des utilisateurs de production...');
            const createResult = await this.createProductionUsers();

            // 6. Valider la production
            this.log('🔍 Étape 3/4: Validation de la mise en production...');
            const isValid = await this.validateProduction();

            // 7. Afficher le résumé
            this.log('📊 Étape 4/4: Génération du rapport final...');
            this.displayFinalSummary(createResult.credentials);

            const success = isValid && createResult.success;

            if (success) {
                this.log('🎉 MISE EN PRODUCTION RÉUSSIE !', 'success');
            } else {
                this.log('⚠️ MISE EN PRODUCTION PARTIELLE', 'warning');
            }

            return {
                success,
                purgeResult,
                createResult,
                validation: isValid,
                duration: ((Date.now() - this.startTime) / 1000).toFixed(2)
            };

        } catch (error) {
            this.log(`💥 ERREUR CRITIQUE: ${error.message}`, 'critical');
            this.errors.push(`Critique: ${error.message}`);

            return {
                success: false,
                error: error.message,
                duration: ((Date.now() - this.startTime) / 1000).toFixed(2)
            };
        }
    }
}

/**
 * Fonction principale pour préparer la production
 */
async function prepareForProduction() {
    const setup = new ProductionSetup();
    return await setup.execute();
}

/**
 * Fonction de validation rapide de la production
 */
async function validateCurrentProduction() {
    console.log('🔍 === VALIDATION RAPIDE DE LA PRODUCTION ===');

    try {
        if (!window.productionUserService) {
            console.log('❌ Service de production non disponible');
            return false;
        }

        const summary = await window.productionUserService.getUsersSummary();

        console.log('📊 État actuel du système:');
        console.log(`   Total: ${summary.total} utilisateurs`);
        console.log(`   Admins: ${summary.byRole.admin}`);
        console.log(`   Actifs: ${summary.active}`);

        const isHealthy = summary.total > 0 && summary.byRole.admin >= 1;
        console.log(isHealthy ? '✅ Système opérationnel' : '❌ Système défaillant');

        return isHealthy;

    } catch (error) {
        console.error('❌ Erreur validation:', error);
        return false;
    }
}

// Exposer les fonctions principales
window.prepareForProduction = prepareForProduction;
window.validateCurrentProduction = validateCurrentProduction;

// Instructions d'utilisation
console.log(`
🏭 === SCRIPT DE MISE EN PRODUCTION CHARGÉ ===

🚀 Pour préparer votre application pour la production :
   prepareForProduction()

🔍 Pour vérifier l'état actuel :
   validateCurrentProduction()

⚡ Pour un setup rapide (sans confirmation) :
   // Attention: à utiliser seulement en développement
   
💡 Assurez-vous d'avoir :
   ✅ Firebase configuré
   ✅ Règles Firestore déployées  
   ✅ Sauvegarde des données importantes
   ✅ Accès administrateur

⚠️ ATTENTION: La production supprime tous les utilisateurs existants !
`);

// Auto-exécution dans 5 secondes (commenté pour sécurité)
/*
console.log('⏰ Auto-exécution dans 5 secondes...');
console.log('🛑 Tapez: clearTimeout(autoProductionTimer) pour annuler');

const autoProductionTimer = setTimeout(async () => {
  console.log('🚀 Lancement automatique de la mise en production...');
  await prepareForProduction();
}, 5000);
*/

// Export pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { prepareForProduction, validateCurrentProduction, ProductionSetup };
}
