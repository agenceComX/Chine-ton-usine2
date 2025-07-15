# 🚀 GUIDE COMPLET - SYSTÈME D'UTILISATEURS DE PRODUCTION

## 📋 Vue d'ensemble

Ce guide vous explique comment utiliser le système complet de gestion des utilisateurs de production pour la plateforme **Chine Ton Usine**. Le système garantit une base de données propre, sécurisée et prête à l'emploi avec 4 utilisateurs de production prédefinis.

## 🎯 Objectifs du système

- ✅ Supprimer tous les anciens utilisateurs (Auth + Firestore)
- ✅ Créer 4 utilisateurs de production avec rôles spécifiques
- ✅ Synchroniser Firebase Authentication et Firestore
- ✅ Structure complète des métadonnées utilisateur
- ✅ Sécurité et gestion d'erreurs avancée
- ✅ Prêt pour déploiement en production

## 👥 Utilisateurs de production créés

| Rôle | Email | Mot de passe (défaut) | Description |
|------|-------|----------------------|-------------|
| **Admin** | admin@chine-ton-usine.com | AdminSecure2024! | Administrateur principal |
| **Fournisseur** | supplier@chine-ton-usine.com | SupplierSecure2024! | Fournisseur principal |
| **Client** | client@chine-ton-usine.com | ClientSecure2024! | Client premium |
| **Influenceur** | influencer@chine-ton-usine.com | InfluencerSecure2024! | Influenceur business |

> ⚠️ **IMPORTANT**: Changez ces mots de passe par défaut en production !

## 🛠️ Scripts disponibles

### 🔧 Scripts principaux

```bash
# Setup complet automatique (recommandé)
npm run production:setup

# Nettoyage manuel
npm run production:clean

# Création manuelle
npm run production:create

# Vérification manuelle
npm run production:verify
```

### 🔍 Scripts de vérification

```bash
# Vérification complète de l'état
npm run verify:users

# Nettoyage de tous les utilisateurs
npm run cleanup:all

# Création des utilisateurs de production
npm run create:production
```

## 📖 Guide d'utilisation étape par étape

### Étape 1: Préparation

1. **Vérifiez la configuration Firebase** :
   ```bash
   npm run firebase:check
   ```

2. **Assurez-vous d'avoir le service account** :
   - Placez votre fichier `firebase-service-account.json` à la racine
   - Ou configurez les variables d'environnement appropriées

### Étape 2: Setup automatique (recommandé)

```bash
npm run production:setup
```

Cette commande exécute automatiquement :
1. Nettoyage complet des utilisateurs existants
2. Création des 4 utilisateurs de production
3. Vérification complète du résultat

### Étape 3: Setup manuel (si nécessaire)

Si vous préférez contrôler chaque étape :

1. **Nettoyage complet** :
   ```bash
   npm run production:clean
   ```
   - Supprime TOUS les utilisateurs de Firebase Auth
   - Supprime TOUS les documents de la collection `users`
   - Demande confirmation avant suppression

2. **Création des utilisateurs** :
   ```bash
   npm run production:create
   ```
   - Crée les 4 utilisateurs dans Firebase Auth
   - Crée les documents Firestore correspondants
   - Structure complète avec métadonnées

3. **Vérification** :
   ```bash
   npm run production:verify
   ```
   - Vérifie l'état de Firebase Auth
   - Vérifie l'état de Firestore
   - Analyse la synchronisation
   - Contrôle la structure des données

## 📊 Structure des données créées

### Firebase Authentication
- 4 utilisateurs avec emails, mots de passe et noms
- Email vérifié automatiquement
- Comptes actifs

### Firestore (collection `users`)
Chaque document contient :

