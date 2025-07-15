import React, { useState } from 'react';
import { auth } from '../../lib/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Button from '../Button';
import Input from '../Input';

const QuickAdminLogin: React.FC = () => {
    const [email, setEmail] = useState('admin@chinetousine.com');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        if (!password) {
            setMessage('❌ Veuillez entrer le mot de passe');
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setMessage('✅ Connexion réussie ! Vous pouvez maintenant créer des utilisateurs.');
        } catch (error: any) {
            console.error('Erreur de connexion:', error);
            let errorMessage = 'Erreur de connexion';

            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Utilisateur non trouvé';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Mot de passe incorrect';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Email invalide';
            }

            setMessage(`❌ ${errorMessage}: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const currentUser = auth.currentUser;

    return (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
            <h4 className="font-semibold text-blue-800 mb-2">Connexion Admin Rapide</h4>

            {currentUser ? (
                <div className="text-green-600">
                    ✅ Connecté en tant que: {currentUser.email}
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                            type="email"
                            placeholder="Email admin"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleLogin} disabled={loading} size="sm">
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </div>
            )}

            {message && (
                <div className="mt-2 text-sm">{message}</div>
            )}
        </div>
    );
};

export default QuickAdminLogin;
