/**
 * 🚨 TEST ULTIME - API Firestore pure
 * Test pour identifier si le problème vient de nos services ou de Firestore lui-même
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

export async function testPureFirestore(userData: any) {
    console.log('🚨 TEST ULTIME: API Firestore PURE - aucun service custom');

    try {
        const simpleDoc = {
            email: userData.email,
            name: userData.name,
            created: new Date().toISOString(),
            testType: 'pure-firestore-api'
        };

        await setDoc(doc(db, 'test_users', `test_${Date.now()}`), simpleDoc);

        console.log('✅ TEST ULTIME: Document créé avec API pure');
        return { success: true };

    } catch (error) {
        console.error('❌ TEST ULTIME: Erreur API pure:', error);
        return { success: false, error };
    }
}
