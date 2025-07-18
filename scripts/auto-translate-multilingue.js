// Script Node.js pour compléter automatiquement toutes les langues à partir du français
// Usage : node scripts/auto-translate-multilingue.js
// Nécessite une clé API Google Translate (ou utilise l’API gratuite de Google Translate Web)

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const LOCALES_DIR = path.join(__dirname, '../src/locales');
const LANGS = ['en', 'es', 'de', 'zh', 'pt', 'ar'];
const REF_LANG = 'fr';

const refFile = path.join(LOCALES_DIR, `${REF_LANG}.json`);
const ref = JSON.parse(fs.readFileSync(refFile, 'utf8'));

function flatten(obj, prefix = '', res = {}) {
  for (const k in obj) {
    const val = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      flatten(val, key, res);
    } else {
      res[key] = val;
    }
  }
  return res;
}

function unflatten(data) {
  const result = {};
  for (const flatKey in data) {
    const keys = flatKey.split('.');
    let cur = result;
    keys.forEach((k, i) => {
      if (i === keys.length - 1) {
        cur[k] = data[flatKey];
      } else {
        if (!cur[k]) cur[k] = {};
        cur = cur[k];
      }
    });
  }
  return result;
}

async function translate(text, target, source = 'fr') {
  // Utilise l’API Google Translate Web gratuite (non officielle)
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const json = await res.json();
  return json[0].map(x => x[0]).join('');
}

(async () => {
  const refFlat = flatten(ref);
  for (const lang of LANGS) {
    const file = path.join(LOCALES_DIR, `${lang}.json`);
    let dataFlat = {};
    let replaced = 0;
    for (const key of Object.keys(refFlat)) {
      // Traduction automatique forcée pour toutes les clés
      try {
        const translated = await translate(refFlat[key], lang);
        dataFlat[key] = translated;
        replaced++;
        console.log(`[${lang}] Traduit : ${key} => ${translated}`);
      } catch (e) {
        dataFlat[key] = 'À traduire';
        console.log(`[${lang}] Erreur traduction : ${key}`);
      }
    }
    const out = unflatten(dataFlat);
    fs.writeFileSync(file, JSON.stringify(out, null, 2), 'utf8');
    console.log(`[${lang}] Fichier écrasé (${replaced} clés traduites)`);
  }
})(); 