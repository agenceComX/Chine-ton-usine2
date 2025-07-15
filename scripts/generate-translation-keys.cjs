const fs = require('fs');

// Fonction pour générer une clé de traduction à partir du texte
function generateTranslationKey(text, category = 'common') {
  return text
    .toLowerCase()
    .replace(/[àâäéèêëïîôöùûüÿç]/g, (char) => {
      const map = { 'à': 'a', 'â': 'a', 'ä': 'a', 'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e', 'ï': 'i', 'î': 'i', 'ô': 'o', 'ö': 'o', 'ù': 'u', 'û': 'u', 'ü': 'u', 'ÿ': 'y', 'ç': 'c' };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]/g, '')
    .replace(/(.{20}).+/, '$1') // Limiter à 20 caractères
    .replace(/^(.{3,})$/, '$1'); // Au moins 3 caractères
}

// Fonction pour déterminer la catégorie automatiquement
function detectCategory(text) {
  const categories = {
    auth: /connexion|déconnexion|inscription|mot de passe|email|login|logout|register|password/i,
    navigation: /accueil|menu|navigation|retour|suivant|précédent|home|back|next|previous/i,
    forms: /nom|prénom|email|téléphone|adresse|ville|pays|enregistrer|modifier|supprimer|ajouter|name|firstname|phone|address|save|edit|delete|add/i,
    admin: /administration|utilisateur|tableau de bord|paramètres|sécurité|admin|dashboard|settings|security|user/i,
    ecommerce: /produit|fournisseur|commande|panier|prix|acheter|vendre|product|supplier|order|cart|price|buy|sell/i,
    common: /oui|non|ok|annuler|fermer|ouvrir|voir|détails|plus|moins|yes|no|cancel|close|open|view|details|more|less/i
  };

  for (const [category, pattern] of Object.entries(categories)) {
    if (pattern.test(text)) return category;
  }
  return 'common';
}

// Lire le rapport d'audit
let auditData;
try {
  auditData = JSON.parse(fs.readFileSync('translation-audit.json', 'utf8'));
} catch (err) {
  console.error('❌ Erreur: Lancez d\'abord npm run translate:audit');
  process.exit(1);
}

console.log('🔄 GÉNÉRATION DES CLÉS DE TRADUCTION');
console.log('====================================');

// Générer les clés de traduction
const translationKeys = {};
const keyMapping = {};

auditData.allTexts.forEach(text => {
  const category = detectCategory(text);
  const key = generateTranslationKey(text, category);
  
  if (!translationKeys[category]) {
    translationKeys[category] = {};
  }
  
  // Éviter les doublons
  let finalKey = key;
  let counter = 1;
  while (translationKeys[category][finalKey]) {
    finalKey = `${key}${counter}`;
    counter++;
  }
  
  translationKeys[category][finalKey] = text;
  keyMapping[text] = `${category}.${finalKey}`;
});

// Sauvegarder les nouvelles clés
fs.writeFileSync('generated-translations.json', JSON.stringify(translationKeys, null, 2));
fs.writeFileSync('translation-mapping.json', JSON.stringify(keyMapping, null, 2));

console.log('✅ Clés générées:');
Object.entries(translationKeys).forEach(([category, keys]) => {
  console.log(`  📁 ${category}: ${Object.keys(keys).length} clés`);
});

console.log('\n📝 Exemple de clés générées:');
console.log('----------------------------');
Object.entries(translationKeys).slice(0, 3).forEach(([category, keys]) => {
  console.log(`\n${category}:`);
  Object.entries(keys).slice(0, 3).forEach(([key, value]) => {
    console.log(`  ${key}: "${value}"`);
  });
});

console.log('\n💾 Fichiers créés:');
console.log('- generated-translations.json (nouvelles clés par catégorie)');
console.log('- translation-mapping.json (mapping texte → clé)');
console.log('\n🚀 Prochaine étape: npm run translate:apply');
