import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

interface Collaboration {
    id: string;
    brand: string;
    campaign: string;
    status: 'pending' | 'accepted' | 'completed' | 'rejected';
    startDate: string;
    endDate: string;
    budget: number;
    description: string;
    requirements: string[];
}

const CollaborationsSection: React.FC = () => {
    const collaborations: Collaboration[] = [
        {
            id: '1',
            brand: 'Nike',
            campaign: 'Nouvelle collection Air Max',
            status: 'accepted',
            startDate: '2024-07-15',
            endDate: '2024-08-15',
            budget: 5000,
            description: 'Promotion de la nouvelle collection Air Max sur Instagram',
            requirements: ['3 posts Instagram', '5 stories', 'Hashtag #NikeAirMax']
        },
        {
            id: '2',
            brand: 'Samsung',
            campaign: 'Galaxy S24 Ultra',
            status: 'pending',
            startDate: '2024-08-01',
            endDate: '2024-08-31',
            budget: 8000,
            description: 'Test et présentation du nouveau Galaxy S24 Ultra',
            requirements: ['1 reel de déballage', '2 posts photo', '3 stories quotidiennes']
        },
        {
            id: '3',
            brand: 'Adidas',
            campaign: 'Campagne été 2024',
            status: 'completed',
            startDate: '2024-06-01',
            endDate: '2024-06-30',
            budget: 3500,
            description: 'Promotion des vêtements de sport été Adidas',
            requirements: ['2 posts Instagram', '1 reel', 'Story permanente']
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'accepted':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'pending':
                return <Clock className="text-yellow-500" size={20} />;
            case 'completed':
                return <CheckCircle className="text-blue-500" size={20} />;
            case 'rejected':
                return <XCircle className="text-red-500" size={20} />;
            default:
                return <Clock className="text-gray-500" size={20} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'accepted': return 'Accepté';
            case 'pending': return 'En attente';
            case 'completed': return 'Terminé';
            case 'rejected': return 'Refusé';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Mes collaborations
                </h2>
                <div className="flex gap-2">
                    {['pending', 'accepted', 'completed'].map((filter) => (
                        <button
                            key={filter}
                            className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                            {getStatusText(filter)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6">
                {collaborations.map((collab) => (
                    <div
                        key={collab.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {collab.brand}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(collab.status)}`}>
                                        {getStatusIcon(collab.status)}
                                        {getStatusText(collab.status)}
                                    </span>
                                </div>
                                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                                    {collab.campaign}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {collab.budget.toLocaleString()}€
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {collab.description}
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Période
                                </h4>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Calendar size={16} />
                                    <span>
                                        {new Date(collab.startDate).toLocaleDateString()} - {new Date(collab.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Exigences
                                </h4>
                                <div className="space-y-1">
                                    {collab.requirements.map((req, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            {req}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <Eye size={16} />
                                Voir détails
                            </button>
                            {collab.status === 'pending' && (
                                <>
                                    <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                                        Accepter
                                    </button>
                                    <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                                        Refuser
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CollaborationsSection;
