import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    QueryDocumentSnapshot,
    DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

// Types pour les données influenceur
export interface Collaboration {
    id?: string;
    influencerId: string;
    brand: string;
    campaign: string;
    status: 'pending' | 'accepted' | 'completed' | 'rejected';
    startDate: string;
    endDate: string;
    budget: number;
    description: string;
    requirements: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface InfluencerProfile {
    id?: string;
    userId: string;
    name: string;
    email: string;
    avatar?: string;
    bio: string;
    followers: number;
    country: string;
    category: string;
    languages: string[];
    socialMedia: {
        instagram?: string;
        tiktok?: string;
        youtube?: string;
        twitter?: string;
    };
    pricing: {
        postPrice: number;
        storyPrice: number;
        reelPrice: number;
    };
    engagement: number;
    verified: boolean;
    stats: {
        totalViews: number;
        totalEngagement: number;
        totalClicks: number;
        totalEarnings: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface ReferralData {
    id?: string;
    influencerId: string;
    referralCode: string;
    referredUserId: string;
    referredUserEmail: string;
    status: 'active' | 'inactive';
    commission: number;
    joinDate: Date;
}

// Service pour les collaborations
export const collaborationService = {
    // Récupérer toutes les collaborations d'un influenceur
    async getCollaborationsByInfluencer(influencerId: string): Promise<Collaboration[]> {
        try {
            const q = query(
                collection(db, 'collaborations'),
                where('influencerId', '==', influencerId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
                updatedAt: doc.data().updatedAt.toDate()
            } as Collaboration));
        } catch (error) {
            console.error('Erreur lors de la récupération des collaborations:', error);
            throw error;
        }
    },

    // Créer une nouvelle collaboration
    async createCollaboration(collaboration: Omit<Collaboration, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const now = new Date();
            const docRef = await addDoc(collection(db, 'collaborations'), {
                ...collaboration,
                createdAt: now,
                updatedAt: now
            });
            return docRef.id;
        } catch (error) {
            console.error('Erreur lors de la création de la collaboration:', error);
            throw error;
        }
    },

    // Mettre à jour une collaboration
    async updateCollaboration(id: string, updates: Partial<Collaboration>): Promise<void> {
        try {
            const docRef = doc(db, 'collaborations', id);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la collaboration:', error);
            throw error;
        }
    },

    // Supprimer une collaboration
    async deleteCollaboration(id: string): Promise<void> {
        try {
            await deleteDoc(doc(db, 'collaborations', id));
        } catch (error) {
            console.error('Erreur lors de la suppression de la collaboration:', error);
            throw error;
        }
    }
};

// Service pour les profils influenceur
export const influencerService = {
    // Récupérer le profil d'un influenceur
    async getInfluencerProfile(userId: string): Promise<InfluencerProfile | null> {
        try {
            const q = query(
                collection(db, 'influencers'),
                where('userId', '==', userId)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) return null;

            const doc = querySnapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
                updatedAt: doc.data().updatedAt.toDate()
            } as InfluencerProfile;
        } catch (error) {
            console.error('Erreur lors de la récupération du profil influenceur:', error);
            throw error;
        }
    },

    // Créer un profil influenceur
    async createInfluencerProfile(profile: Omit<InfluencerProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const now = new Date();
            const docRef = await addDoc(collection(db, 'influencers'), {
                ...profile,
                createdAt: now,
                updatedAt: now
            });
            return docRef.id;
        } catch (error) {
            console.error('Erreur lors de la création du profil influenceur:', error);
            throw error;
        }
    },

    // Mettre à jour un profil influenceur
    async updateInfluencerProfile(id: string, updates: Partial<InfluencerProfile>): Promise<void> {
        try {
            const docRef = doc(db, 'influencers', id);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil influenceur:', error);
            throw error;
        }
    },

    // Rechercher des influenceurs avec filtres
    async searchInfluencers(filters: {
        category?: string;
        country?: string;
        minFollowers?: number;
        maxPrice?: number;
        verified?: boolean;
    }): Promise<InfluencerProfile[]> {
        try {
            let q = query(collection(db, 'influencers'));

            if (filters.category) {
                q = query(q, where('category', '==', filters.category));
            }
            if (filters.country) {
                q = query(q, where('country', '==', filters.country));
            }
            if (filters.minFollowers) {
                q = query(q, where('followers', '>=', filters.minFollowers));
            }
            if (filters.verified !== undefined) {
                q = query(q, where('verified', '==', filters.verified));
            }

            const querySnapshot = await getDocs(q);

            let results = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
                updatedAt: doc.data().updatedAt.toDate()
            } as InfluencerProfile));

            // Filtrer par prix maximum côté client (Firestore ne permet pas les requêtes sur des champs imbriqués)
            if (filters.maxPrice) {
                results = results.filter(profile => profile.pricing.postPrice <= filters.maxPrice!);
            }

            return results;
        } catch (error) {
            console.error('Erreur lors de la recherche d\'influenceurs:', error);
            throw error;
        }
    }
};

// Service pour le parrainage
export const referralService = {
    // Récupérer les filleuls d'un influenceur
    async getReferralsByInfluencer(influencerId: string): Promise<ReferralData[]> {
        try {
            const q = query(
                collection(db, 'referrals'),
                where('influencerId', '==', influencerId),
                orderBy('joinDate', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                joinDate: doc.data().joinDate.toDate()
            } as ReferralData));
        } catch (error) {
            console.error('Erreur lors de la récupération des filleuls:', error);
            throw error;
        }
    },

    // Créer un nouveau filleul
    async createReferral(referral: Omit<ReferralData, 'id' | 'joinDate'>): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, 'referrals'), {
                ...referral,
                joinDate: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Erreur lors de la création du filleul:', error);
            throw error;
        }
    },

    // Calculer les statistiques de parrainage
    async getReferralStats(influencerId: string): Promise<{
        totalReferrals: number;
        activeReferrals: number;
        totalCommissions: number;
        monthlyCommissions: number;
    }> {
        try {
            const referrals = await this.getReferralsByInfluencer(influencerId);

            const totalReferrals = referrals.length;
            const activeReferrals = referrals.filter(r => r.status === 'active').length;
            const totalCommissions = referrals.reduce((sum, r) => sum + r.commission, 0);

            // Calculer les commissions du mois en cours
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthlyCommissions = referrals
                .filter(r => r.joinDate >= startOfMonth)
                .reduce((sum, r) => sum + r.commission, 0);

            return {
                totalReferrals,
                activeReferrals,
                totalCommissions,
                monthlyCommissions
            };
        } catch (error) {
            console.error('Erreur lors du calcul des statistiques de parrainage:', error);
            throw error;
        }
    }
};
