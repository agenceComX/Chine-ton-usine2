# 🔐 Guide Configuration Firebase Service Account

## 🎯 Objectif
Configurer Firebase Admin SDK pour créer automatiquement les 4 utilisateurs de production.

## 📋 Étapes détaillées

### 1. Accéder à la Console Firebase
- Ouvrez votre navigateur
- Allez sur : https://console.firebase.google.com/
- Connectez-vous avec votre compte Google

### 2. Sélectionner le projet
- Cliquez sur le projet **"chine-ton-usine"** 
- Si le projet n'existe pas, créez-le d'abord

### 3. Aller aux paramètres du projet
- Cliquez sur l'icône ⚙️ (roue dentée) en haut à gauche
- Sélectionnez **"Paramètres du projet"**

### 4. Accéder aux comptes de service
- Dans les paramètres, cliquez sur l'onglet **"Comptes de service"**
- Vous verrez la section "SDK Admin Firebase"

### 5. Générer une nouvelle clé privée
- Cliquez sur **"Générer une nouvelle clé privée"**
- Une boîte de dialogue apparaîtra
- Cliquez sur **"Générer la clé"**
- Un fichier JSON sera téléchargé automatiquement

### 6. Renommer et placer le fichier
- Le fichier téléchargé a un nom comme : `chine-ton-usine-xxxxxxx-firebase-adminsdk-xxxxx.json`
- **Renommez-le en** : `firebase-service-account.json`
- **Placez-le dans** : `c:\Users\Mon PC\Desktop\ChineTonUsine_Bolt alt2\`

### 7. Vérifier la configuration
```bash
# Tester la configuration
node test-firebase-config.mjs

# Si ça marche, créer les utilisateurs
node create-new-production-users.mjs
```

## 🔒 Sécurité

### ⚠️ IMPORTANT
- **NE JAMAIS** commiter ce fichier dans Git
- **NE JAMAIS** le partager publiquement
- Gardez-le secret et sécurisé

### 🛡️ Bonnes pratiques
- Le fichier contient des clés secrètes
- Utilisez des variables d'environnement en production
- Changez les clés périodiquement

## 🔄 Alternative : Variables d'environnement

Si vous préférez ne pas utiliser de fichier JSON :

### Variables à définir
```bash
FIREBASE_PROJECT_ID=chine-ton-usine
FIREBASE_PRIVATE_KEY_ID=votre_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nvotre_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@chine-ton-usine.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=votre_client_id
```

### Windows PowerShell
```powershell
$env:FIREBASE_PROJECT_ID="chine-ton-usine"
$env:FIREBASE_PRIVATE_KEY_ID="votre_private_key_id"
# etc...
```

## 🚀 Après configuration

Une fois le service account configuré :

```bash
# Test de la configuration
node test-firebase-config.mjs

# Création des utilisateurs
node create-new-production-users.mjs

# Vérification des résultats
npm run verify:users
```

## 🎯 Résultat attendu

Après configuration réussie, vous pourrez créer :
- ✅ admin@chine-ton-usine.com
- ✅ supplier@chine-ton-usine.com  
- ✅ client@chine-ton-usine.com
- ✅ influencer@chine-ton-usine.com

Chaque utilisateur sera créé dans Firebase Authentication ET aura un document complet dans Firestore avec toutes les métadonnées requises.

---

📞 **Besoin d'aide ?** Relancez `node test-firebase-config.mjs` après configuration pour valider.
