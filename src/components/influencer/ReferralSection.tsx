import React, { useState } from 'react';
import { Copy, Users, DollarSign, Share2, Gift, TrendingUp } from 'lucide-react';
import { useToast } from '../ToastNotification';

interface Referral {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    status: 'active' | 'inactive';
    commission: number;
}

const ReferralSection: React.FC = () => {
    const [referralCode] = useState('INFLU2024-ABC123');
    const [referralLink] = useState('https://chinetousine.com/register?ref=INFLU2024-ABC123');
    const { showToast } = useToast();

    const stats = {
        totalReferrals: 24,
        activeReferrals: 18,
        totalCommissions: 2450,
        monthlyCommissions: 680
    };

    const recentReferrals: Referral[] = [
        {
            id: '1',
            name: 'Marie Dubois',
            email: 'marie.dubois@email.com',
            joinDate: '2024-07-05',
            status: 'active',
            commission: 150
        },
        {
            id: '2',
            name: 'Pierre Martin',
            email: 'pierre.martin@email.com',
            joinDate: '2024-07-03',
            status: 'active',
            commission: 120
        },
        {
            id: '3',
            name: 'Sophie Laurent',
            email: 'sophie.laurent@email.com',
            joinDate: '2024-06-28',
            status: 'inactive',
            commission: 80
        }
    ];

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        showToast(`${type} copié dans le presse-papier !`, 'success');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Programme de parrainage
                </h2>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <TrendingUp size={20} />
                    <span className="font-medium">+15% ce mois</span>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-blue-500" size={24} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total filleuls</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalReferrals}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-green-500" size={24} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Filleuls actifs</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.activeReferrals}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="text-purple-500" size={24} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Gains totaux</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalCommissions.toLocaleString()}€
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="text-orange-500" size={24} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Ce mois</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.monthlyCommissions.toLocaleString()}€
                    </div>
                </div>
            </div>

            {/* Lien de parrainage */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-4">
                    <Gift className="text-blue-600 dark:text-blue-400" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Votre lien de parrainage
                    </h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Code de parrainage
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={referralCode}
                                readOnly
                                className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                            />
                            <button
                                onClick={() => copyToClipboard(referralCode, 'Code')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Copy size={16} />
                                Copier
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Lien de parrainage
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={referralLink}
                                readOnly
                                className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
                            />
                            <button
                                onClick={() => copyToClipboard(referralLink, 'Lien')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Copy size={16} />
                                Copier
                            </button>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                                <Share2 size={16} />
                                Partager
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des filleuls récents */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Filleuls récents
                </h3>

                <div className="space-y-3">
                    {recentReferrals.map((referral) => (
                        <div
                            key={referral.id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium">
                                        {referral.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {referral.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {referral.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Rejoint le {new Date(referral.joinDate).toLocaleDateString()}
                                    </p>
                                    <p className="font-medium text-green-600 dark:text-green-400">
                                        +{referral.commission}€
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${referral.status === 'active'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                    }`}>
                                    {referral.status === 'active' ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReferralSection;
