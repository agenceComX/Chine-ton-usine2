import { useState, useEffect } from 'react';
import {
    collaborationService,
    influencerService,
    referralService,
    Collaboration,
    InfluencerProfile,
    ReferralData
} from '../services/influencerService';
import { useAuth } from '../context/AuthContext';

// Hook pour les collaborations
export const useCollaborations = () => {
    const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCollaborations = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);

                // Récupérer d'abord le profil influenceur pour avoir l'ID
                const profile = await influencerService.getInfluencerProfile(user.id);
                if (profile) {
                    const data = await collaborationService.getCollaborationsByInfluencer(profile.id!);
                    setCollaborations(data);
                } else {
                    setCollaborations([]);
                }
            } catch (err) {
                console.error('Erreur lors du chargement des collaborations:', err);
                setError('Erreur lors du chargement des collaborations');
                setCollaborations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCollaborations();
    }, [user]);

    const updateCollaborationStatus = async (id: string, status: Collaboration['status']) => {
        try {
            await collaborationService.updateCollaboration(id, { status });
            setCollaborations(prev =>
                prev.map(collab =>
                    collab.id === id ? { ...collab, status } : collab
                )
            );
        } catch (err) {
            console.error('Erreur lors de la mise à jour:', err);
            throw err;
        }
    };

    return {
        collaborations,
        loading,
        error,
        updateCollaborationStatus,
        refetch: () => {
            if (user) {
                const fetchCollaborations = async () => {
                    const profile = await influencerService.getInfluencerProfile(user.id);
                    if (profile) {
                        const data = await collaborationService.getCollaborationsByInfluencer(profile.id!);
                        setCollaborations(data);
                    }
                };
                fetchCollaborations();
            }
        }
    };
};

// Hook pour le profil influenceur
export const useInfluencerProfile = () => {
    const [profile, setProfile] = useState<InfluencerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);

                const data = await influencerService.getInfluencerProfile(user.id);
                setProfile(data);
            } catch (err) {
                console.error('Erreur lors du chargement du profil:', err);
                setError('Erreur lors du chargement du profil');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const updateProfile = async (updates: Partial<InfluencerProfile>) => {
        if (!profile?.id) return;

        try {
            await influencerService.updateInfluencerProfile(profile.id, updates);
            setProfile(prev => prev ? { ...prev, ...updates } : null);
        } catch (err) {
            console.error('Erreur lors de la mise à jour du profil:', err);
            throw err;
        }
    };

    return {
        profile,
        loading,
        error,
        updateProfile
    };
};

// Hook pour le parrainage
export const useReferrals = () => {
    const [referrals, setReferrals] = useState<ReferralData[]>([]);
    const [stats, setStats] = useState({
        totalReferrals: 0,
        activeReferrals: 0,
        totalCommissions: 0,
        monthlyCommissions: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchReferrals = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);

                // Récupérer d'abord le profil influenceur pour avoir l'ID
                const profile = await influencerService.getInfluencerProfile(user.id);
                if (profile) {
                    const [referralsData, statsData] = await Promise.all([
                        referralService.getReferralsByInfluencer(profile.id!),
                        referralService.getReferralStats(profile.id!)
                    ]);

                    setReferrals(referralsData);
                    setStats(statsData);
                } else {
                    setReferrals([]);
                    setStats({
                        totalReferrals: 0,
                        activeReferrals: 0,
                        totalCommissions: 0,
                        monthlyCommissions: 0
                    });
                }
            } catch (err) {
                console.error('Erreur lors du chargement des filleuls:', err);
                setError('Erreur lors du chargement des filleuls');
            } finally {
                setLoading(false);
            }
        };

        fetchReferrals();
    }, [user]);

    return {
        referrals,
        stats,
        loading,
        error
    };
};

// Hook pour la recherche d'influenceurs
export const useInfluencerSearch = () => {
    const [influencers, setInfluencers] = useState<InfluencerProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchInfluencers = async (filters: {
        category?: string;
        country?: string;
        minFollowers?: number;
        maxPrice?: number;
        verified?: boolean;
    }) => {
        try {
            setLoading(true);
            setError(null);

            const data = await influencerService.searchInfluencers(filters);
            setInfluencers(data);
        } catch (err) {
            console.error('Erreur lors de la recherche:', err);
            setError('Erreur lors de la recherche');
            setInfluencers([]);
        } finally {
            setLoading(false);
        }
    };

    return {
        influencers,
        loading,
        error,
        searchInfluencers
    };
};
