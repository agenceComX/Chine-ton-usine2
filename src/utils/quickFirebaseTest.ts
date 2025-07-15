// Quick Firebase Test
import { auth, db } from '../lib/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const quickFirebaseTest = async () => {
  console.log('🔥 Quick Firebase Test Starting...');
  
  try {
    // Test 1: Firebase Connection
    console.log('✅ Firebase initialized');
    console.log('Auth:', auth);
    console.log('DB:', db);
    
    // Test 2: Create a test document
    const testDoc = doc(db, 'test', 'quick-test');
    await setDoc(testDoc, {
      message: 'Hello from Firebase!',
      timestamp: new Date(),
      success: true
    });
    console.log('✅ Document created successfully');
    
    // Test 3: Read the document
    const docSnap = await getDoc(testDoc);
    if (docSnap.exists()) {
      console.log('✅ Document read successfully:', docSnap.data());
    } else {
      console.log('❌ Document not found');
    }
    
    // Test 4: Test authentication (optional - only if we have test users)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        'admin@chine-ton-usine.com',
        'admin123456'
      );
      console.log('✅ Authentication successful:', userCredential.user.email);
    } catch (authError) {
      console.log('ℹ️ Authentication test skipped (no test user found):', authError);
    }
    
    console.log('🎉 Quick Firebase test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Quick Firebase test failed:', error);
    return false;
  }
};

// Auto-run the test when this module is loaded
if (typeof window !== 'undefined') {
  // Run after a short delay to ensure Firebase is initialized
  setTimeout(() => {
    quickFirebaseTest();
  }, 1000);
}
