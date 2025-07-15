#!/usr/bin/env node

/**
 * 🔧 VERSION DEBUG - CRÉATION DES UTILISATEURS
 * 
 * Version simplifiée pour diagnostiquer les problèmes
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

console.log('🔧 CRÉATION DES UTILISATEURS - VERSION DEBUG');
console.log('='.repeat(50));

// Données simplifiées des utilisateurs
const USERS = [
    {
        email: 'admin@chine-ton-usine.com',
        password: 'AdminSecure2024!',
        name: 'Administrateur Principal',
        role: 'admin',
        company: 'Chine Ton Usine',
        language: 'fr',
        currency: 'EUR'
    },
    {
        email: 'supplier@chine-ton-usine.com',
        password: 'SupplierSecure2024!',
        name: 'Fournisseur Principal',
        role: 'supplier',
        company: 'Guangzhou Manufacturing Co.',
        language: 'fr',
        currency: 'CNY'
    },
    {
        email: 'client@chine-ton-usine.com',
        password: 'ClientSecure2024!',
        name: 'Client Premium',
        role: 'client',
        company: 'Entreprise France SAS',
        language: 'fr',
        currency: 'EUR'
    },
    {
        email: 'influencer@chine-ton-usine.com',
        password: 'InfluencerSecure2024!',
        name: 'Influenceur Business',
        role: 'influencer',
        company: 'Digital Marketing Pro',
        language: 'fr',
        currency: 'EUR'
    }
];

async function createUsers() {
    try {
        console.log('🔐 Initialisation Firebase Admin...');

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

        console.log('✅ Firebase Admin initialisé');

        let successCount = 0;

        // Créer chaque utilisateur
        for (const userData of USERS) {
            try {
                console.log(`\n👤 Création: ${userData.name}`);
                console.log(`📧 Email: ${userData.email}`);

                // Vérifier si l'utilisateur existe
                let userRecord;
                try {
                    userRecord = await auth.getUserByEmail(userData.email);
                    console.log(`ℹ️  Utilisateur existe déjà (UID: ${userRecord.uid})`);
                } catch (error) {
                    if (error.code === 'auth/user-not-found') {
                        // Créer l'utilisateur
                        userRecord = await auth.createUser({
                            email: userData.email,
                            password: userData.password,
                            displayName: userData.name,
                            emailVerified: true,
                            disabled: false
                        });
                        console.log(`✅ Utilisateur Auth créé (UID: ${userRecord.uid})`);
                    } else {
                        throw error;
                    }
                }

                // Créer le document Firestore
                const now = new Date().toISOString();
                const userDoc = {
                    uid: userRecord.uid,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    company: userData.company,
                    language: userData.language,
                    currency: userData.currency,
                    createdAt: now,
                    updatedAt: now,
                    isActive: true,
                    emailVerified: true,

                    // Structure future
                    favorites: [],
                    messages: [],
                    browsingHistory: [],

                    // Métadonnées de base
                    preferences: {
                        theme: 'light',
                        language: userData.language,
                        notifications: { email: true, push: true }
                    },

                    // Profil simple selon le rôle
                    profile: {
                        avatar: null,
                        bio: null,
                        permissions: getPermissionsByRole(userData.role)
                    },

                    stats: {
                        lastLogin: null,
                        loginCount: 0,
                        accountCreated: now
                    }
                };

                // Sauvegarder dans Firestore
                await firestore.collection('users').doc(userRecord.uid).set(userDoc, { merge: true });
                console.log(`✅ Document Firestore créé/mis à jour`);

                successCount++;

                // Pause courte
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`❌ Erreur pour ${userData.email}:`, error.message);
            }
        }

        // Résumé final
        console.log('\n📊 RÉSUMÉ FINAL');
        console.log('='.repeat(30));
        console.log(`✅ Utilisateurs créés: ${successCount}/${USERS.length}`);

        if (successCount > 0) {
            console.log('\n🔑 IDENTIFIANTS DE CONNEXION:');
            USERS.forEach(user => {
                console.log(`👤 ${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
            });
            console.log('\n⚠️  IMPORTANT: Changez ces mots de passe en production !');
        }

        console.log('\n🎉 CRÉATION TERMINÉE !');

    } catch (error) {
        console.error('\n❌ ERREUR CRITIQUE:', error.message);
        console.error('Stack:', error.stack);
    }
}

function getPermissionsByRole(role) {
    switch (role) {
        case 'admin':
            return ['read', 'write', 'delete', 'admin', 'manage_users', 'system_config'];
        case 'supplier':
            return ['read', 'write', 'manage_products'];
        case 'client':
            return ['read', 'write', 'place_orders'];
        case 'influencer':
            return ['read', 'write', 'create_content'];
        default:
            return ['read'];
    }
}

// Exécution
createUsers();
