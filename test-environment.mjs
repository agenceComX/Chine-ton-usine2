import { existsSync } from 'fs';

console.log('🔍 VÉRIFICATION SIMPLE DE L\'ENVIRONNEMENT');
console.log('='.repeat(50));

// Test simple
try {
    console.log('✅ Script lancé avec succès');
    console.log('📋 Node.js version:', process.version);
    console.log('📂 Répertoire de travail:', process.cwd());

    // Vérifier les fichiers essentiels
    const files = [
        'package.json',
        'firebase.json',
        'create-production-users-admin.mjs',
        'cleanup-all-users-admin.mjs',
        'verify-users-state.mjs'
    ];

    console.log('\n📁 Vérification des fichiers:');
    files.forEach(file => {
        const exists = existsSync(file);
        console.log(`   ${exists ? '✅' : '❌'} ${file}`);
    });

    console.log('\n🎯 Environnement prêt pour les scripts de production !');

} catch (error) {
    console.error('❌ Erreur:', error.message);
}
