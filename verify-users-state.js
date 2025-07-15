import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Configuration Firebase Admin SDK
const serviceAccountPath = './firebase-service-account.json';

/**
 * Initialise Firebase Admin SDK
 */
function initializeFirebaseAdmin() {
    try {
        if (admin.apps.length === 0) {
            let serviceAccount;

            try {
                serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
            } catch (error) {
                console.warn('⚠️  Fichier de service account non trouvé, utilisation de la configuration par défaut...');
                serviceAccount = {
                    type: "service_account",
                    project_id: "chine-ton-usine"
                };
            }

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: 'chine-ton-usine'
            });

            console.log('✅ Firebase Admin SDK initialisé');
        }

        return {
            auth: admin.auth(),
            firestore: admin.firestore()
        };

    } catch (error) {
        console.error('❌ Erreur initialisation Firebase Admin:', error.message);
        throw error;
    }
}

/**
 * Vérifie l'état de Firebase Authentication
 */
async function checkAuthenticationUsers(auth) {
    console.log('🔐 Vérification Firebase Authentication...');

    try {
        const users = [];
        let nextPageToken;
        let totalCount = 0;

        do {
            const result = await auth.listUsers(1000, nextPageToken);
            users.push(...result.users);
            totalCount += result.users.length;
            nextPageToken = result.pageToken;
        } while (nextPageToken);

        console.log(`📊 Total utilisateurs Authentication: ${totalCount}`);

        if (totalCount > 0) {
            console.log('\n👥 Liste des utilisateurs Authentication:');
            console.log('-'.repeat(80));

            users.forEach((user, index) => {
                console.log(`${index + 1}. 📧 ${user.email || 'Email non défini'}`);
                console.log(`   🆔 UID: ${user.uid}`);
                console.log(`   👤 Nom: ${user.displayName || 'Non défini'}`);
                console.log(`   ✅ Email vérifié: ${user.emailVerified ? 'Oui' : 'Non'}`);
                console.log(`   🕒 Créé: ${new Date(user.metadata.creationTime).toLocaleString('fr-FR')}`);
                console.log(`   🔄 Dernière connexion: ${user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString('fr-FR') : 'Jamais'}`);
                console.log(`   🔒 Actif: ${user.disabled ? 'Non' : 'Oui'}`);
                console.log('');
            });
        } else {
            console.log('ℹ️  Aucun utilisateur trouvé dans Authentication');
        }

        return { users, count: totalCount };

    } catch (error) {
        console.error('❌ Erreur vérification Authentication:', error.message);
        throw error;
    }
}

/**
 * Vérifie l'état de la collection Firestore users
 */
async function checkFirestoreUsers(firestore) {
    console.log('📄 Vérification collection Firestore users...');

    try {
        const snapshot = await firestore.collection('users').get();
        const docs = snapshot.docs;
        const totalCount = docs.length;

        console.log(`📊 Total documents Firestore: ${totalCount}`);

        if (totalCount > 0) {
            console.log('\n📋 Liste des documents Firestore:');
            console.log('-'.repeat(80));

            docs.forEach((doc, index) => {
                const data = doc.data();
                console.log(`${index + 1}. 🆔 ID Document: ${doc.id}`);
                console.log(`   📧 Email: ${data.email || 'Non défini'}`);
                console.log(`   👤 Nom: ${data.name || 'Non défini'}`);
                console.log(`   🏷️  Rôle: ${data.role || 'Non défini'}`);
                console.log(`   🏢 Entreprise: ${data.company || 'Non défini'}`);
                console.log(`   🌍 Langue: ${data.language || 'Non défini'}`);
                console.log(`   💰 Devise: ${data.currency || 'Non défini'}`);
                console.log(`   🔗 UID lié: ${data.uid || 'Non défini'}`);
                console.log(`   ✅ Actif: ${data.isActive ? 'Oui' : 'Non'}`);
                console.log(`   🕒 Créé: ${data.createdAt ? new Date(data.createdAt).toLocaleString('fr-FR') : 'Non défini'}`);
                console.log(`   🔄 Modifié: ${data.updatedAt ? new Date(data.updatedAt).toLocaleString('fr-FR') : 'Non défini'}`);
                console.log('');
            });
        } else {
            console.log('ℹ️  Aucun document trouvé dans la collection users');
        }

        return { docs, count: totalCount };

    } catch (error) {
        console.error('❌ Erreur vérification Firestore:', error.message);
        throw error;
    }
}

