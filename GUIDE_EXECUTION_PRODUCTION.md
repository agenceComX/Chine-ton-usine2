# 🚀 Guide d'Exécution - Création des Utilisateurs de Production

## 📋 Vue d'ensemble

Ce guide vous explique comment exécuter le script `create-new-production-users.mjs` pour créer automatiquement 4 utilisateurs de production dans Firebase Authentication et Firestore.

## 🔧 Prérequis

### 1. Service Account Firebase (Méthode recommandée)

**Option A : Fichier JSON**
```bash
# Placer le fichier service account dans :
./firebase-service-account.json
```

**Option B : Variables d'environnement**
```bash
# Définir ces variables :
FIREBASE_PROJECT_ID=chine-ton-usine
FIREBASE_PRIVATE_KEY_ID=votre_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nvotre_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@chine-ton-usine.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=votre_client_id
```

### 2. Dépendances Node.js
```bash
npm install firebase-admin
```

## 👥 Utilisateurs qui seront créés

| Rôle | Email | Mot de passe par défaut |
|------|-------|------------------------|
| **Admin** | admin@chine-ton-usine.com | AdminSecure2024! |
| **Supplier** | supplier@chine-ton-usine.com | SupplierSecure2024! |
| **Client** | client@chine-ton-usine.com | ClientSecure2024! |
| **Influencer** | influencer@chine-ton-usine.com | InfluencerSecure2024! |

## 🏃‍♂️ Exécution

### Commande directe
```bash
cd "c:\Users\Mon PC\Desktop\ChineTonUsine_Bolt alt2"
node create-new-production-users.mjs
```

### Via npm script (si configuré)
```bash
npm run production:create
```

## 📊 Contenu des documents Firestore

Chaque utilisateur aura un document complet avec :

### Champs principaux
- `uid`, `name`, `email`, `role`, `company`
- `language`, `currency`, `createdAt`, `isActive`

### Structure future (initialisée)
- `favorites: []`
- `messages: []` 
- `browsingHistory: []`

### Métadonnées complètes
- `preferences` (notifications, thème, timezone)
- `profile` (spécifique au rôle avec permissions)
- `stats` (statistiques d'usage)
- `security` (2FA, derniers logins)
- `contact` (informations de contact)

### Profils spécifiques par rôle

**Admin :**
- Permissions complètes (read, write, delete, admin, manage_users, system_config)
- Informations d'administration (canManageUsers, canManageSystem, etc.)

**Supplier :**
- Permissions produits (read, write, manage_products)
- Informations fournisseur (businessLicense, certifications, specialties, etc.)

**Client :**
- Permissions commandes (read, write, place_orders)
- Informations client (businessType, annualVolume, preferredCategories, etc.)

**Influencer :**
- Permissions contenu (read, write, create_content)
- Informations influenceur (socialMedia, audience, niche, rates, etc.)

## 🔐 Sécurité du script

### Gestion d'erreurs
- Try/catch complet à tous les niveaux
- Validation des données avant traitement
- Vérification des utilisateurs existants
- Mode `merge: true` pour Firestore (ne pas écraser)

### Bonnes pratiques
- Pause entre créations (éviter rate limits)
- Logs détaillés de chaque étape
- Résumé complet des résultats
- Gestion automatique des configurations

## ✅ Après l'exécution

### 1. Vérification
```bash
# Vérifier que les utilisateurs sont créés
node verify-users-state.mjs
```

### 2. Test de connexion
Tester la connexion de chaque rôle dans l'application web avec les identifiants ci-dessus.

### 3. Sécurisation (OBLIGATOIRE)
- ⚠️ **Changer immédiatement tous les mots de passe par défaut**
- Activer la vérification email si nécessaire
- Configurer la 2FA pour l'admin
- Mettre à jour les règles Firestore en mode production

### 4. Configuration rôles
Vérifier que chaque utilisateur est redirigé vers le bon dashboard selon son rôle.

## 🚨 Dépannage

### Erreur "Service account not found"
1. Vérifier que `firebase-service-account.json` est présent
2. Ou configurer les variables d'environnement
3. Vérifier les permissions du service account

### Erreur "User already exists"
- Normal si le script est relancé
- Les utilisateurs existants ne sont pas recréés
- Leur document Firestore est mis à jour (merge)

### Erreur de permissions Firebase
1. Vérifier que le projet Firebase est correct
2. Contrôler les IAM permissions du service account
3. S'assurer que Firebase Auth et Firestore sont activés

## 📞 Support

En cas de problème :
1. Consulter les logs détaillés du script
2. Vérifier la configuration Firebase
3. Tester la connectivité réseau
4. Consulter la console Firebase pour les erreurs

---

🎯 **Objectif :** Avoir 4 utilisateurs de production fonctionnels avec métadonnées complètes dans Firestore, prêts pour l'utilisation en production.
