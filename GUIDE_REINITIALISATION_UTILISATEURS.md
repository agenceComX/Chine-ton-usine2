# 🔄 GUIDE COMPLET : Réinitialisation des Utilisateurs Firebase

## 🎯 Objectif
Supprimer tous les utilisateurs existants et créer de nouveaux comptes synchronisés avec Firebase Authentication et Firestore.

## 📋 Méthodes Disponibles

### 🖥️ **Méthode 1 : Interface Utilisateur (Recommandée)**

1. **Accédez à l'interface admin** :
   ```
   http://localhost:5174/admin/users
   ```

2. **Localisez le panneau "Réinitialisation des Utilisateurs"** en haut de la page

3. **Choisissez une action** :
   - **🔄 Réinitialisation Complète** : Supprime tout et recrée tous les comptes
   - **⚡ Créer Comptes Essentiels** : Crée seulement les comptes admin nécessaires
   - **🗑️ Supprimer Tous** : Supprime tous les utilisateurs existants uniquement

4. **Confirmez l'action** et attendez la fin du processus

5. **Notez les identifiants** affichés dans la zone de résultats

### 🔧 **Méthode 2 : Console du Navigateur**

1. **Allez sur** : `http://localhost:5174/admin/users`
2. **Ouvrez la console** (F12 → Console)
3. **Choisissez un script** :

#### Script Complet (Recommandé)
```javascript
// Copiez le contenu de reset-users-complete.js dans la console
// Ou utilisez directement :
resetAllUsers()
```

#### Script Express
```javascript
// Copiez le contenu de quick-user-reset.js dans la console
// Ou utilisez directement :
quickUserReset()
```

#### Comptes Essentiels Seulement
```javascript
createEssentialAccounts()
```

## 👥 **Comptes Créés par Défaut**

### Administrateurs
```
📧 admin@chinetonusine.com
🔒 Admin123!
👤 Administrateur Principal
🔑 Rôle: admin

📧 admin2@chinetonusine.com  
🔒 Admin123!
👤 Administrateur Secondaire
🔑 Rôle: admin
```

### Utilisateurs Test
```
📧 fournisseur@chinetonusine.com
🔒 Fournisseur123!
👤 Fournisseur Test
🔑 Rôle: supplier

📧 client@chinetonusine.com
🔒 Client123!
👤 Client Test  
🔑 Rôle: customer

📧 sourcer@chinetonusine.com
🔒 Sourcer123!
👤 Sourcer Test
🔑 Rôle: sourcer

📧 influenceur@chinetonusine.com
🔒 Influenceur123!
👤 Influenceur Test
🔑 Rôle: influencer
```

## ⚡ **Solutions Rapides**

### Solution Express (1 minute)
```javascript
// Dans la console du navigateur
(async function() {
    await new Promise(r => setTimeout(r, 2000));
    if (window.quickUserReset) {
        await window.quickUserReset();
    } else {
        alert('Rechargez la page et réessayez');
    }
})();
```

### Créer Seulement un Admin
```javascript
// Si vous voulez juste un compte admin rapidement
(async function() {
    await new Promise(r => setTimeout(r, 2000));
    if (window.AdminCreationService) {
        const result = await window.AdminCreationService.createDefaultAdminAccount();
        if (result.success) {
            alert(`Admin créé !\nEmail: ${result.credentials.email}\nMot de passe: ${result.credentials.password}`);
        }
    }
})();
```

## 🔍 **Processus de Réinitialisation**

### Étape 1 : Suppression
- Récupération de tous les utilisateurs de Firestore
- Suppression de chaque document utilisateur
- Nettoyage complet de la collection `users`

### Étape 2 : Création  
- Création des comptes dans Firebase Authentication
- Création des profils dans Firestore
- Attribution des rôles et permissions
- Synchronisation automatique

### Étape 3 : Validation
- Vérification de la création réussie
- Affichage des identifiants
- Test de connexion possible

## 🛡️ **Sécurité et Bonnes Pratiques**

### ⚠️ Avertissements
- **Action irréversible** : Tous les utilisateurs existants seront perdus
- **Données liées** : Les commandes, messages, etc. peuvent devenir orphelins
- **Sessions actives** : Tous les utilisateurs connectés seront déconnectés

### 🔒 Mots de Passe
- **Changez immédiatement** les mots de passe par défaut en production
- **Utilisez des mots de passe forts** pour tous les comptes
- **Activez l'authentification à deux facteurs** si possible

### 👥 Gestion des Rôles
- **Limitez le nombre d'admins** au strict nécessaire
- **Vérifiez les permissions** après création
- **Testez l'accès** de chaque type d'utilisateur

## 🔧 **Dépannage**

### Services Non Disponibles
```javascript
// Attendre le chargement des services
await new Promise(resolve => setTimeout(resolve, 5000));
// Puis réessayer
```

### Erreurs de Création
1. **Vérifiez la connexion internet**
2. **Rechargez la page** (Ctrl+F5)
3. **Utilisez un autre navigateur**
4. **Vérifiez la console** pour les erreurs détaillées

### Erreurs Firebase
1. **Vérifiez la configuration** Firebase
2. **Contrôlez les règles** Firestore
3. **Vérifiez les quotas** Firebase
4. **Consultez la console** Firebase

## 📁 **Fichiers Disponibles**

Dans le dossier du projet :
- `reset-users-complete.js` - Script complet avec toutes les fonctionnalités
- `quick-user-reset.js` - Script express pour réinitialisation rapide
- `UserResetPanel.tsx` - Interface utilisateur dans l'admin
- Ce guide - `GUIDE_REINITIALISATION_UTILISATEURS.md`

## ✅ **Validation du Succès**

Après réinitialisation :
- ✅ Anciens utilisateurs supprimés de Firestore
- ✅ Nouveaux comptes créés dans Firebase Auth
- ✅ Profils synchronisés dans Firestore
- ✅ Rôles correctement attribués
- ✅ Connexion possible avec nouveaux identifiants

## 🆘 **Support d'Urgence**

En cas de problème critique :

### Restauration Manuelle
1. **Utilisez la console Firebase** pour créer un admin manuellement
2. **Accédez directement** à Firestore pour vérifier les données
3. **Redémarrez l'application** si nécessaire

### Contact Support
Fournissez :
- Capture d'écran des erreurs
- Logs de la console navigateur
- Description des étapes effectuées
- Version du navigateur utilisé

---

**💡 Conseil** : Testez d'abord avec "Créer Comptes Essentiels" avant de faire une réinitialisation complète !
