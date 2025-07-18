import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Users, Star, TrendingUp, Shield, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HomePageFixed: React.FC = () => {
    const { t } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);
    const [visibleCards, setVisibleCards] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleCards(prev => prev < 6 ? prev + 1 : prev);
        }, 200);

        const timer = setTimeout(() => clearInterval(interval), 1200);
        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    const categories = [
        { name: t('homepage.categories.electronics'), icon: '📱', id: 'electronics', color: 'from-blue-500 to-cyan-500' },
        { name: t('homepage.categories.fashion'), icon: '👔', id: 'fashion', color: 'from-pink-500 to-rose-500' },
        { name: t('homepage.categories.home'), icon: '🏡', id: 'home', color: 'from-green-500 to-emerald-500' },
        { name: t('homepage.categories.beauty'), icon: '💄', id: 'beauty', color: 'from-purple-500 to-violet-500' },
        { name: t('homepage.categories.sports'), icon: '⚽', id: 'sports', color: 'from-orange-500 to-red-500' },
        { name: t('homepage.categories.automotive'), icon: '🚗', id: 'automotive', color: 'from-gray-500 to-slate-500' },
    ];

    const features = [
        {
            icon: Shield,
            title: t('homepage.benefits.payment.title'),
            description: t('homepage.benefits.payment.description'),
            color: 'text-green-600 dark:text-green-400'
        },
        {
            icon: Globe,
            title: t('homepage.benefits.delivery.title'),
            description: t('homepage.benefits.delivery.description'),
            color: 'text-blue-600 dark:text-blue-400'
        },
        {
            icon: Users,
            title: t('homepage.benefits.support.title'),
            description: t('homepage.benefits.support.description'),
            color: 'text-purple-600 dark:text-purple-400'
        },
        {
            icon: TrendingUp,
            title: t('homepage.benefits.payment.title'),
            description: t('homepage.benefits.payment.description'),
            color: 'text-orange-600 dark:text-orange-400'
        },
    ];

    const stats = [
        { value: '50,000+', label: t('homepage.stats.products'), icon: '📦' },
        { value: '1,200+', label: t('homepage.stats.suppliers'), icon: '🏭' },
        { value: '95%', label: t('homepage.stats.satisfaction'), icon: '⭐' },
        { value: '48h', label: t('homepage.stats.response'), icon: '⚡' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 animate-pulse"></div>

                <div className="relative container mx-auto px-4 py-16 lg:py-24">
                    <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {t('homepage.title')}
                            </span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            {t('homepage.hero.description')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                            >
                                <ShoppingBag className="w-6 h-6" />
                                {t('homepage.hero.cta')}
                            </Link>

                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                            >
                                <Search className="w-6 h-6" />
                                {t('register')}
                            </Link>
                        </div>

                        {/* Placeholder for future search */}
                        <div className="max-w-2xl mx-auto relative">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                                <input
                                    type="text"
                                    placeholder={t('homepage.hero.searchPlaceholder')}
                                    disabled
                                    className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-lg text-gray-500 dark:text-gray-400 shadow-lg transition-all duration-300 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white dark:bg-gray-800 shadow-xl border-y border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`text-center transition-all duration-500 ${visibleCards > index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="text-4xl mb-2">{stat.icon}</div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('homepage.categories.popular')}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        {t('homepage.categories.popularSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            to={`/category/${category.id}`}
                            className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${visibleCards > index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`}></div>
                            <div className="relative p-8 text-white">
                                <div className="text-6xl mb-4">{category.icon}</div>
                                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                <p className="opacity-90">Explorer</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white dark:bg-gray-800 shadow-xl">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('homepage.benefits.title')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            {t('homepage.how.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`text-center transition-all duration-500 ${visibleCards > index + 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                    }`}
                                style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                            >
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 ${feature.color}`}>
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        {t('homepage.final.title')}
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        {t('homepage.final.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                            <Star className="w-6 h-6" />
                            {t('homepage.final.button')}
                        </Link>

                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                        >
                            {t('login')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePageFixed;
