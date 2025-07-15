const fs = require('fs');
const path = require('path');

// Fonction pour extraire tous les textes français du code
function extractFrenchTexts(dir) {
  const frenchTexts = new Set();
  const files = [];

  function readDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        readDir(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.jsx')) {
        files.push(fullPath);
      }
    }
  }

  readDir(dir);

  // Patterns pour détecter les textes français
  const frenchPatterns = [
    // Textes entre guillemets simples ou doubles
    /'([^']*[àâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][^']*?)'/g,
    /"([^"]*[àâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][^"]*?)"/g,
    // Mots français communs
    /['"]([^'"]*(?:Bonjour|Accueil|Connexion|Déconnexion|Profil|Paramètres|Recherche|Produits|Fournisseurs|Commandes|Tableau de bord|Administration|Utilisateurs|Sécurité|Informations|Préférences|Langue|Monnaie|Notifications|Enregistrer|Modifier|Supprimer|Ajouter|Créer|Nouveau|Ancien|Récent|Favoris|Messages|Contact|Aide|Support|À propos|Politique|Conditions|Confidentialité|Cookies|Français|Anglais|Espagnol|Allemand|Italien|Portugais|Chinois|Europe|France|Chine|États-Unis|Royaume-Uni|Italie|Espagne|Portugal|Allemagne)[^'"]*?)['"/]/gi,
    // Textes avec accents français
    /['"]([^'"]*[àâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][^'"]*?)['"/]/gi
  ];

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Ignorer les fichiers de traduction
      if (file.includes('translation') || file.includes('i18n') || file.includes('locale')) {
        return;
      }

      frenchPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const text = match[1];
          if (text && text.length > 1 && !text.startsWith('t(')) {
            frenchTexts.add({
              text: text,
              file: file.replace(dir, ''),
              line: content.substring(0, match.index).split('\n').length
            });
          }
        }
      });
    } catch (err) {
      console.error(`Erreur lecture ${file}:`, err.message);
    }
  });

  return Array.from(frenchTexts);
}

// Exécution
const projectDir = process.cwd();
const frenchTexts = extractFrenchTexts(path.join(projectDir, 'src'));

// Grouper par fichier
const textsByFile = frenchTexts.reduce((acc, item) => {
  if (!acc[item.file]) acc[item.file] = [];
  acc[item.file].push(item);
  return acc;
}, {});

console.log('\n🔍 AUDIT DES TEXTES NON TRADUITS');
console.log('=====================================');
console.log(`Total de textes français trouvés: ${frenchTexts.length}`);
console.log(`Fichiers concernés: ${Object.keys(textsByFile).length}`);

// Créer un rapport détaillé
const report = {
  summary: {
    totalTexts: frenchTexts.length,
    totalFiles: Object.keys(textsByFile).length,
    scanDate: new Date().toISOString()
  },
  textsByFile: textsByFile,
  allTexts: frenchTexts.map(item => item.text).sort()
};

// Sauvegarder le rapport
fs.writeFileSync('translation-audit.json', JSON.stringify(report, null, 2));

console.log('\n📝 TOP 20 des textes à traduire:');
console.log('----------------------------------');
report.allTexts.slice(0, 20).forEach((text, i) => {
  console.log(`${i + 1}. "${text}"`);
});

console.log('\n📁 TOP 10 des fichiers avec le plus de textes:');
console.log('------------------------------------------------');
Object.entries(textsByFile)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 10)
  .forEach(([file, texts]) => {
    console.log(`${file}: ${texts.length} textes`);
  });

console.log('\n📄 Rapport complet sauvé dans: translation-audit.json');
console.log('\n🚀 Prochaines étapes:');
console.log('1. Examiner le rapport translation-audit.json');
console.log('2. Lancer: npm run translate:generate pour créer les clés');
console.log('3. Lancer: npm run translate:apply pour appliquer les traductions');
