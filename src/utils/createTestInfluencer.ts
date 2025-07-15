import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

// Script pour créer un utilisateur influenceur de test
export const createTestInfluencer = async () => {
    try {
        // Créer un utilisateur influenceur
        const testUser = {
            email: 'influencer@test.com',
            name: 'Marie Influenceuse',
            role: 'influencer',
            language: 'fr',
            currency: 'EUR',
            favorites: [],
            browsingHistory: [],
            messages: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            subscription: 'premium'
        };

        const userRef = await addDoc(collection(db, 'users'), testUser);
        console.log('Utilisateur influenceur créé:', userRef.id);

        // Créer le profil influenceur correspondant
        const influencerProfile = {
            userId: userRef.id,
            name: 'Marie Influenceuse',
            email: 'influencer@test.com',
            bio: 'Influenceuse mode et lifestyle avec une communauté engagée',
            followers: 250000,
            country: 'France',
            category: 'Mode & Beauté',
            languages: ['Français', 'Anglais'],
            socialMedia: {
                instagram: '@marie_influenceuse',
                tiktok: '@marie_lifestyle',
                youtube: 'Marie Lifestyle Channel'
            },
            pricing: {
                postPrice: 1500,
                storyPrice: 500,
                reelPrice: 1200
            },
            engagement: 4.2,
            verified: true,
            stats: {
                totalViews: 285600,
                totalEngagement: 4.2,
                totalClicks: 12480,
                totalEarnings: 18750
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const profileRef = await addDoc(collection(db, 'influencers'), influencerProfile);
        console.log('Profil influenceur créé:', profileRef.id);

        // Créer quelques collaborations de test
        const collaborations = [
            {
                influencerId: profileRef.id,
                brand: 'Nike',
                campaign: 'Nouvelle collection Air Max',
                status: 'accepted',
                startDate: '2024-07-15',
                endDate: '2024-08-15',
                budget: 5000,
                description: 'Promotion de la nouvelle collection Air Max sur Instagram',
                requirements: ['3 posts Instagram', '5 stories', 'Hashtag #NikeAirMax'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                influencerId: profileRef.id,
                brand: 'Samsung',
                campaign: 'Galaxy S24 Ultra',
                status: 'pending',
                startDate: '2024-08-01',
                endDate: '2024-08-31',
                budget: 8000,
                description: 'Test et présentation du nouveau Galaxy S24 Ultra',
                requirements: ['1 reel de déballage', '2 posts photo', '3 stories quotidiennes'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                influencerId: profileRef.id,
                brand: 'Adidas',
                campaign: 'Campagne été 2024',
                status: 'completed',
                startDate: '2024-06-01',
                endDate: '2024-06-30',
                budget: 3500,
                description: 'Promotion des vêtements de sport été Adidas',
                requirements: ['2 posts Instagram', '1 reel', 'Story permanente'],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        for (const collab of collaborations) {
            const collabRef = await addDoc(collection(db, 'collaborations'), collab);
            console.log('Collaboration créée:', collabRef.id);
        }

        // Créer quelques filleuls de test
        const referrals = [
            {
                influencerId: profileRef.id,
                referralCode: 'MARIE2024-ABC123',
                referredUserId: 'user123',
                referredUserEmail: 'marie.dubois@email.com',
                status: 'active',
                commission: 150,
                joinDate: new Date('2024-07-05')
            },
            {
                influencerId: profileRef.id,
                referralCode: 'MARIE2024-ABC123',
                referredUserId: 'user456',
                referredUserEmail: 'pierre.martin@email.com',
                status: 'active',
                commission: 120,
                joinDate: new Date('2024-07-03')
            },
            {
                influencerId: profileRef.id,
                referralCode: 'MARIE2024-ABC123',
                referredUserId: 'user789',
                referredUserEmail: 'sophie.laurent@email.com',
                status: 'inactive',
                commission: 80,
                joinDate: new Date('2024-06-28')
            }
        ];

        for (const referral of referrals) {
            const refRef = await addDoc(collection(db, 'referrals'), referral);
            console.log('Filleul créé:', refRef.id);
        }

        console.log('✅ Données influenceur de test créées avec succès !');

        return {
            userId: userRef.id,
            profileId: profileRef.id,
            credentials: {
                email: 'influencer@test.com',
                password: 'Test123!',
                role: 'influencer'
            }
        };

    } catch (error) {
        console.error('❌ Erreur lors de la création des données test:', error);
        throw error;
    }
};

// Exécuter le script si appelé directement
if (typeof window !== 'undefined') {
    // Ajouter une fonction globale pour exécuter depuis la console
    (window as any).createTestInfluencer = createTestInfluencer;
    console.log('💡 Exécutez createTestInfluencer() dans la console pour créer un utilisateur influenceur de test');
}
