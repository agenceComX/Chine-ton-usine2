# 🏭 Chine Ton Usine - Création Automatique d'Utilisateurs de Production

## 🎯 Vue d'ensemble

Ce système permet de créer automatiquement **4 utilisateurs de production** dans Firebase Authentication et Firestore avec des métadonnées complètes et une structure future-proof.

## 👥 Utilisateurs créés

| Rôle | Email | Mot de passe par défaut | Permissions |
|------|-------|------------------------|-------------|
| **Admin** | admin@chine-ton-usine.com | AdminSecure2024! | Gestion complète système |
| **Supplier** | supplier@chine-ton-usine.com | SupplierSecure2024! | Gestion produits |
| **Client** | client@chine-ton-usine.com | ClientSecure2024! | Placement commandes |
| **Influencer** | influencer@chine-ton-usine.com | InfluencerSecure2024! | Création contenu |

## 🚀 Démarrage rapide

### Option 1: Script guidé (recommandé)
```bash
# Navigation vers le projet
cd "c:\Users\Mon PC\Desktop\ChineTonUsine_Bolt alt2"

# Lancement du script guidé
node start-production-setup.mjs
```

### Option 2: Script direct
```bash
# Si vous avez déjà configuré Firebase
node create-new-production-users.mjs
```

### Option 3: Via npm
```bash
npm run setup:production
# ou
npm run create:production
```

## 🔧 Configuration Firebase

### Prérequis
1. **Projet Firebase** : `chine-ton-usine`
2. **Services activés** : Authentication, Firestore
3. **Service Account** avec permissions admin

### Option A: Fichier JSON (recommandé)
```bash
# Placez votre fichier service account ici :
./firebase-service-account.json
```

**Pour obtenir le fichier :**
1. [Console Firebase](https://console.firebase.google.com/)
2. Sélectionnez "chine-ton-usine"
3. Paramètres projet > Comptes de service
4. "Générer une nouvelle clé privée"
5. Téléchargez et renommez en `firebase-service-account.json`

### Option B: Variables d'environnement
```bash
FIREBASE_PROJECT_ID=chine-ton-usine
FIREBASE_PRIVATE_KEY_ID=votre_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nvotre_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@chine-ton-usine.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=votre_client_id
```

## 📊 Structure des données Firestore

Chaque utilisateur aura un document complet dans la collection `users` :

### Champs principaux (requis)
```json
{
  "uid": "firebase_uid_auto_généré",
  "name": "Nom complet utilisateur",
  "email": "email@chine-ton-usine.com",
  "role": "admin|supplier|client|influencer",
  "company": "Nom de l'entreprise",
  "language": "fr",
  "currency": "EUR|CNY",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "isActive": true
}
```

### Structure future (initialisée)
```json
{
  "favorites": [],
  "messages": [],
  "browsingHistory": []
}
```

### Métadonnées complètes
- **Préférences** : notifications, thème, timezone
- **Profil** : permissions, informations spécifiques au rôle
- **Statistiques** : dernière connexion, nombre de logins
- **Sécurité** : 2FA, tentatives de connexion
- **Contact** : téléphone, adresse, réseaux sociaux

## 🛡️ Sécurité et Robustesse

### Gestion d'erreurs
- ✅ Try/catch complet à tous les niveaux
- ✅ Validation des données avant traitement
- ✅ Vérification des utilisateurs existants
- ✅ Mode `merge: true` (ne pas écraser)
- ✅ Logs détaillés de chaque étape

### Bonnes pratiques
- ✅ Pause entre créations (éviter rate limits)
- ✅ Résumé complet des résultats
- ✅ Gestion automatique des configurations
- ✅ Validation des formats email et mots de passe

### Production-ready
- ✅ Ne supprime jamais de données existantes
- ✅ Peut être relancé en toute sécurité
- ✅ Gestion des environnements multiples
- ✅ Logs pour audit et debugging

## 📋 Scripts disponibles

### Scripts principaux
```bash
# Configuration et création complète
npm run setup:production

# Création directe (si config OK)
npm run create:production

# Vérification des utilisateurs
npm run verify:users

# Configuration Firebase
npm run setup:firebase
```

### Scripts de maintenance
```bash
# Nettoyage complet (attention!)
npm run cleanup:all

# Vérification rapide
node quick-check.mjs
```

## ✅ Après la création

### 1. Vérification immédiate
```bash
# Vérifier que les 4 utilisateurs sont créés
npm run verify:users
```

### 2. Test de connexion
Testez chaque utilisateur dans l'application :
- **Admin** → Dashboard administration
- **Supplier** → Interface fournisseur  
- **Client** → Interface client
- **Influencer** → Interface influenceur

### 3. Sécurisation (OBLIGATOIRE)
⚠️ **Actions critiques à faire immédiatement :**
- Changer tous les mots de passe par défaut
- Activer la vérification email
- Configurer la 2FA pour l'admin
- Mettre à jour les règles Firestore en production

### 4. Configuration finale
- Vérifier les redirections selon les rôles
- Tester les permissions Firestore
- Configurer les règles de sécurité
- Activer les notifications

## 🚨 Dépannage

### Erreurs courantes

**"Service account not found"**
```bash
# Solution : configurer Firebase
node setup-firebase-config.mjs
```

**"User already exists"**
- Normal si le script est relancé
- Les utilisateurs existants ne sont pas recréés
- Leurs documents Firestore sont mis à jour

**"Permission denied"**
- Vérifier les permissions du service account
- S'assurer que Auth et Firestore sont activés
- Contrôler les règles Firestore

### Logs détaillés
Le script produit des logs complets pour chaque étape :
- ✅ Succès en vert
- ⚠️ Avertissements en jaune  
- ❌ Erreurs en rouge
- 📊 Résumé final avec statistiques

## 📞 Support technique

### Vérifications de base
1. **Configuration** : service account ou variables env
2. **Connectivité** : accès internet et Firebase
3. **Permissions** : service account avec droits admin
4. **Projet** : "chine-ton-usine" existe et est actif

### Commandes de diagnostic
```bash
# État des utilisateurs
npm run verify:users

# Configuration Firebase
node setup-firebase-config.mjs

# Test rapide
node quick-check.mjs
```

---

## 🎉 Résultat final

Après exécution réussie, vous aurez :
- ✅ 4 utilisateurs dans Firebase Authentication
- ✅ 4 documents complets dans Firestore
- ✅ Structure future-proof pour nouvelles fonctionnalités
- ✅ Permissions et rôles configurés
- ✅ Métadonnées complètes pour analytics
- ✅ Système robuste et sécurisé

**🚀 Votre plateforme B2B est prête pour la production !**
