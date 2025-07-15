import React, { useState } from 'react';
import Button from '../Button';
import { Sparkles, Crown, Users, Zap, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { AdminCreationService } from '../../services/adminCreationService';

interface UltimateResult {
    success: boolean;
    deletedCount?: number;
    createdCount?: number;
    accounts?: any[];
    errors?: any[];
    error?: string;
}

const UltimateUserPanel: React.FC = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<string>('');
    const [ultimateResult, setUltimateResult] = useState<UltimateResult | null>(null);

    const runUltimateSystem = async () => {
        setIsRunning(true);
        setResults('🚀 Démarrage du système ultime...\n');
        setUltimateResult(null);

        try {
            // Vérifier que les services sont disponibles
            if (!(window as any).AdminCreationService) {
                throw new Error('Services Firebase non disponibles');
            }

            setResults(prev => prev + '✅ Services Firebase détectés\n');

            // Créer directement les comptes essentiels via le service
            const accounts = [
                {
                    email: 'admin@chinetonusine.com',
                    password: 'Admin123!',
                    name: 'Administrateur Principal',
                    role: 'admin'
                },
                {
                    email: 'admin2@chinetonusine.com',
                    password: 'Admin123!',
                    name: 'Administrateur Secondaire',
                    role: 'admin'
                },
                {
                    email: 'fournisseur@chinetonusine.com',
                    password: 'Fournisseur123!',
                    name: 'Fournisseur Test',
                    role: 'supplier'
                },
                {
                    email: 'client@chinetonusine.com',
                    password: 'Client123!',
                    name: 'Client Test',
                    role: 'customer'
                }
            ];

            const createdAccounts = [];
            let createdCount = 0;

            setResults(prev => prev + '\n👥 Création des comptes utilisateurs...\n');

            for (const accountData of accounts) {
                try {
                    setResults(prev => prev + `👤 Création: ${accountData.email} (${accountData.role})\n`);

                    const result = await AdminCreationService.createNewAdminAccount({
                        email: accountData.email,
                        password: accountData.password,
                        name: accountData.name
                    });

                    if (result.success) {
                        setResults(prev => prev + `✅ ${accountData.email} créé avec succès\n`);
                        createdAccounts.push({
                            ...accountData,
                            uid: result.uid,
                            success: true
                        });
                        createdCount++;
                    } else {
                        setResults(prev => prev + `⚠️ ${accountData.email}: ${result.message}\n`);

                        // Si le compte existe déjà, on l'ajoute à la liste
                        if (result.message.includes('already') || result.message.includes('existe')) {
                            createdAccounts.push({
                                ...accountData,
                                success: true,
                                existing: true
                            });
                        }
                    }

                    // Pause entre les créations
                    await new Promise(resolve => setTimeout(resolve, 800));

                } catch (error: any) {
                    setResults(prev => prev + `❌ Erreur ${accountData.email}: ${error.message}\n`);
                }
            }

            setResults(prev => prev + `\n🎉 Système configuré avec succès !\n`);
            setResults(prev => prev + `✅ ${createdCount} nouveaux comptes créés\n`);
            setResults(prev => prev + `📊 ${createdAccounts.length} comptes disponibles au total\n`);

            setUltimateResult({
                success: true,
                createdCount,
                accounts: createdAccounts
            });

        } catch (error: any) {
            setResults(prev => prev + `\n💥 Erreur: ${error.message}\n`);
            setUltimateResult({
                success: false,
                error: error.message
            });
        } finally {
            setIsRunning(false);
        }
    };

    const createAdminOnly = async () => {
        setIsRunning(true);
        setResults('👑 Création rapide de l\'admin principal...\n');

        try {
            const result = await AdminCreationService.createDefaultAdminAccount();

            if (result.success && result.credentials) {
                setResults(prev => prev + `✅ Admin créé avec succès !\n`);
                setResults(prev => prev + `📧 Email: ${result.credentials.email}\n`);
                setResults(prev => prev + `🔑 Mot de passe: ${result.credentials.password}\n`);

                setUltimateResult({
                    success: true,
                    createdCount: 1,
                    accounts: [{
                        email: result.credentials.email,
                        password: result.credentials.password,
                        name: 'Administrateur',
                        role: 'admin',
                        uid: result.uid
                    }]
                });
            } else {
                setResults(prev => prev + `⚠️ ${result.message}\n`);
                if (result.message.includes('already')) {
                    setResults(prev => prev + `💡 Le compte admin existe déjà !\n`);
                    setResults(prev => prev + `📧 Essayez: admin@chinetonusine.com\n`);
                    setResults(prev => prev + `🔑 Mot de passe: Admin123!\n`);
                }
            }
        } catch (error: any) {
            setResults(prev => prev + `❌ Erreur: ${error.message}\n`);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 mb-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-8 w-8 text-purple-500" />
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Système Ultime d'Utilisateurs
                    </h2>
                    <p className="text-gray-600 text-sm">Configuration automatique et intelligente</p>
                </div>
            </div>

            {/* Boutons d'action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button
                    onClick={runUltimateSystem}
                    disabled={isRunning}
                    className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                    <Sparkles className={`h-5 w-5 ${isRunning ? 'animate-spin' : ''}`} />
                    Système Complet
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Recommandé</span>
                </Button>

                <Button
                    onClick={createAdminOnly}
                    disabled={isRunning}
                    className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                    <Crown className="h-5 w-5" />
                    Admin Seulement
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Rapide</span>
                </Button>
            </div>

            {/* Fonctionnalités */}
            <div className="bg-white/70 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Le système complet configure automatiquement :
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>2 comptes administrateur</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Compte fournisseur test</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Compte client test</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Synchronisation Firebase</span>
                    </div>
                </div>
            </div>

            {/* Zone de résultats */}
            {results && (
                <div className="bg-gray-900 text-green-400 rounded-lg p-4 mb-6 font-mono text-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                        <span className="font-semibold">Journal d'exécution :</span>
                    </div>
                    <pre className="whitespace-pre-wrap overflow-x-auto">
                        {results}
                    </pre>
                </div>
            )}

            {/* Résultats du système ultime */}
            {ultimateResult && ultimateResult.success && ultimateResult.accounts && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                                🎉 Système configuré avec succès !
                                <span className="text-sm bg-green-100 px-2 py-1 rounded-full">
                                    {ultimateResult.accounts.length} comptes
                                </span>
                            </h3>

                            <div className="grid gap-3">
                                {ultimateResult.accounts.map((account: any, index: number) => (
                                    <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {account.role === 'admin' && <Crown className="h-4 w-4 text-yellow-500" />}
                                                    {account.role === 'supplier' && <Users className="h-4 w-4 text-blue-500" />}
                                                    {account.role === 'customer' && <Users className="h-4 w-4 text-green-500" />}
                                                    <span className="font-semibold text-sm">{account.role.toUpperCase()}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">{account.name}</div>
                                            </div>

                                            <div>
                                                <div className="font-semibold text-xs text-gray-500 mb-1">EMAIL</div>
                                                <div className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                                                    {account.email}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="font-semibold text-xs text-gray-500 mb-1">MOT DE PASSE</div>
                                                <div className="text-sm font-mono bg-yellow-50 px-2 py-1 rounded border">
                                                    {account.password}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="font-semibold text-xs text-gray-500 mb-1">STATUT</div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-xs text-green-600">
                                                        {account.existing ? 'Existant' : 'Nouveau'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-sm text-blue-800">
                                    <strong>🔗 Prochaines étapes :</strong>
                                    <br />
                                    1. Connectez-vous sur <code className="bg-blue-100 px-1 rounded">http://localhost:5174/login</code>
                                    <br />
                                    2. Utilisez un des comptes admin ci-dessus
                                    <br />
                                    3. Accédez au tableau de bord admin
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Erreur */}
            {ultimateResult && !ultimateResult.success && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-800">Erreur de configuration</h3>
                            <p className="text-red-600 text-sm mt-1">{ultimateResult.error}</p>
                            <p className="text-red-600 text-sm mt-2">
                                💡 Rechargez la page et réessayez, ou utilisez la console du navigateur.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UltimateUserPanel;
