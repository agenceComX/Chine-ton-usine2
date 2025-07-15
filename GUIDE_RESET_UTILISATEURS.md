# 🚀 GUIDE COMPLET DE RÉINITIALISATION ET CRÉATION DES UTILISATEURS

## Vue d'ensemble

Ce guide vous explique comment **supprimer tous les utilisateurs existants** et **créer 4 nouveaux utilisateurs** (un par rôle) dans votre projet Firebase.

## 📋 Prérequis

1. **Node.js** installé (version 16+)
2. **Firebase CLI** installé (`npm install -g firebase-tools`)
3. **Connexion Firebase** (`firebase login`)
4. **Projet Firebase** configuré

## 🔧 Installation des dépendances

```bash
# Installation des dépendances nécessaires
npm install firebase-admin

# Vérification de l'installation
npm list firebase firebase-admin
```

## 🗑️ Suppression et création des utilisateurs

### Méthode 1 : Script automatisé (Recommandé)

```bash
# Exécution du script complet
npm run users:reset
```

**Ce script va :**
1. ✅ Supprimer tous les utilisateurs de Firebase Authentication
2. ✅ Supprimer tous les documents de la collection `users` dans Firestore
3. ✅ Créer 4 nouveaux utilisateurs avec leurs rôles respectifs
4. ✅ Synchroniser les données entre Authentication et Firestore
5. ✅ Valider que tout a été créé correctement

### Méthode 2 : Exécution manuelle

```bash
# Exécution directe du script
node reset-and-create-users.js
```

## 👥 Utilisateurs créés par défaut

| Rôle | Email | Mot de passe | Description |
|------|-------|--------------|-------------|
| **Admin** | `admin@chinetonusine.com` | `Admin2024!Secure` | Accès administrateur complet |
| **Fournisseur** | `fournisseur@chinetonusine.com` | `Supplier2024!Secure` | Interface fournisseur |
| **Client** | `client@chinetonusine.com` | `Client2024!Secure` | Interface client |
| **Influenceur** | `influenceur@chinetonusine.com` | `Influencer2024!Secure` | Interface influenceur |

## 🔐 Sécurité des mots de passe

Les mots de passe par défaut respectent les critères de sécurité :
- ✅ Minimum 8 caractères
- ✅ Au moins 1 majuscule
- ✅ Au moins 1 minuscule
- ✅ Au moins 1 chiffre
- ✅ Au moins 1 caractère spécial

## 📊 Résultat attendu

Après exécution, vous devriez voir :

```
🚀 Début de la réinitialisation et création des utilisateurs
============================================================

📝 ÉTAPE 1: Suppression des utilisateurs existants
✅ Firebase Admin initialisé avec les credentials par défaut
🗑️ Suppression de X utilisateurs dans Auth...
✅ X utilisateurs supprimés
🗑️ Suppression des utilisateurs dans Firestore...
✅ X utilisateurs supprimés de Firestore

📝 ÉTAPE 2: Création des nouveaux utilisateurs
👤 Création de l'utilisateur: admin@chinetonusine.com
✅ Utilisateur créé dans Auth: [UID]
✅ Document Firestore créé pour: admin@chinetonusine.com
[...]

📝 ÉTAPE 3: Validation
📊 Résumé des utilisateurs (4 total):
============================================================
1. ADMIN
   Email: admin@chinetonusine.com
   Nom: Administrateur Principal
   Entreprise: ChineTonUsine
   UID: [UID]
   Créé: [Date]
[...]

🎉 PROCESSUS TERMINÉ
============================================================
✅ Utilisateurs créés avec succès: 4
❌ Échecs de création: 0
📊 Total validé dans Firestore: 4

🔐 Informations de connexion:
========================================
ADMIN: admin@chinetonusine.com | Admin2024!Secure
SUPPLIER: fournisseur@chinetonusine.com | Supplier2024!Secure
CUSTOMER: client@chinetonusine.com | Client2024!Secure
INFLUENCER: influenceur@chinetonusine.com | Influencer2024!Secure
```

## 🔍 Vérification

### Dans Firebase Console

1. **Authentication** : Vérifiez que 4 utilisateurs sont présents
2. **Firestore** : Vérifiez la collection `users` avec 4 documents

### Test de connexion

Accédez à votre application et testez la connexion avec chaque compte.

## 🚨 Dépannage

### Erreur "Firebase Admin non disponible"

Si vous voyez cette erreur :
```
⚠️ Admin SDK non disponible, saut de la suppression Auth
```

**Solution :** Le script continuera et utilisera les méthodes client. C'est normal pour les environnements sans clé de service.

### Erreur de permissions

```bash
# Vérifiez votre connexion Firebase
firebase login

# Vérifiez le projet actif
firebase use --add
```

### Erreur de dépendances

```bash
# Réinstallation des dépendances
npm install
npm install firebase-admin
```

## 🔧 Configuration avancée

### Personnaliser les utilisateurs

Modifiez le tableau `usersToCreate` dans `reset-and-create-users.js` :

```javascript
const usersToCreate = [
  {
    email: 'votre-admin@exemple.com',
    password: 'VotreMotDePasse123!',
    role: 'admin',
    name: 'Votre Nom',
    company: 'Votre Entreprise'
  },
  // ... autres utilisateurs
];
```

### Utiliser une clé de service (Optionnel)

Pour une suppression plus efficace via l'Admin SDK :

1. Téléchargez la clé de service depuis Firebase Console
2. Nommez-la `serviceAccountKey.json`
3. Placez-la dans le dossier racine du projet
4. **IMPORTANT :** Ajoutez-la au `.gitignore`

## 📝 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run users:reset` | Supprime et recrée tous les utilisateurs |
| `npm run users:create` | Alias pour users:reset |
| `npm run deploy:rules` | Déploie les règles Firestore |
| `npm run deploy` | Build et déploie l'application complète |

## 🔒 Sécurité en production

### Changement des mots de passe

**IMPORTANT :** Changez IMMÉDIATEMENT les mots de passe par défaut en production :

1. Connectez-vous avec chaque compte
2. Dirigez-vous vers les paramètres du profil
3. Modifiez le mot de passe
4. Ou utilisez la console Firebase

### Règles Firestore

Les règles Firestore sont configurées pour :
- ✅ Séparation stricte des rôles
- ✅ Accès limité aux données par rôle
- ✅ Protection contre les modifications non autorisées
- ✅ Validation des données

## 📞 Support

Si vous rencontrez des problèmes :

1. ✅ Vérifiez les prérequis
2. ✅ Consultez les logs détaillés
3. ✅ Vérifiez les permissions Firebase
4. ✅ Testez la connexion internet

## 🎯 Prochaines étapes

Après la création des utilisateurs :

1. ✅ Testez la connexion de chaque utilisateur
2. ✅ Vérifiez les redirections selon le rôle
3. ✅ Personnalisez les interfaces utilisateur
4. ✅ Configurez les notifications
5. ✅ Déployez en production

---

**🎉 Félicitations !** Votre système d'authentification est maintenant configuré avec des utilisateurs de production sécurisés.
