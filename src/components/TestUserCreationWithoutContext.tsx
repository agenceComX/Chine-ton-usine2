/**
 * 🔍 SOLUTION - Problème identifié dans AuthContext
 * 
 * D'après les logs, le problème vient du AuthContext qui déclenche automatiquement
 * une déconnexion/reconnexion lors de la création d'utilisateur.
 */

// SOLUTION TEMPORAIRE : Créer un composant de test sans AuthContext

import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebaseClient';
import Button from '../components/Button';

const TestUserCreationWithoutContext: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const createUserDirectly = async () => {
        setLoading(true);
        try {
            console.log('🧪 AVANT - Admin connecté:', auth.currentUser?.email);

            const simpleDoc = {
                email: email,
                name: name,
                created: new Date().toISOString(),
                testType: 'sans-auth-context'
            };

            await setDoc(doc(db, 'test_users_direct', `test_${Date.now()}`), simpleDoc);

            console.log('🧪 APRÈS - Admin connecté:', auth.currentUser?.email);
            console.log('✅ Utilisateur créé directement sans AuthContext');

            // Reset form
            setEmail('');
            setName('');

        } catch (error) {
            console.error('❌ Erreur création directe:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Test Sans AuthContext</h3>

            <div className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                />

                <input
                    type="text"
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                />

                <Button
                    onClick={createUserDirectly}
                    disabled={loading || !email || !name}
                    className="w-full"
                >
                    {loading ? 'Création...' : 'Créer Utilisateur (Test Direct)'}
                </Button>
            </div>

            <p className="text-sm text-gray-600 mt-4">
                Ce test crée un utilisateur directement sans passer par AuthContext
                pour isoler le problème de déconnexion.
            </p>
        </div>
    );
};

export default TestUserCreationWithoutContext;
