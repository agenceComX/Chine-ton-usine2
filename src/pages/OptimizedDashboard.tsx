import React, { Suspense, memo, useMemo } from 'react';
import { Users, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useOptimizedQuery } from '../hooks/useOptimizedSupabase';

// Lazy load des composants du dashboard
const StatCard = React.lazy(() => import('../components/dashboard/StatCard'));
const RecentActivity = React.lazy(() => import('../components/dashboard/RecentActivity'));
const UpcomingAppointments = React.lazy(() => import('../components/dashboard/UpcomingAppointments'));
const PendingQuotes = React.lazy(() => import('../components/dashboard/PendingQuotes'));
const ExchangeRates = React.lazy(() => import('../components/dashboard/ExchangeRates'));

// Composant de loading
const LoadingCard = memo(() => (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 animate-pulse">
        <div className="p-6">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
    </div>
));

const LoadingWidget = memo(() => (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 animate-pulse">
        <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
        </div>
    </div>
));

interface Company {
    id: string;
    status: string;
}

interface Quote {
    id: string;
    status: string;
}

interface Appointment {
    id: string;
    status: string;
}

interface Product {
    id: string;
}

const OptimizedDashboard: React.FC = memo(() => {
    const { t } = useLanguage();

    // Requêtes optimisées avec mise en cache
    const { data: companies } = useOptimizedQuery<Company>('companies', {
        filter: { status: 'active' },
        select: 'id, status',
        cacheKey: 'active-companies-count',
        cacheTTL: 60000 // 1 minute
    });

    const { data: quotes } = useOptimizedQuery<Quote>('quotes', {
        filter: { status: 'pending' },
        select: 'id, status',
        cacheKey: 'pending-quotes-count',
        cacheTTL: 30000 // 30 secondes
    });

    const { data: appointments } = useOptimizedQuery<Appointment>('appointments', {
        filter: { status: 'validated' },
        select: 'id, status',
        cacheKey: 'validated-appointments-count',
        cacheTTL: 60000 // 1 minute
    });

    const { data: products } = useOptimizedQuery<Product>('products', {
        select: 'id',
        cacheKey: 'products-count',
        cacheTTL: 300000 // 5 minutes
    });

    // Mémorisation des calculs
    const stats = useMemo(() => ({
        activeClientsCount: companies?.length || 0,
        productsCount: products?.length || 0,
        pendingQuotesCount: quotes?.length || 0,
        upcomingAppointmentsCount: appointments?.length || 0
    }), [companies, products, quotes, appointments]);

    const trends = useMemo(() => ({
        clientsTrend: { value: 12, isPositive: true },
        quotesTrend: { value: 5, isPositive: true },
        appointmentsTrend: { value: 2, isPositive: false }
    }), []);

    return (
        <div className="p-4 md:p-6 w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
                <p className="text-gray-600">{t('welcome')}, Ahmed!</p>
            </div>

            {/* Cards statistiques avec lazy loading */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
                <Suspense fallback={<LoadingCard />}>
                    <StatCard
                        title={t('clients')}
                        value={stats.activeClientsCount.toString()}
                        icon={<Users size={24} />}
                        trend={trends.clientsTrend}
                        color="blue"
                        link="/clients"
                    />
                </Suspense>

                <Suspense fallback={<LoadingCard />}>
                    <StatCard
                        title={t('products')}
                        value={stats.productsCount.toString()}
                        icon={<ShoppingBag size={24} />}
                        color="amber"
                        link="/products"
                    />
                </Suspense>

                <Suspense fallback={<LoadingCard />}>
                    <StatCard
                        title={t('pendingQuotes')}
                        value={stats.pendingQuotesCount.toString()}
                        icon={<DollarSign size={24} />}
                        trend={trends.quotesTrend}
                        color="green"
                        link="/quotes"
                    />
                </Suspense>

                <Suspense fallback={<LoadingCard />}>
                    <StatCard
                        title={t('upcomingAppointments')}
                        value={stats.upcomingAppointmentsCount.toString()}
                        icon={<Calendar size={24} />}
                        trend={trends.appointmentsTrend}
                        color="purple"
                        link="/appointments"
                    />
                </Suspense>
            </div>

            {/* Widgets principaux */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
                <div className="xl:col-span-1">
                    <Suspense fallback={<LoadingWidget />}>
                        <ExchangeRates />
                    </Suspense>
                </div>

                <div className="xl:col-span-1">
                    <Suspense fallback={<LoadingWidget />}>
                        <RecentActivity />
                    </Suspense>
                </div>

                <div className="xl:col-span-1">
                    <Suspense fallback={<LoadingWidget />}>
                        <UpcomingAppointments />
                    </Suspense>
                </div>
            </div>

            {/* Devis en attente */}
            <div className="mt-6">
                <Suspense fallback={<LoadingWidget />}>
                    <PendingQuotes />
                </Suspense>
            </div>
        </div>
    );
});

OptimizedDashboard.displayName = 'OptimizedDashboard';

export default OptimizedDashboard;
