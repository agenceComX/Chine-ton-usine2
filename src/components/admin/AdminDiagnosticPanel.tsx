import React, { useState } from 'react';
import { AdminRedirectionDiagnostic } from '../../utils/adminRedirectionDiagnostic';
import { auth } from '../../lib/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Button from '../Button';

const AdminDiagnosticPanel: React.FC = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<string>('');
    const [email, setEmail] = useState('admin@chinetonusine.com');
    const [password, setPassword] = useState('');

    const runDiagnostic = async () => {
        setIsRunning(true);
        setResults('');

        // Capturer les logs console
        const originalLog = console.log;
        const originalError = console.error;
        let logs: string[] = [];

        console.log = (...args) => {
            logs.push(args.join(' '));
            originalLog(...args);
        };

        console.error = (...args) => {
            logs.push(`ERROR: ${args.join(' ')}`);
            originalError(...args);
        };

        try {
            const diagnostic = new AdminRedirectionDiagnostic();
            await diagnostic.runFullDiagnostic();
            await diagnostic.showUserStats();
        } catch (error) {
            logs.push(`EXCEPTION: ${error}`);
        } finally {
            // Restaurer les logs
            console.log = originalLog;
            console.error = originalError;

            setResults(logs.join('\n'));
            setIsRunning(false);
        }
    };

    const testAdminLogin = async () => {
        if (!password) {
            setResults('Veuillez entrer le mot de passe admin');
            return;
        }

        setIsRunning(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setResults(`✅ Connexion réussie: ${userCredential.user.email}`);

            // Attendre un peu puis relancer le diagnostic
            setTimeout(async () => {
                await runDiagnostic();
            }, 1000);
        } catch (error: any) {
            setResults(`❌ Erreur de connexion: ${error.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    const quickFix = async () => {
        setIsRunning(true);
        try {
            const diagnostic = new AdminRedirectionDiagnostic();
            await diagnostic.runFullDiagnostic();
            setResults('✅ Correction automatique terminée - Reconnectez-vous');
        } catch (error: any) {
            setResults(`❌ Erreur lors de la correction: ${error.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
                🔧 Diagnostic Redirection Admin
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Admin
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="admin@chinetonusine.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mot de passe admin"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <Button
                    onClick={runDiagnostic}
                    disabled={isRunning}
                    variant="outline"
                >
                    {isRunning ? 'Diagnostic...' : 'Lancer Diagnostic'}
                </Button>

                <Button
                    onClick={testAdminLogin}
                    disabled={isRunning || !password}
                    variant="primary"
                >
                    {isRunning ? 'Connexion...' : 'Test Connexion Admin'}
                </Button>

                <Button
                    onClick={quickFix}
                    disabled={isRunning}
                    variant="success"
                >
                    {isRunning ? 'Correction...' : 'Correction Auto'}
                </Button>
            </div>

            {results && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Résultats :</h4>
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
                        {results}
                    </pre>
                </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Instructions :</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Entrez le mot de passe de admin@chinetonusine.com</li>
                    <li>2. Cliquez sur "Test Connexion Admin" pour vous connecter</li>
                    <li>3. Si la redirection ne fonctionne pas, cliquez sur "Correction Auto"</li>
                    <li>4. Déconnectez-vous et reconnectez-vous pour tester</li>
                </ol>
            </div>
        </div>
    );
};

export default AdminDiagnosticPanel;
