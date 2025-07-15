import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
    authDomain: "chine-ton-usine.firebaseapp.com",
    projectId: "chine-ton-usine",
    storageBucket: "chine-ton-usine.firebasestorage.app",
    messagingSenderId: "528021984213",
    appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
    measurementId: "G-23BQZPXP86"
};

// UIDs réels des utilisateurs existants (récupérés lors des tentatives précédentes)
const usersData = [
    {
        uid: 'V6CIjikHYpSWPQzpi6ZXj1TiKVv2', // fournisseur
        email: 'fournisseur@chinetonusine.com',
        role: 'supplier',
        name: 'Fournisseur Demo',
        company: 'Supplier Corp'
    },
    {
        uid: 'WxockA2qLMdxDEDdPp47B1nTYIn1', // client
        email: 'client@chinetonusine.com',
        role: 'customer',
        name: 'Client Demo',
        company: 'Client Corp'
    },
    {
        uid: '4wG4BrY2rYPh65hIn8ZXPKmMSUF3', // influenceur
        email: 'influenceur@chinetonusine.com',
        role: 'influencer',
        name: 'Influenceur Demo',
        company: 'Influence Agency'
    }
];

async function createFirestoreDocuments() {
    console.log('🔄 CRÉATION DIRECTE DES DOCUMENTS FIRESTORE');
    console.log('='.repeat(60));

    try {
        // Initialisation Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        console.log('✅ Firebase initialisé avec succès');
        console.log(`📝 ${usersData.length} documents à créer`);

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const userData of usersData) {
            try {
                console.log(`\n🔄 Création document: ${userData.email}`);

                // Création du document Firestore
                const firestoreData = {
                    email: userData.email,
                    role: userData.role,
                    name: userData.name,
                    company: userData.company,
                    isActive: true,
                    createdAt: new Date(),
                    lastLoginAt: null,
                    settings: {
                        notifications: true,
                        language: 'fr',
                        theme: 'light'
                    }
                };

                await setDoc(doc(db, 'users', userData.uid), firestoreData);
                console.log(`✅ Document créé: ${userData.email} (${userData.uid})`);
                successCount++;

            } catch (error) {
                console.error(`❌ Erreur pour ${userData.email}:`, error.message);
                errors.push(`${userData.email}: ${error.message}`);
                errorCount++;
            }
        }

        // Note pour l'admin - nous devons découvrir son UID
        console.log(`\n⚠️  NOTE: L'utilisateur admin@chinetonusine.com n'a pas pu être synchronisé`);
        console.log(`   car nous n'avons pas réussi à récupérer son UID.`);
        console.log(`   Il faudra le connecter manuellement une fois pour le synchroniser.`);

        // Résumé final
        console.log('\n' + '='.repeat(60));
        console.log('🎉 CRÉATION TERMINÉE');
        console.log('='.repeat(30));
        console.log(`✅ Succès: ${successCount}`);
        console.log(`❌ Échecs: ${errorCount}`);

        if (errors.length > 0) {
            console.log('\n❌ Détails des erreurs:');
            errors.forEach(error => console.log(`   - ${error}`));
        }

        console.log('\n💡 PROCHAINES ÉTAPES:');
        console.log('1. Vérifiez les utilisateurs: npm run users:verify');
        console.log('2. Connectez-vous manuellement avec admin@chinetonusine.com pour le synchroniser');
        console.log('3. Revenez aux règles de production: npm run rules:production');
        console.log('4. Testez votre application web');

        console.log('\n👋 Création terminée');

    } catch (error) {
        console.error('💥 Erreur critique:', error);
        process.exit(1);
    }
}

createFirestoreDocuments();