/**
 * Analyse la synchronisation entre Auth et Firestore
 */
function analyzeSynchronization(authUsers, firestoreDocs) {
    console.log('🔄 Analyse de la synchronisation Auth ↔ Firestore...');

    const authUIDs = new Set(authUsers.map(user => user.uid));
    const firestoreUIDs = new Set(firestoreDocs.map(doc => doc.data().uid).filter(uid => uid));

    // Utilisateurs Auth sans document Firestore
    const authOnly = authUsers.filter(user => !firestoreUIDs.has(user.uid));

    // Documents Firestore sans utilisateur Auth
    const firestoreOnly = firestoreDocs.filter(doc => {
        const uid = doc.data().uid;
        return uid && !authUIDs.has(uid);
    });

    // Utilisateurs synchronisés
    const synchronized = authUsers.filter(user => firestoreUIDs.has(user.uid));

    console.log('\n📊 RÉSULTATS DE SYNCHRONISATION:');
    console.log('-'.repeat(50));
    console.log(`✅ Utilisateurs synchronisés: ${synchronized.length}`);
    console.log(`⚠️  Auth seulement: ${authOnly.length}`);
    console.log(`⚠️  Firestore seulement: ${firestoreOnly.length}`);

    if (authOnly.length > 0) {
        console.log('\n🔐 Utilisateurs Auth sans document Firestore:');
        authOnly.forEach(user => {
            console.log(`   - ${user.email} (${user.uid})`);
        });
    }

    if (firestoreOnly.length > 0) {
        console.log('\n📄 Documents Firestore sans utilisateur Auth:');
        firestoreOnly.forEach(doc => {
            const data = doc.data();
            console.log(`   - ${data.email} (${data.uid})`);
        });
    }

    const isSynced = authOnly.length === 0 && firestoreOnly.length === 0;
    console.log(`\n🎯 Synchronisation parfaite: ${isSynced ? 'OUI ✅' : 'NON ⚠️'}`);

    return {
        synchronized: synchronized.length,
        authOnly: authOnly.length,
        firestoreOnly: firestoreOnly.length,
        isPerfectSync: isSynced
    };
}

/**
 * Vérifie la structure des documents Firestore
 */
function checkFirestoreStructure(firestoreDocs) {
    console.log('🏗️  Vérification de la structure Firestore...');

    const requiredFields = ['uid', 'name', 'email', 'role', 'company', 'language', 'currency', 'createdAt', 'isActive'];
    const optionalFields = ['updatedAt', 'preferences', 'profile', 'stats', 'favorites', 'messages', 'browsingHistory'];

    let structureScore = 0;
    const maxScore = firestoreDocs.length * requiredFields.length;

    console.log('\n📋 Analyse de la structure par document:');
    console.log('-'.repeat(60));

    firestoreDocs.forEach((doc, index) => {
        const data = doc.data();
        const missingFields = [];
        const presentOptional = [];

        // Vérifier les champs requis
        requiredFields.forEach(field => {
            if (data.hasOwnProperty(field) && data[field] !== null && data[field] !== undefined) {
                structureScore++;
            } else {
                missingFields.push(field);
            }
        });

        // Vérifier les champs optionnels
        optionalFields.forEach(field => {
            if (data.hasOwnProperty(field)) {
                presentOptional.push(field);
            }
        });

        console.log(`${index + 1}. 📧 ${data.email || 'Email manquant'}`);
        if (missingFields.length > 0) {
            console.log(`   ❌ Champs manquants: ${missingFields.join(', ')}`);
        } else {
            console.log(`   ✅ Tous les champs requis présents`);
        }
        if (presentOptional.length > 0) {
            console.log(`   ➕ Champs optionnels: ${presentOptional.join(', ')}`);
        }
        console.log('');
    });

    const structurePercentage = maxScore > 0 ? (structureScore / maxScore * 100).toFixed(1) : 0;
    console.log(`🎯 Score de structure: ${structureScore}/${maxScore} (${structurePercentage}%)`);

    return {
        score: structureScore,
        maxScore: maxScore,
        percentage: parseFloat(structurePercentage)
    };
}

