const fs = require('fs');
const path = require('path');

// Configuration sécurisée
const BACKUP_DIR = 'backup-before-translation';
const DRY_RUN = process.argv.includes('--dry-run');

function createBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  console.log('💾 Création des sauvegardes...');
  
  function backupDir(srcDir, destDir) {
    const items = fs.readdirSync(srcDir);
    
    for (const item of items) {
      const srcPath = path.join(srcDir, item);
      const destPath = path.join(destDir, item);
      const stat = fs.statSync(srcPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        backupDir(srcPath, destPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  backupDir('src', path.join(BACKUP_DIR, 'src'));
  console.log('✅ Sauvegarde créée dans:', BACKUP_DIR);
}

function loadData() {
  try {
    const auditData = JSON.parse(fs.readFileSync('translation-audit.json', 'utf8'));
    const keyMapping = JSON.parse(fs.readFileSync('translation-mapping.json', 'utf8'));
    return { auditData, keyMapping };
  } catch (err) {
    console.error('❌ Erreur: Lancez d\'abord les étapes précédentes');
    process.exit(1);
  }
}

function applyTranslationsToFile(filePath, keyMapping) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let addUseLanguage = false;
    
    // Vérifier si useLanguage est déjà importé
    const hasUseLanguageImport = content.includes("import { useLanguage }");
    
    // Appliquer les remplacements
    Object.entries(keyMapping).forEach(([originalText, translationKey]) => {
      const patterns = [
        new RegExp(`'${originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'),
        new RegExp(`"${originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g')
      ];
      
      patterns.forEach(pattern => {
        if (pattern.test(content)) {
          content = content.replace(pattern, `{t('${translationKey}')}`);
          modified = true;
          addUseLanguage = true;
        }
      });
    });
    
    // Ajouter l'import useLanguage si nécessaire
    if (addUseLanguage && !hasUseLanguageImport) {
      // Trouver les imports React existants
      const reactImportMatch = content.match(/import React[^;]*from ['"]react['"];?/);
      if (reactImportMatch) {
        const newImport = "import { useLanguage } from '../contexts/LanguageContext';";
        content = content.replace(reactImportMatch[0], reactImportMatch[0] + '\n' + newImport);
      }
      
      // Ajouter const { t } = useLanguage(); dans le composant
      const componentMatch = content.match(/const\s+(\w+):\s*React\.FC[^=]*=\s*\([^)]*\)\s*=>\s*{/);
      if (componentMatch) {
        const hookDeclaration = '\n  const { t } = useLanguage();\n';
        content = content.replace(componentMatch[0], componentMatch[0] + hookDeclaration);
      }
    }
    
    if (modified && !DRY_RUN) {
      fs.writeFileSync(filePath, content);
    }
    
    return { modified, changes: modified ? Object.keys(keyMapping).length : 0 };
  } catch (err) {
    console.error(`❌ Erreur dans ${filePath}:`, err.message);
    return { modified: false, changes: 0 };
  }
}

function updateLanguageFiles(translationKeys) {
  console.log('\n📝 Mise à jour des fichiers de langue...');
  
  const languageContextPath = 'src/contexts/LanguageContext.tsx';
  
  if (!fs.existsSync(languageContextPath)) {
    console.error('❌ LanguageContext.tsx non trouvé');
    return;
  }
  
  let contextContent = fs.readFileSync(languageContextPath, 'utf8');
  
  // Trouver la section française
  const frenchMatch = contextContent.match(/fr:\s*{([^}]+)}/s);
  if (frenchMatch) {
    let frenchTranslations = frenchMatch[1];
    
    // Ajouter les nouvelles traductions
    Object.entries(translationKeys).forEach(([category, keys]) => {
      const categorySection = `\n    ${category}: {\n${Object.entries(keys).map(([key, value]) => 
        `      ${key}: "${value}"`
      ).join(',\n')}\n    }`;
      frenchTranslations += ',' + categorySection;
    });
    
    contextContent = contextContent.replace(frenchMatch[1], frenchTranslations);
    
    if (!DRY_RUN) {
      fs.writeFileSync(languageContextPath, contextContent);
    }
    console.log('✅ LanguageContext.tsx mis à jour');
  }
}

// Exécution principale
console.log('🚀 APPLICATION DES TRADUCTIONS');
console.log('===============================');

if (DRY_RUN) {
  console.log('🔍 MODE TEST (dry-run) - Aucun fichier ne sera modifié');
}

const { auditData, keyMapping } = loadData();

if (!DRY_RUN) {
  createBackup();
}

let totalModified = 0;
let totalChanges = 0;

console.log('\n🔄 Application des traductions aux fichiers...');

Object.keys(auditData.textsByFile).forEach(filePath => {
  const fullPath = path.join('src', filePath);
  console.log(`📄 Traitement: ${filePath}`);
  
  const result = applyTranslationsToFile(fullPath, keyMapping);
  if (result.modified) {
    totalModified++;
    totalChanges += result.changes;
    console.log(`  ✅ ${result.changes} textes traduits`);
  } else {
    console.log(`  ⏭️  Aucune modification`);
  }
});

// Mettre à jour les fichiers de langue
const generatedTranslations = JSON.parse(fs.readFileSync('generated-translations.json', 'utf8'));
updateLanguageFiles(generatedTranslations);

console.log('\n📊 RÉSUMÉ');
console.log('=========');
console.log(`Fichiers modifiés: ${totalModified}`);
console.log(`Textes traduits: ${totalChanges}`);
console.log(`Mode: ${DRY_RUN ? 'TEST' : 'PRODUCTION'}`);

if (!DRY_RUN) {
  console.log('\n💾 Sauvegarde disponible dans:', BACKUP_DIR);
  console.log('\n🚀 Prochaines étapes:');
  console.log('1. Tester votre application');
  console.log('2. Vérifier que tout fonctionne');
  console.log('3. Traduire les nouvelles clés dans les autres langues');
} else {
  console.log('\n🔄 Pour appliquer réellement: npm run translate:apply');
}
