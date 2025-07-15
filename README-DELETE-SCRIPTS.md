# 🧹 Scripts de Suppression Complète - Collection Users

## 📋 Vue d'ensemble

Ce dossier contient plusieurs scripts pour supprimer **complètement et définitivement** tous les documents de la collection `users` dans Firestore, avec différents niveaux de robustesse et de sécurité.

## ⚠️ AVERTISSEMENT IMPORTANT

**CES SCRIPTS SUPPRIMENT DÉFINITIVEMENT TOUS LES DOCUMENTS DE LA COLLECTION `users`**

- ❌ **Action irréversible**
- 🚫 **Aucune possibilité de récupération**
- 💾 **Assurez-vous d'avoir une sauvegarde**
- 🔒 **Testez d'abord sur un environnement de développement**

## 🛠️ Scripts Disponibles

### 1. Script Simple - Client SDK (Recommandé pour usage rapide)
```bash
npm run users:delete-all
```
**Fichier:** `delete-all-users.mjs`
- ✅ Utilise Firebase Client SDK (v9+)
- ✅ Gestion des erreurs avec retry automatique
- ✅ Suppression document par document
- ✅ Rapport détaillé des opérations
- ⚡ Prêt à l'emploi avec votre configuration

### 2. Script Complet - Client SDK Avancé
```bash
npm run users:delete-complete
```
**Fichier:** `delete-users-complete.mjs`
- ✅ Version la plus robuste avec Client SDK
- ✅ Traitement par lots configurables
- ✅ Gestion avancée des erreurs
- ✅ Système de confirmation intégré
- ✅ Rapport détaillé avec statistiques

### 3. Script Sécurisé - Admin SDK (Production)
**Fichier:** `delete-users-admin-secure.js`
- 🔐 Utilise Firebase Admin SDK
- 🔐 Authentification par Service Account
- ✅ Gestion complète des erreurs
- ✅ Confirmation obligatoire
- ✅ Rapport de suppression sauvegardé
- 💼 Recommandé pour environnement de production

### 4. Script de Vérification
```bash
npm run users:check-empty
```
**Fichier:** `check-empty-users.mjs`
- 🔍 Vérifie que la collection est vide
- 📊 Compte les documents restants
- ✅ Validation après suppression

## 🚀 Utilisation Rapide

### Suppression Immédiate (Client SDK)
```bash
# 1. Activer les règles de développement
npm run rules:dev

# 2. Supprimer tous les documents
npm run users:delete-all

# 3. Vérifier que c'est vide
npm run users:check-empty

# 4. Remettre les règles de production
npm run rules:production
```

### Utilisation Sécurisée (Admin SDK)

1. **Télécharger la clé de service:**
   - Firebase Console → Paramètres du projet → Comptes de service
   - Générer une nouvelle clé privée
   - Sauvegarder comme `serviceAccountKey.json`

2. **Installer Firebase Admin:**
   ```bash
   npm install firebase-admin
   ```

3. **Configurer le script:**
   - Modifier `serviceAccountPath` dans `delete-users-admin-secure.js`
   - Vérifier `projectId` et autres paramètres

4. **Exécuter:**
   ```bash
   node delete-users-admin-secure.js
   ```

## ⚙️ Configuration

### Variables Importantes

#### Client SDK (`delete-all-users.mjs`)
```javascript
// Configuration Firebase - Vérifiez vos paramètres
const firebaseConfig = {
  projectId: "chine-ton-usine",
  // ... autres paramètres
};
```

#### Admin SDK (`delete-users-admin-secure.js`)
```javascript
const CONFIG = {
  serviceAccountPath: './serviceAccountKey.json', // CHANGEZ CE CHEMIN
  projectId: 'chine-ton-usine',
  collectionName: 'users',
  batchSize: 100,
  confirmationMode: true // Demander confirmation
};
```

## 🔒 Sécurité et Bonnes Pratiques

### Avant Suppression
- ✅ **Sauvegarde complète** de Firestore
- ✅ **Test sur environnement de développement**
- ✅ **Vérification de la configuration Firebase**
- ✅ **Notification de l'équipe**

### Pendant Suppression
- ✅ **Surveillance des logs**
- ✅ **Vérification des erreurs**
- ✅ **Suivi de la progression**

### Après Suppression
- ✅ **Vérification que la collection est vide**
- ✅ **Test de l'application**
- ✅ **Recréation des utilisateurs de production si nécessaire**

## 📊 Gestion des Erreurs

### Erreurs Communes

1. **Permissions insuffisantes**
   ```
   Solution: Activer les règles de développement
   npm run rules:dev
   ```

2. **Timeout sur gros volumes**
   ```
   Solution: Utiliser le script par lots ou Admin SDK
   npm run users:delete-complete
   ```

3. **Configuration Firebase incorrecte**
   ```
   Solution: Vérifier projectId, apiKey, etc.
   ```

### Logs d'Erreur
- Les scripts affichent des détails sur chaque échec
- Retry automatique sur erreurs temporaires
- Rapport final avec statistiques

## 🔄 Scripts de Récupération

Si vous devez recréer les utilisateurs de production après suppression :

```bash
# Créer les 4 utilisateurs de production
npm run users:create-docs
node create-admin-doc.mjs

# Vérifier la création
npm run users:verify
```

## 📁 Structure des Fichiers

```
├── delete-all-users.mjs           # Script simple Client SDK
├── delete-users-complete.mjs      # Script complet Client SDK  
├── delete-users-admin-secure.js   # Script sécurisé Admin SDK
├── check-empty-users.mjs          # Vérification collection vide
├── serviceAccountKey.json         # Clé de service (à créer)
└── README-DELETE-SCRIPTS.md       # Cette documentation
```

## ⚡ Scripts npm Disponibles

```bash
npm run users:delete-all      # Suppression simple
npm run users:delete-complete # Suppression complète
npm run users:check-empty     # Vérification
npm run rules:dev            # Mode développement
npm run rules:production     # Mode production
```

## 🆘 Support et Dépannage

### En cas de problème:

1. **Vérifiez les logs** pour identifier l'erreur
2. **Consultez la console Firebase** pour l'état actuel
3. **Relancez le script** (retry automatique intégré)
4. **Utilisez le script de vérification** pour l'état final

### Contact
Si vous rencontrez des problèmes, consultez les logs détaillés affichés par les scripts.

---

**⚠️ Rappel: Ces opérations sont irréversibles. Utilisez avec précaution !**
