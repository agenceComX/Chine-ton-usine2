import React from 'react';
import { Eye, TrendingUp, Users, MousePointer, DollarSign, Calendar } from 'lucide-react';

const StatsSection: React.FC = () => {
    // Données pour les graphiques
    const viewsData = [
        { month: 'Jan', views: 12500 },
        { month: 'Fév', views: 15200 },
        { month: 'Mar', views: 18900 },
        { month: 'Avr', views: 22100 },
        { month: 'Mai', views: 25800 },
        { month: 'Juin', views: 28300 },
        { month: 'Juil', views: 32100 }
    ];

    const engagementData = [
        { platform: 'Instagram', engagement: 4.2 },
        { platform: 'TikTok', engagement: 6.8 },
        { platform: 'YouTube', engagement: 3.1 },
        { platform: 'Twitter', engagement: 2.9 }
    ];

    const trafficSources = [
        { name: 'Instagram', value: 45, color: '#E1306C' },
        { name: 'TikTok', value: 30, color: '#000000' },
        { name: 'YouTube', value: 15, color: '#FF0000' },
        { name: 'Direct', value: 10, color: '#3B82F6' }
    ];

    const stats = {
        totalViews: 285600,
        totalEngagement: 4.2,
        totalClicks: 12480,
        totalEarnings: 18750,
        growthRate: 15.3,
        activeCollaborations: 8
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Statistiques
                </h2>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <TrendingUp size={20} />
                    <span className="font-medium">+{stats.growthRate}% ce mois</span>
                </div>
            </div>

            {/* KPIs principaux */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <Eye className="text-blue-500" size={24} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Vues totales</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalViews.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        +12% vs mois dernier
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="text-green-500" size={24} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Engagement</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalEngagement}%
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        +0.8% vs mois dernier
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <MousePointer className="text-purple-500" size={24} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Clics</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalClicks.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        +25% vs mois dernier
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="text-orange-500" size={24} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Gains</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalEarnings.toLocaleString()}€
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        +18% vs mois dernier
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-pink-500" size={24} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Collaborations</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.activeCollaborations}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Actives
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="text-indigo-500" size={24} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Croissance</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        +{stats.growthRate}%
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Ce mois
                    </div>
                </div>
            </div>

            {/* Graphiques simplifiés */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Évolution des vues */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Évolution des vues (7 derniers mois)
                    </h3>
                    <div className="space-y-3">
                        {viewsData.map((data, index) => (
                            <div key={data.month} className="flex items-center gap-4">
                                <div className="w-8 text-sm text-gray-600 dark:text-gray-400">
                                    {data.month}
                                </div>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                                    <div
                                        className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                                        style={{ width: `${(data.views / 35000) * 100}%` }}
                                    >
                                        <span className="text-white text-xs font-medium">
                                            {data.views.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Taux d'engagement par plateforme */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Taux d'engagement par plateforme
                    </h3>
                    <div className="space-y-4">
                        {engagementData.map((data, index) => (
                            <div key={data.platform} className="flex items-center gap-4">
                                <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                                    {data.platform}
                                </div>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative">
                                    <div
                                        className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-3"
                                        style={{ width: `${(data.engagement / 8) * 100}%` }}
                                    >
                                        <span className="text-white text-sm font-medium">
                                            {data.engagement}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sources de trafic */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Sources de trafic
                    </h3>
                    <div className="space-y-3">
                        {trafficSources.map((source, index) => (
                            <div key={source.name} className="flex items-center gap-4">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: source.color }}
                                ></div>
                                <div className="flex-1 flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">{source.name}</span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {source.value}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Graphique en barres circulaires */}
                    <div className="mt-6 relative w-32 h-32 mx-auto">
                        {trafficSources.map((source, index) => {
                            const circumference = 2 * Math.PI * 45;
                            const strokeDasharray = `${(source.value / 100) * circumference} ${circumference}`;
                            const rotation = index * 90;

                            return (
                                <svg
                                    key={source.name}
                                    className="absolute inset-0 w-32 h-32 transform -rotate-90"
                                    style={{ transform: `rotate(${rotation - 90}deg)` }}
                                >
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="45"
                                        stroke={source.color}
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={strokeDasharray}
                                        strokeLinecap="round"
                                        className="opacity-80"
                                    />
                                </svg>
                            );
                        })}
                    </div>
                </div>

                {/* Performances récentes */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Performances récentes
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Post Instagram Nike</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Il y a 2 jours</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600 dark:text-green-400">45.2K vues</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">6.8% engagement</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Story Samsung</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Il y a 5 jours</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600 dark:text-green-400">23.1K vues</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">4.2% engagement</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Lien parrainage</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Cette semaine</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-blue-600 dark:text-blue-400">1.2K clics</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">3 conversions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsSection;
