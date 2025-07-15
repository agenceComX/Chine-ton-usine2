# 🔧 Guide de Résolution - Redirection Admin

## 🎯 Problème
L'utilisateur `admin@chinetonusine.com` ne redirige pas vers l'espace admin après connexion.

## 🔍 Diagnostic

Le problème peut être causé par :
1. **Rôle incorrect** dans Firestore (pas `admin`)
2. **Utilisateur inexistant** dans Firestore
3. **Utilisateur inactif** dans Firestore
4. **Données corrompues** dans Firestore

## ⚡ Solution Rapide

### Méthode 1 : Interface Graphique
1. **Ouvrir l'espace admin** : `/admin/users`
2. **Localiser le panneau "Diagnostic Redirection Admin"** (en haut de la page)
3. **Entrer le mot de passe** de `admin@chinetonusine.com`
4. **Cliquer sur "Test Connexion Admin"**
5. **Si ça ne marche pas, cliquer sur "Correction Auto"**
6. **Se déconnecter et se reconnecter** pour tester

### Méthode 2 : Console du Navigateur
1. **Ouvrir la console** (F12 → Console)
2. **Exécuter** :
```javascript
// Diagnostic complet
await AdminDiagnostic.quickDiagnostic();

// Correction rapide (remplacer 'VOTRE_MOT_DE_PASSE' par le vrai mot de passe)
await AdminFix.quickFix('VOTRE_MOT_DE_PASSE');
```

## 🔧 Solution Manuelle

Si les solutions automatiques ne fonctionnent pas :

### 1. Vérifier Firebase Auth
- Aller sur [Firebase Console](https://console.firebase.google.com/)
- **Authentication → Users**
- Vérifier que `admin@chinetonusine.com` existe

### 2. Vérifier Firestore
- Aller sur [Firebase Console](https://console.firebase.google.com/)
- **Firestore Database → Data**
- Collection `users` → chercher l'utilisateur par email
- Vérifier que `role: "admin"`

### 3. Règles Firestore
Vérifier que les règles permettent l'accès admin :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## 📋 Vérifications Post-Correction

1. **Déconnectez-vous** complètement
2. **Reconnectez-vous** avec `admin@chinetonusine.com`
3. **Vérifiez la redirection** vers `/admin/dashboard`
4. **Testez l'accès** aux différentes pages admin

## 🐛 Débogage Avancé

### Logs Console
Vérifiez les logs pour :
```
👤 Nouvelle connexion détectée: admin@chinetonusine.com
✅ Utilisateur synchronisé avec Firestore
🔄 Redirection vers /admin/dashboard
```

### Structure Firestore Attendue
```javascript
{
  uid: "firebase-uid",
  email: "admin@chinetonusine.com",
  name: "Admin Principal",
  role: "admin",           // ⭐ CRITIQUE
  isActive: true,          // ⭐ CRITIQUE
  language: "fr",
  currency: "EUR",
  // ... autres champs
}
```

## 🚨 Si Rien ne Fonctionne

1. **Supprimer l'utilisateur** dans Firestore
2. **Supprimer l'utilisateur** dans Firebase Auth
3. **Recréer l'utilisateur** avec le bon rôle
4. **Utiliser le script de création d'utilisateurs de test**

## 📞 Support

Si le problème persiste :
1. **Copier les logs console** complets
2. **Faire une capture d'écran** de l'interface
3. **Vérifier les règles Firestore**
4. **Contacter le support technique**

---

**⚡ Solution Express** : 
Ouvrir `/admin/users` → Panneau diagnostic → Entrer mot de passe → "Correction Auto" → Se reconnecter
