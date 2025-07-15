import React, { memo, useState, useMemo } from 'react';
import { useOptimizedQuery, useDebouncedSearch } from '../hooks/useOptimizedSupabase';
import VirtualizedList from '../components/ui/VirtualizedList';
import OptimizedImage from '../components/ui/OptimizedImage';
import { Filter, Building2, Mail, Phone } from 'lucide-react';

// Interface pour les entreprises
interface Company {
    id: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    logo?: string;
    status: 'active' | 'inactive';
    created_at: string;
}

// Composant mémorisé pour chaque item de la liste
const CompanyItem = memo(({ company }: { company: Company }) => (
    <div className="flex items-center p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
        <div className="flex-shrink-0 w-12 h-12 mr-4">
            <OptimizedImage
                src={company.logo || '/company-placeholder.svg'}
                alt={`Logo ${company.name}`}
                className="w-full h-full rounded-full object-cover"
                loading="lazy"
                fallback="/company-error.svg"
            />
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                    {company.name}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${company.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                    {company.status}
                </span>
            </div>

            <div className="flex items-center mt-1 text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                    <Mail size={14} className="mr-1" />
                    <span className="truncate">{company.email}</span>
                </div>
                <div className="flex items-center">
                    <Phone size={14} className="mr-1" />
                    <span>{company.phone}</span>
                </div>
                <div className="flex items-center">
                    <Building2 size={14} className="mr-1" />
                    <span>{company.country}</span>
                </div>
            </div>
        </div>
    </div>
));

CompanyItem.displayName = 'CompanyItem';

// Composant principal optimisé
const OptimizedCompaniesPage: React.FC = memo(() => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Requête optimisée avec cache intelligent
    const { data: allCompanies, loading, isStale } = useOptimizedQuery<Company>('companies', {
        select: 'id, name, email, phone, country, logo, status, created_at',
        orderBy: { column: 'created_at', ascending: false },
        cacheKey: 'companies-list',
        cacheTTL: 300000, // 5 minutes
        enableRealtime: true
    });

    // Recherche avec debounce pour éviter trop de requêtes
    const { data: searchResults } = useDebouncedSearch<Company>(
        'companies',
        searchTerm,
        ['name', 'email', 'country'],
        300, // 300ms delay
        {
            select: 'id, name, email, phone, country, logo, status, created_at',
            cacheKey: `companies-search-${searchTerm}`,
            cacheTTL: 60000 // 1 minute pour les recherches
        }
    );

    // Filtrage mémorisé pour éviter les recalculs inutiles
    const filteredCompanies = useMemo(() => {
        let companies = searchTerm ? searchResults : allCompanies;

        if (!companies) return [];

        if (statusFilter !== 'all') {
            companies = companies.filter(company => company.status === statusFilter);
        }

        return companies;
    }, [allCompanies, searchResults, searchTerm, statusFilter]);

    // Statistiques mémorisées
    const stats = useMemo(() => {
        const total = filteredCompanies.length;
        const active = filteredCompanies.filter(c => c.status === 'active').length;
        const inactive = total - active;

        return { total, active, inactive };
    }, [filteredCompanies]);

    // Rendu des items pour la liste virtualisée
    const renderCompanyItem = ({ index, data }: { index: number; data: Company[] }) => (
        <CompanyItem company={data[index]} />
    );

    // Composant de filtres
    const FilterComponent = memo(() => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                </label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="all">Tous</option>
                    <option value="active">Actifs</option>
                    <option value="inactive">Inactifs</option>
                </select>
            </div>
        </div>
    ));

    if (loading && !allCompanies) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-3">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* En-tête avec statistiques */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Entreprises
                            {isStale && (
                                <span className="ml-2 text-sm text-amber-600">
                                    (Données en cache)
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {stats.total} entreprises • {stats.active} actives • {stats.inactive} inactives
                        </p>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Filter size={16} className="mr-2" />
                        Filtres
                    </button>
                </div>

                {/* Panneau de filtres */}
                {showFilters && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <FilterComponent />
                    </div>
                )}
            </div>

            {/* Liste virtualisée avec recherche intégrée */}
            <div className="bg-white rounded-lg shadow">
                <VirtualizedList
                    items={filteredCompanies}
                    height={600} // Hauteur fixe pour la virtualisation
                    itemHeight={88} // Hauteur de chaque item
                    renderItem={renderCompanyItem}
                    searchFields={['name', 'email', 'country']}
                    onSearch={setSearchTerm}
                    filterComponent={<FilterComponent />}
                    emptyMessage="Aucune entreprise trouvée"
                    loading={loading}
                />
            </div>

            {/* Indicateurs de performance (development only) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                        📊 Métriques de Performance
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-blue-700">Items rendus:</span>
                            <span className="ml-1 font-medium">{Math.min(filteredCompanies.length, 10)}</span>
                        </div>
                        <div>
                            <span className="text-blue-700">Total items:</span>
                            <span className="ml-1 font-medium">{filteredCompanies.length}</span>
                        </div>
                        <div>
                            <span className="text-blue-700">Cache:</span>
                            <span className="ml-1 font-medium">{isStale ? 'Stale' : 'Fresh'}</span>
                        </div>
                        <div>
                            <span className="text-blue-700">Temps de recherche:</span>
                            <span className="ml-1 font-medium">~300ms</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

OptimizedCompaniesPage.displayName = 'OptimizedCompaniesPage';

export default OptimizedCompaniesPage;