/**
 * Fonction principale de vérification complète
 */
async function verifyUsersState() {
    console.log('🔍 VÉRIFICATION COMPLÈTE DES UTILISATEURS');
    console.log('='.repeat(60));
    console.log('🏭 Projet: chine-ton-usine');
    console.log('📊 Analyse: Authentication + Firestore + Synchronisation');
    console.log('🕒 Date: ' + new Date().toLocaleString('fr-FR'));

    try {
        // Initialisation
        const { auth, firestore } = initializeFirebaseAdmin();

        console.log('\n🚀 Début de la vérification...');

        // 1. Vérifier Firebase Authentication
        console.log('\n📱 ÉTAPE 1: Authentication');
        console.log('-'.repeat(40));
        const { users: authUsers, count: authCount } = await checkAuthenticationUsers(auth);

        // 2. Vérifier Firestore
        console.log('\n📄 ÉTAPE 2: Firestore');
        console.log('-'.repeat(40));
        const { docs: firestoreDocs, count: firestoreCount } = await checkFirestoreUsers(firestore);

        // 3. Analyser la synchronisation
        console.log('\n🔄 ÉTAPE 3: Synchronisation');
        console.log('-'.repeat(40));
        const syncResults = analyzeSynchronization(authUsers, firestoreDocs);

        // 4. Vérifier la structure Firestore
        console.log('\n🏗️  ÉTAPE 4: Structure');
        console.log('-'.repeat(40));
        const structureResults = checkFirestoreStructure(firestoreDocs);

        // Résumé final
        console.log('\n📊 RÉSUMÉ GLOBAL');
        console.log('='.repeat(50));
        console.log(`🔐 Utilisateurs Authentication: ${authCount}`);
        console.log(`📄 Documents Firestore: ${firestoreCount}`);
        console.log(`🔄 Synchronisation parfaite: ${syncResults.isPerfectSync ? 'OUI ✅' : 'NON ⚠️'}`);
        console.log(`🏗️  Structure complète: ${structureResults.percentage}%`);

        // État global
        const isProductionReady =
            authCount === 4 &&
            firestoreCount === 4 &&
            syncResults.isPerfectSync &&
            structureResults.percentage >= 90;

        console.log(`\n🎯 PRÊT POUR LA PRODUCTION: ${isProductionReady ? 'OUI ✅' : 'NON ⚠️'}`);

        if (isProductionReady) {
            console.log('\n🎉 EXCELLENT !');
            console.log('💡 Votre base d\'utilisateurs est parfaitement configurée');
            console.log('🚀 Vous pouvez passer en mode production');
        } else {
            console.log('\n📋 ACTIONS RECOMMANDÉES:');
            if (authCount !== 4) console.log('• Créer/ajuster les utilisateurs Authentication');
            if (firestoreCount !== 4) console.log('• Créer/ajuster les documents Firestore');
            if (!syncResults.isPerfectSync) console.log('• Synchroniser les données Auth ↔ Firestore');
            if (structureResults.percentage < 90) console.log('• Compléter la structure des documents');
        }

        console.log('\n🛠️  OUTILS DISPONIBLES:');
        console.log('• cleanup-all-users-admin.js - Nettoyage complet');
        console.log('• create-production-users-admin.js - Création utilisateurs');
        console.log('• npm run verify:users - Relancer cette vérification');

        return {
            auth: { count: authCount, users: authUsers },
            firestore: { count: firestoreCount, docs: firestoreDocs },
            sync: syncResults,
            structure: structureResults,
            productionReady: isProductionReady
        };

    } catch (error) {
        console.error('\n❌ ERREUR CRITIQUE:', error.message);
        console.error('📋 Stack trace:', error.stack);

        console.log('\n🔧 ACTIONS SUGGÉRÉES:');
        console.log('1. Vérifier les permissions Firebase Admin');
        console.log('2. Contrôler la connectivité internet');
        console.log('3. Vérifier la configuration du service account');

        process.exit(1);
    }
}

// Exécution du script
if (import.meta.url === `file://${process.argv[1]}`) {
    verifyUsersState()
        .then(() => {
            console.log('\n🏁 Vérification terminée avec succès');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Échec de la vérification:', error.message);
            process.exit(1);
        });
}

export { verifyUsersState };
