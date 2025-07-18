// Script Node.js pour compléter automatiquement les clés manquantes dans le bloc zh
// Usage : node scripts/fix-zh-missing-keys.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../src/context/LanguageContext.tsx');
const OUTPUT = path.join(__dirname, '../src/context/LanguageContext.zh-fixed.tsx');

const content = fs.readFileSync(FILE, 'utf8');

// Extraction naïve des blocs fr et zh (suppose une structure simple)
const frMatch = content.match(/fr:\s*{([\s\S]*?)},\s*\n\s*en:/);
const zhMatch = content.match(/zh:\s*{([\s\S]*?)},\s*\n\s*pt:/);

if (!frMatch || !zhMatch) {
  console.error('Impossible de trouver les blocs fr ou zh');
  process.exit(1);
}

function parseBlock(block) {
  const obj = {};
  const regex = /"([^"]+)":\s*"([^"]*)"/g;
  let m;
  while ((m = regex.exec(block))) {
    obj[m[1]] = m[2];
  }
  return obj;
}

const fr = parseBlock(frMatch[1]);
const zh = parseBlock(zhMatch[1]);

let added = 0;
for (const key of Object.keys(fr)) {
  if (!(key in zh)) {
    zh[key] = '待翻译';
    added++;
  }
}

console.log(`Clés ajoutées dans zh : ${added}`);

// Génération du nouveau bloc zh
const zhBlock = Object.entries(zh)
  .map(([k, v]) => `    "${k}": "${v}"`)
  .join(',\n');

// Remplacement dans le fichier
const newContent = content.replace(
  /zh:\s*{([\s\S]*?)},\s*\n\s*pt:/,
  `zh: {\n${zhBlock}\n  },\n\n  pt:`
);

fs.writeFileSync(OUTPUT, newContent, 'utf8');
console.log('Fichier corrigé écrit dans', OUTPUT); 