import React, { useState } from 'react';
import { adminUserServiceFixed } from '../../services/adminUserServiceFixed';
import type { CreateUserData } from '../../services/adminUserServiceFixed';
import { auth, db } from '../../lib/firebaseClient';
import { collection, getDocs } from 'firebase/firestore';
import Button from '../Button';

const UserCreationTest: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('');

    const testFirebaseConnection = async () => {
        setLoading(true);
        setResult('');

        try {
            console.log('🔍 Test de connexion Firebase...');

            // Test 1: Auth
            console.log('1. Auth user:', auth.currentUser?.email || 'Non connecté');

            // Test 2: Firestore connection
            const usersCollection = collection(db, 'users');
            const snapshot = await getDocs(usersCollection);
            console.log('2. Firestore OK, nombre de documents:', snapshot.size);

            setResult(`✅ Connexion Firebase OK
Auth: ${auth.currentUser?.email || 'Non connecté'}
Firestore: ${snapshot.size} documents dans 'users'`);

        } catch (error: any) {
            console.error('💥 Erreur Firebase:', error);
            setResult(`💥 Erreur Firebase: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testCreateUser = async () => {
        setLoading(true);
        setResult('');

        const testUser: CreateUserData = {
            email: `test-${Date.now()}@example.com`, // Email unique
            password: 'testpass123',
            name: 'Test User',
            role: 'customer'
        };

        try {
            console.log('🧪 Test de création d\'utilisateur:', testUser.email);
            const result = await adminUserServiceFixed.createUser(testUser);

            if (result.success) {
                setResult(`✅ Succès: Utilisateur créé avec l'UID ${result.user?.uid}
Email: ${result.user?.email}
Nom: ${result.user?.name}`);
            } else {
                setResult(`❌ Erreur: ${result.error}`);
            }
        } catch (error: any) {
            console.error('💥 Erreur lors du test:', error);
            setResult(`💥 Exception: ${error.message}
Code: ${error.code || 'N/A'}
Stack: ${error.stack || 'N/A'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Tests de débogage Firebase</h3>

            <div className="flex gap-2 mb-4">
                <Button
                    onClick={testFirebaseConnection}
                    disabled={loading}
                    variant="outline"
                >
                    {loading ? 'Test...' : 'Test Connexion'}
                </Button>

                <Button
                    onClick={testCreateUser}
                    disabled={loading}
                >
                    {loading ? 'Création...' : 'Test Création'}
                </Button>
            </div>

            {result && (
                <div className="p-4 bg-gray-100 rounded-md">
                    <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                </div>
            )}
        </div>
    );
};

export default UserCreationTest;