```javascript
{
  // Informations principales
  uid: "firebase-auth-uid",
  name: "Nom de l'utilisateur",
  email: "email@chine-ton-usine.com",
  role: "admin|supplier|client|influencer",
  company: "Nom de l'entreprise",
  language: "fr",
  currency: "EUR|CNY",
  
  // Métadonnées système
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  isActive: true,
  emailVerified: true,
  
  // Structure future (prête mais vide)
  favorites: [],
  messages: [],
  browsingHistory: [],
  
  // Préférences utilisateur
  preferences: {
    notifications: { email: true, push: true, marketing: false },
    theme: "light",
    timezone: "Europe/Paris"
  },
  
  // Profil spécifique au rôle
  profile: {
    // Varie selon le rôle (admin, supplier, client, influencer)
  },
  
  // Statistiques d'usage
  stats: {
    lastLogin: null,
    loginCount: 0,
    lastActivity: null
  }
}
```

## 🔒 Sécurité et bonnes pratiques

### Avant déploiement en production

1. **Changez les mots de passe par défaut** :
   ```bash
   # Connectez-vous à la console Firebase
   # Allez dans Authentication > Users
   # Modifiez chaque mot de passe manuellement
   ```

2. **Configurez les règles Firestore** :
   ```bash
   npm run rules:production
   ```

3. **Activez la vérification email** (optionnel) :
   - Modifiez `emailVerified: false` dans le script
   - Configurez l'envoi d'emails de vérification

4. **Configurez la 2FA** (recommandé pour admin)

### Variables d'environnement recommandées

```env
FIREBASE_PROJECT_ID=chine-ton-usine
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@chine-ton-usine.iam.gserviceaccount.com
```

## 🚨 Gestion d'erreurs

### Erreurs courantes et solutions

1. **"Service account not found"**
   - Placez le fichier `firebase-service-account.json` à la racine
   - Ou configurez les variables d'environnement

2. **"Permission denied"**
   - Vérifiez les permissions du service account
   - Assurez-vous que les règles Firestore permettent l'écriture

3. **"User already exists"**
   - Normal, le script gère automatiquement les utilisateurs existants
   - Il mettra à jour les données sans créer de doublons

4. **"Network error"**
   - Vérifiez votre connexion internet
   - Vérifiez que Firebase n'est pas en maintenance

## 📋 Vérifications post-installation

Après avoir exécuté le setup, vérifiez :

1. **Console Firebase Authentication** :
   - 4 utilisateurs présents
   - Emails corrects
   - Comptes actifs

2. **Console Firestore** :
   - Collection `users` avec 4 documents
   - Structure complète de chaque document
   - UIDs synchronisés avec Authentication

3. **Test de connexion** :
   - Testez la connexion avec chaque utilisateur
   - Vérifiez les redirections selon les rôles

## 🔄 Maintenance et mises à jour

### Ajouter un nouvel utilisateur de production

1. Modifiez le tableau `PRODUCTION_USERS` dans `create-production-users-admin.js`
2. Relancez : `npm run production:create`

### Modifier la structure des données

1. Modifiez la fonction `createFirestoreDocument` dans `create-production-users-admin.js`
2. Relancez : `npm run production:create` (mergera les nouvelles données)

### Nettoyage périodique

```bash
# Vérification régulière
npm run verify:users

# Nettoyage si nécessaire
npm run cleanup:all && npm run create:production
```

## 📞 Support et dépannage

### Logs détaillés

Tous les scripts affichent des logs détaillés :
- ✅ Succès en vert
- ⚠️ Avertissements en jaune
- ❌ Erreurs en rouge
- 📊 Informations en bleu

### Commandes de diagnostic

```bash
# Vérification Firebase
npm run firebase:check

# Vérification des utilisateurs
npm run verify:users

# Test des règles Firestore
npm run rules:dev  # puis npm run rules:production
```

## 🎉 Félicitations !

Si tous les scripts s'exécutent sans erreur et que `npm run verify:users` confirme :
- ✅ 4 utilisateurs Authentication
- ✅ 4 documents Firestore  
- ✅ Synchronisation parfaite
- ✅ Structure complète à 100%

**Votre système est prêt pour la production ! 🚀**

---

*Ce guide fait partie du système de gestion des utilisateurs de Chine Ton Usine. Pour toute question technique, consultez les logs détaillés des scripts ou la documentation Firebase.*
