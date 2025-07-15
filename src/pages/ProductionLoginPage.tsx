import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/ProductionAuthContext';
import { Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle, Shield } from 'lucide-react';

const getRedirectPath = (role: string) => {
    const paths = {
        admin: '/admin/dashboard',
        supplier: '/supplier/dashboard',
        customer: '/dashboard',
        sourcer: '/sourcer/dashboard',
        influencer: '/sourcer/dashboard'
    };
    return paths[role as keyof typeof paths] || '/dashboard';
};

const ProductionLoginPage: React.FC = () => {
    const { user, loading, login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Rediriger si déjà connecté
    if (user && !loading) {
        const redirectTo = getRedirectPath(user.role);
        return <Navigate to={redirectTo} replace />;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Nettoyer les messages d'erreur lors de la saisie
        if (error) setError('');
        if (success) setSuccess('');
    };

    const validateForm = () => {
        if (!formData.email.trim()) {
            setError('L\'adresse email est requise');
            return false;
        }

        if (!formData.email.includes('@')) {
            setError('Veuillez saisir une adresse email valide');
            return false;
        }

        if (!formData.password) {
            setError('Le mot de passe est requis');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await login(formData.email, formData.password);

            if (result.success && result.user) {
                setSuccess(`Connexion réussie ! Redirection vers ${result.user.role}...`);

                // Redirection automatique après un court délai
                setTimeout(() => {
                    window.location.href = result.redirectTo || getRedirectPath(result.user!.role);
                }, 1500);

            } else {
                setError(result.error || 'Erreur de connexion');
            }

        } catch (error: any) {
            console.error('Erreur connexion:', error);
            setError(error.message || 'Erreur de connexion inattendue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        alert(`Pour récupérer votre mot de passe, contactez l'administrateur à :

📧 support@chinetonusine.com
📞 +33 1 00 00 00 00

Précisez votre adresse email et votre demande sera traitée dans les plus brefs délais.`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Vérification de la session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* En-tête */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-full">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Connexion Sécurisée
                    </h2>
                    <p className="text-gray-600">
                        Accédez à votre espace Chine Ton Usine
                    </p>
                    <div className="mt-4 flex items-center justify-center text-sm text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Environnement de production sécurisé
                    </div>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Adresse email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50"
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50"
                                    placeholder="Votre mot de passe"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Messages d'erreur et de succès */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-medium text-red-800">Erreur de connexion</h3>
                                    <p className="text-sm text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-medium text-green-800">Connexion réussie</h3>
                                    <p className="text-sm text-green-700 mt-1">{success}</p>
                                </div>
                            </div>
                        )}

                        {/* Bouton de connexion */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Se connecter
                                </>
                            )}
                        </button>

                        {/* Mot de passe oublié */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={isLoading}
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 disabled:opacity-50"
                            >
                                Mot de passe oublié ?
                            </button>
                        </div>
                    </form>
                </div>

                {/* Informations de sécurité */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-800">Sécurité renforcée</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                Votre connexion est protégée par un chiffrement SSL et des règles de sécurité strictes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lien retour */}
                <div className="text-center">
                    <Link
                        to="/"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                        ← Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductionLoginPage;
