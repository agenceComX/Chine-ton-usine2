/**
 * 🧪 TEST ULTIME - Service de test minimal absolu
 * 
 * Ce service ne fait qu'écrire dans Firestore et RIEN d'autre
 * Si même cela cause une déconnexion, le problème est dans React/Firebase même
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

export async function testCreateUserUltimate(userData: any) {
    console.log('🧪 TEST ULTIME: Début - Écriture Firestore pure');

    try {
        const uid = `test_ultimate_${Date.now()}`;
        const userDoc = {
            id: uid,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            createdAt: new Date().toISOString(),
            testType: 'ultimate-minimal'
        };

        await setDoc(doc(db, 'users', uid), userDoc);

        console.log('✅ TEST ULTIME: Succès - Document créé');
        console.log('🔍 TEST ULTIME: Si déconnexion maintenant, problème est dans Firestore/React');

        return { success: true, uid };

    } catch (error) {
        console.error('❌ TEST ULTIME: Erreur:', error);
        return { success: false, error };
    }
}
