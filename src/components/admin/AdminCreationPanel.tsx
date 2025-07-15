import React, { useState } from 'react';
import { AdminCreationService, CreateAdminUserData } from '../../services/adminCreationService';
import Button from '../Button';
import { Eye, EyeOff, User, Mail, Lock, Shield } from 'lucide-react';

const AdminCreationPanel: React.FC = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [results, setResults] = useState<string>('');
    const [formData, setFormData] = useState<CreateAdminUserData>({
        email: 'admin@chinetonusine.com',
        password: 'admin123456',
        name: 'Administrateur Principal'
    });

    const handleInputChange = (field: keyof CreateAdminUserData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const createSingleAdmin = async () => {
        setIsCreating(true);
        setResults('');

        try {
            const result = await AdminCreationService.createNewAdminAccount(formData);

            if (result.success) {
                setResults(`✅ Succès: ${result.message}
                
📧 Email: ${formData.email}
🔑 Mot de passe: ${formData.password}
🆔 UID: ${result.uid || 'N/A'}

🎯 Prochaines étapes:
1. Déconnectez-vous de votre session actuelle
2. Connectez-vous avec ces identifiants
3. Vous devriez être redirigé vers /admin/dashboard`);
            } else {
                setResults(`❌ Erreur: ${result.message}`);
            }
        } catch (error: any) {
            setResults(`💥 Exception: ${error.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    const createDefaultAdmin = async () => {
        setIsCreating(true);
        setResults('');

        try {
            const result = await AdminCreationService.createDefaultAdminAccount();

            if (result.success && result.credentials) {
                setResults(`✅ Compte admin par défaut créé avec succès!

📧 Email: ${result.credentials.email}
🔑 Mot de passe: ${result.credentials.password}
🆔 UID: ${result.uid || 'N/A'}

🎯 Connexion:
1. Allez sur /login
2. Utilisez ces identifiants
3. Redirection automatique vers /admin/dashboard`);
            } else {
                setResults(`❌ Erreur: ${result.message}`);
            }
        } catch (error: any) {
            setResults(`💥 Exception: ${error.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    const createTestAdmins = async () => {
        setIsCreating(true);
        setResults('');

        try {
            const result = await AdminCreationService.createTestAdminAccounts();

            if (result.success && result.createdAccounts) {
                let message = `✅ ${result.createdAccounts.length} compte(s) admin créé(s):

`;
                result.createdAccounts.forEach((account, index) => {
                    message += `${index + 1}. 📧 ${account.email}
   🔑 Mot de passe: ${account.password}
   🆔 UID: ${account.uid}

`;
                });

                message += `🎯 Instructions:
1. Choisissez un compte ci-dessus
2. Déconnectez-vous
3. Connectez-vous avec l'email/mot de passe choisi
4. Vérifiez la redirection vers /admin/dashboard`;

                setResults(message);
            } else {
                setResults(`❌ Erreur: ${result.message}`);
            }
        } catch (error: any) {
            setResults(`💥 Exception: ${error.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                    Création de Compte Admin
                </h3>
            </div>

            {/* Formulaire de création personnalisée */}
            <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline h-4 w-4 mr-1" />
                        Email Admin
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="admin@chinetonusine.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline h-4 w-4 mr-1" />
                        Nom Complet
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nom de l'administrateur"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Lock className="inline h-4 w-4 mr-1" />
                        Mot de Passe
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Minimum 6 caractères"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-2 mb-4">
                <Button
                    onClick={createSingleAdmin}
                    disabled={isCreating}
                    variant="primary"
                >
                    {isCreating ? 'Création...' : 'Créer ce Compte Admin'}
                </Button>

                <Button
                    onClick={createDefaultAdmin}
                    disabled={isCreating}
                    variant="outline"
                >
                    {isCreating ? 'Création...' : 'Créer Admin Par Défaut'}
                </Button>

                <Button
                    onClick={createTestAdmins}
                    disabled={isCreating}
                    variant="secondary"
                >
                    {isCreating ? 'Création...' : 'Créer Plusieurs Admins Test'}
                </Button>
            </div>

            {/* Résultats */}
            {results && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Résultats :</h4>
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
                        {results}
                    </pre>
                </div>
            )}

            {/* Instructions */}
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <h4 className="font-medium text-green-900 mb-2">📋 Instructions :</h4>
                <ol className="text-sm text-green-800 space-y-1">
                    <li>1. <strong>Compte Par Défaut</strong> : Crée admin@chinetonusine.com / admin123456</li>
                    <li>2. <strong>Compte Personnalisé</strong> : Modifiez les champs puis créez</li>
                    <li>3. <strong>Comptes Test</strong> : Crée 3 comptes admin différents</li>
                    <li>4. <strong>Après création</strong> : Déconnectez-vous et reconnectez-vous</li>
                    <li>5. <strong>Vérification</strong> : Redirection automatique vers /admin/dashboard</li>
                </ol>
            </div>

            {/* Accès rapide console */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">🔧 Console (F12) :</h4>
                <div className="text-sm text-blue-800 space-y-1">
                    <div><code>await AdminCreation.createDefaultAdminAccount()</code></div>
                    <div><code>await AdminCreation.createTestAdminAccounts()</code></div>
                </div>
            </div>
        </div>
    );
};

export default AdminCreationPanel;
