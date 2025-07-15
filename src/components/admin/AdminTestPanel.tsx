import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebaseClient';
import { adminUserService } from '../../services/adminUserService';
import Button from '../Button';
import Input from '../Input';

const AdminTestPanel: React.FC = () => {
    const [adminEmail, setAdminEmail] = useState('admin@chinetousine.com');
    const [adminPassword, setAdminPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<string>('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user ? `${user.email} (${user.uid})` : 'Non connecté');
        });

        return () => unsubscribe();
    }, []);

    const loginAsAdmin = async () => {
        if (!adminPassword) {
            setResult('❌ Veuillez entrer le mot de passe admin');
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
            setResult(`✅ Connexion admin réussie: ${adminEmail}`);
        } catch (error: any) {
            console.error('Erreur connexion admin:', error);
            setResult(`❌ Erreur connexion admin: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const logoutAdmin = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setResult('✅ Déconnexion réussie');
        } catch (error: any) {
            setResult(`❌ Erreur déconnexion: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const createTestUser = async () => {
        if (!auth.currentUser) {
            setResult('❌ Vous devez être connecté en tant qu\'admin');
            return;
        }

        setLoading(true);
        const testUserEmail = `test-${Date.now()}@example.com`;

        try {
            const result = await adminUserService.createUser({
                email: testUserEmail,
                password: 'testpass123',
                name: 'Test User',
                role: 'customer'
            });

            if (result.success) {
                setResult(`✅ Utilisateur test créé: ${testUserEmail}
UID: ${result.user?.uid}`);
            } else {
                setResult(`❌ Erreur création: ${result.error}`);
            }
        } catch (error: any) {
            console.error('Erreur création:', error);
            setResult(`💥 Exception: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800">Panel de test admin</h3>

            <div className="mb-4 p-3 bg-gray-100 rounded">
                <strong>Utilisateur actuel:</strong> {currentUser}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Email Admin:</label>
                    <Input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Mot de passe Admin:</label>
                    <Input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
                <Button
                    onClick={loginAsAdmin}
                    disabled={loading}
                    variant="outline"
                >
                    Se connecter comme Admin
                </Button>

                <Button
                    onClick={createTestUser}
                    disabled={loading || !auth.currentUser}
                >
                    Créer utilisateur test
                </Button>

                <Button
                    onClick={logoutAdmin}
                    disabled={loading}
                    variant="outline"
                >
                    Se déconnecter
                </Button>
            </div>

            {result && (
                <div className="p-4 bg-white rounded border">
                    <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                </div>
            )}
        </div>
    );
};

export default AdminTestPanel;
