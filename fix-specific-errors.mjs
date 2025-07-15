#!/usr/bin/env node

/**
 * 🔧 CORRECTION DES ERREURS SPÉCIFIQUES
 * 
 * Script pour résoudre les erreurs auth/email-already-in-use
 * et les problèmes d'initialisation utilisateur
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

console.log('🔧 CORRECTION DES ERREURS SPÉCIFIQUES');
console.log('='.repeat(45));

async function fixSpecificErrors() {
    try {
        // Initialiser Firebase Admin
        if (admin.apps.length === 0) {
            const serviceAccount = JSON.parse(readFileSync('./firebase-service-account.json', 'utf8'));
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: serviceAccount.project_id
            });
        }

        const auth = admin.auth();
        const firestore = admin.firestore();

        console.log('📋 ANALYSE DES ERREURS DÉTECTÉES...\n');

        // 1. Problème auth/email-already-in-use
        console.log('1️⃣ CORRECTION auth/email-already-in-use');
        console.log('-'.repeat(40));

        console.log('❌ Erreur détectée: Tentative de création d\'un utilisateur existant');
        console.log('✅ Solution: Synchroniser l\'état Auth avec Firestore\n');

        // Vérifier tous les utilisateurs et leurs documents Firestore
        const authUsers = await auth.listUsers();
        console.log(`🔍 ${authUsers.users.length} utilisateurs Auth trouvés`);

        for (const user of authUsers.users) {
            console.log(`\n👤 Vérification: ${user.email}`);

            // Vérifier le document Firestore correspondant
            const userDoc = await firestore.collection('users').doc(user.uid).get();

            if (!userDoc.exists) {
                console.log(`⚠️  Document Firestore manquant pour ${user.email}`);
                console.log(`🔄 Création du document Firestore...`);

                // Créer le document manquant
                const userData = {
                    uid: user.uid,
                    name: user.displayName || 'Utilisateur',
                    email: user.email,
                    role: inferRoleFromEmail(user.email),
                    company: getCompanyFromRole(inferRoleFromEmail(user.email)),
                    language: 'fr',
                    currency: 'EUR',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isActive: true,
                    emailVerified: user.emailVerified,

                    // Structure future
                    favorites: [],
                    messages: [],
                    browsingHistory: [],

                    // Métadonnées de base
                    preferences: {
                        theme: 'light',
                        language: 'fr',
                        notifications: { email: true, push: true }
                    },

                    profile: {
                        avatar: null,
                        bio: null,
                        permissions: getPermissionsByRole(inferRoleFromEmail(user.email))
                    },

                    stats: {
                        lastLogin: null,
                        loginCount: 0,
                        accountCreated: new Date().toISOString()
                    }
                };

                await firestore.collection('users').doc(user.uid).set(userData, { merge: true });
                console.log(`✅ Document Firestore créé pour ${user.email}`);
            } else {
                console.log(`✅ Document Firestore OK pour ${user.email}`);
            }
        }

        // 2. Problème d'initialisation
        console.log('\n2️⃣ CORRECTION PROBLÈMES D\'INITIALISATION');
        console.log('-'.repeat(45));

        console.log('🔄 Nettoyage des états incohérents...');

        // Vérifier les documents Firestore orphelins
        const firestoreUsers = await firestore.collection('users').get();
        console.log(`🔍 ${firestoreUsers.size} documents Firestore trouvés`);

        for (const doc of firestoreUsers.docs) {
            const data = doc.data();

            try {
                await auth.getUser(doc.id);
                console.log(`✅ Cohérence OK: ${data.email}`);
            } catch (error) {
                if (error.code === 'auth/user-not-found') {
                    console.log(`⚠️  Document Firestore orphelin: ${data.email}`);
                    console.log(`🗑️  Suppression du document orphelin...`);
                    await doc.ref.delete();
                    console.log(`✅ Document orphelin supprimé`);
                }
            }
        }

        // 3. Créer un token de test pour vérification
        console.log('\n3️⃣ GÉNÉRATION TOKEN DE TEST');
        console.log('-'.repeat(30));

        try {
            const supplierUser = await auth.getUserByEmail('supplier@chine-ton-usine.com');
            const customToken = await auth.createCustomToken(supplierUser.uid);
            console.log(`✅ Token de test généré pour supplier (longueur: ${customToken.length})`);
            console.log(`🔑 UID: ${supplierUser.uid}`);
        } catch (error) {
            console.log(`❌ Erreur génération token: ${error.message}`);
        }

        // 4. Vérification finale
        console.log('\n4️⃣ VÉRIFICATION FINALE');
        console.log('-'.repeat(25));

        const finalAuthUsers = await auth.listUsers();
        const finalFirestoreUsers = await firestore.collection('users').get();

        console.log(`📊 Auth: ${finalAuthUsers.users.length} utilisateurs`);
        console.log(`📊 Firestore: ${finalFirestoreUsers.size} documents`);

        if (finalAuthUsers.users.length === finalFirestoreUsers.size) {
            console.log('✅ Synchronisation Auth/Firestore OK');
        } else {
            console.log('❌ Désynchronisation détectée');
        }

        // 5. Instructions spécifiques pour l'application
        console.log('\n5️⃣ INSTRUCTIONS POUR L\'APPLICATION');
        console.log('-'.repeat(40));

        console.log('🔧 Corrections à appliquer dans votre application:');
        console.log('');
        console.log('1. Redémarrer le serveur de développement:');
        console.log('   Ctrl+C puis npm run dev');
        console.log('');
        console.log('2. Vider le localStorage du navigateur:');
        console.log('   F12 > Console > localStorage.clear()');
        console.log('');
        console.log('3. Tester avec un utilisateur spécifique:');
        console.log('   Email: admin@chine-ton-usine.com');
        console.log('   Password: AdminSecure2024!');
        console.log('');
        console.log('4. Si erreur persist, essayer:');
        console.log('   - Autre navigateur (Chrome/Edge)');
        console.log('   - Mode incognito/privé');
        console.log('   - Désactiver tous les bloqueurs');

        console.log('\n✅ CORRECTIONS APPLIQUÉES !');
        console.log('Testez maintenant la connexion dans votre application.');

    } catch (error) {
        console.error('\n❌ ERREUR LORS DE LA CORRECTION:', error.message);
        console.error('Stack:', error.stack);
    }
}

function inferRoleFromEmail(email) {
    if (email.includes('admin')) return 'admin';
    if (email.includes('supplier')) return 'supplier';
    if (email.includes('client')) return 'client';
    if (email.includes('influencer')) return 'influencer';
    return 'client'; // par défaut
}

function getCompanyFromRole(role) {
    const companies = {
        admin: 'Chine Ton Usine',
        supplier: 'Guangzhou Manufacturing Co.',
        client: 'Entreprise France SAS',
        influencer: 'Digital Marketing Pro'
    };
    return companies[role] || 'Entreprise';
}

function getPermissionsByRole(role) {
    const permissions = {
        admin: ['read', 'write', 'delete', 'admin', 'manage_users', 'system_config'],
        supplier: ['read', 'write', 'manage_products'],
        client: ['read', 'write', 'place_orders'],
        influencer: ['read', 'write', 'create_content']
    };
    return permissions[role] || ['read'];
}

fixSpecificErrors();
