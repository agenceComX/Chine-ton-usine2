import React, { useState } from 'react';
import Button from '../Button';
import { Trash2, Users, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { AdminCreationService } from '../../services/adminCreationService';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';

interface UserAccount {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'supplier' | 'customer' | 'sourcer';
}

const UserResetPanel: React.FC = () => {
    const [isResetting, setIsResetting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [results, setResults] = useState<string>('');
    const [createdAccounts, setCreatedAccounts] = useState<UserAccount[]>([]);

    const defaultUsers: UserAccount[] = [
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
        },
        {
            email: 'sourcer@chinetonusine.com',
            password: 'Sourcer123!',
            name: 'Sourcer Test',
            role: 'sourcer'
        }
    ];

    const deleteAllUsers = async () => {
        setIsDeleting(true);
        setResults('🗑️ Suppression de tous les utilisateurs...\n');

        try {
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);

            setResults(prev => prev + `📊 ${usersSnapshot.size} utilisateur(s) trouvé(s)\n`);

            if (usersSnapshot.size === 0) {
                setResults(prev => prev + 'ℹ️ Aucun utilisateur à supprimer\n');
                return { success: true, deletedCount: 0 };
            }

            const deletePromises: Promise<void>[] = [];
            usersSnapshot.forEach((userDoc) => {
                setResults(prev => prev + `🗑️ Suppression: ${userDoc.data().email}\n`);
                deletePromises.push(deleteDoc(doc(db, 'users', userDoc.id)));
            });

            await Promise.all(deletePromises);

            setResults(prev => prev + `✅ ${usersSnapshot.size} utilisateur(s) supprimé(s)\n`);

            return { success: true, deletedCount: usersSnapshot.size };

        } catch (error: any) {
            setResults(prev => prev + `❌ Erreur: ${error.message}\n`);
            return { success: false, error: error.message };
        } finally {
            setIsDeleting(false);
        }
    };

    const createNewUsers = async () => {
        setIsCreating(true);
        setResults(prev => prev + '\n👥 Création de nouveaux utilisateurs...\n');

        const newAccounts: UserAccount[] = [];

        for (const userData of defaultUsers) {
            try {
                setResults(prev => prev + `👤 Création: ${userData.email} (${userData.role})\n`);

                const result = await AdminCreationService.createNewAdminAccount({
                    email: userData.email,
                    password: userData.password,
                    name: userData.name
                });

                if (result.success) {
                    setResults(prev => prev + `✅ ${userData.email} créé avec succès\n`);
                    newAccounts.push(userData);
                } else {
                    setResults(prev => prev + `⚠️ ${userData.email}: ${result.message}\n`);
                }

                // Pause entre les créations
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error: any) {
                setResults(prev => prev + `❌ Erreur pour ${userData.email}: ${error.message}\n`);
            }
        }

        setCreatedAccounts(newAccounts);
        setResults(prev => prev + `\n✅ ${newAccounts.length} utilisateur(s) créé(s) avec succès\n`);

        setIsCreating(false);
        return newAccounts;
    };

    const handleFullReset = async () => {
        if (!confirm('⚠️ ATTENTION : Cette action va supprimer TOUS les utilisateurs existants et en créer de nouveaux. Êtes-vous sûr ?')) {
            return;
        }

        setIsResetting(true);
        setResults('🚀 Début de la réinitialisation complète...\n\n');
        setCreatedAccounts([]);

        try {
            // Étape 1: Supprimer tous les utilisateurs
            setResults(prev => prev + '1️⃣ === SUPPRESSION ===\n');
            const deleteResult = await deleteAllUsers();

            if (!deleteResult.success) {
                throw new Error('Échec de la suppression: ' + deleteResult.error);
            }

            // Pause pour synchronisation
            setResults(prev => prev + '\n⏳ Pause pour synchronisation...\n');
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Étape 2: Créer de nouveaux utilisateurs
            setResults(prev => prev + '\n2️⃣ === CRÉATION ===\n');
            const newAccounts = await createNewUsers();

            // Résumé final
            setResults(prev => prev + `\n📊 === RÉSUMÉ FINAL ===\n`);
            setResults(prev => prev + `🗑️ Utilisateurs supprimés: ${deleteResult.deletedCount}\n`);
            setResults(prev => prev + `✅ Utilisateurs créés: ${newAccounts.length}\n`);
            setResults(prev => prev + `\n🎉 Réinitialisation terminée avec succès !\n`);

        } catch (error: any) {
            setResults(prev => prev + `\n💥 Erreur: ${error.message}\n`);
        } finally {
            setIsResetting(false);
        }
    };

    const handleCreateEssentials = async () => {
        setIsCreating(true);
        setResults('⚡ Création des comptes essentiels...\n');
        setCreatedAccounts([]);

        const essentials = defaultUsers.filter(u => u.role === 'admin' || u.email.includes('admin'));

        for (const userData of essentials) {
            try {
                const result = await AdminCreationService.createNewAdminAccount({
                    email: userData.email,
                    password: userData.password,
                    name: userData.name
                });

                if (result.success) {
                    setResults(prev => prev + `✅ ${userData.email} créé\n`);
                    setCreatedAccounts(prev => [...prev, userData]);
                } else {
                    setResults(prev => prev + `⚠️ ${userData.email}: ${result.message}\n`);
                }
            } catch (error: any) {
                setResults(prev => prev + `❌ ${userData.email}: ${error.message}\n`);
            }
        }

        setResults(prev => prev + '\n✅ Comptes essentiels créés !\n');
        setIsCreating(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
                <RefreshCw className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900">Réinitialisation des Utilisateurs</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Button
                    onClick={handleFullReset}
                    disabled={isResetting || isDeleting || isCreating}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
                >
                    <RefreshCw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
                    Réinitialisation Complète
                </Button>

                <Button
                    onClick={handleCreateEssentials}
                    disabled={isResetting || isDeleting || isCreating}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                >
                    <Users className="h-4 w-4" />
                    Créer Comptes Essentiels
                </Button>

                <Button
                    onClick={deleteAllUsers}
                    disabled={isResetting || isDeleting || isCreating}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white"
                >
                    <Trash2 className="h-4 w-4" />
                    Supprimer Tous
                </Button>
            </div>

            {/* Avertissement */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-yellow-800">Attention</h3>
                        <p className="text-yellow-700 text-sm">
                            La réinitialisation complète supprimera définitivement tous les utilisateurs existants
                            et créera de nouveaux comptes avec des mots de passe par défaut.
                        </p>
                    </div>
                </div>
            </div>

            {/* Zone de résultats */}
            {results && (
                <div className="bg-gray-50 border rounded-md p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Résultats :</h3>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {results}
                    </pre>
                </div>
            )}

            {/* Affichage des comptes créés */}
            {createdAccounts.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-green-800 mb-2">
                                Comptes créés ({createdAccounts.length})
                            </h3>
                            <div className="space-y-2">
                                {createdAccounts.map((account, index) => (
                                    <div key={index} className="bg-white rounded p-3 border">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                            <div>
                                                <span className="font-semibold">Email:</span>
                                                <br />
                                                {account.email}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Mot de passe:</span>
                                                <br />
                                                <code className="bg-gray-100 px-1 rounded">
                                                    {account.password}
                                                </code>
                                            </div>
                                            <div>
                                                <span className="font-semibold">Nom:</span>
                                                <br />
                                                {account.name}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Rôle:</span>
                                                <br />
                                                <span className={`px-2 py-1 rounded text-xs ${account.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                    account.role === 'supplier' ? 'bg-blue-100 text-blue-800' :
                                                        account.role === 'customer' ? 'bg-green-100 text-green-800' :
                                                            account.role === 'sourcer' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-orange-100 text-orange-800'
                                                    }`}>
                                                    {account.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserResetPanel;
