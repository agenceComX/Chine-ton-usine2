# 🚨 RÉSOLUTION : Erreur auth/invalid-credential

## ❌ Erreur Diagnostiquée
**Firebase: Error (auth/invalid-credential)**

Cette erreur signifie que :
- Le compte `admin@chinetonusine.com` n'existe pas encore
- Ou les identifiants sont incorrects

## ⚡ SOLUTION IMMÉDIATE

### Option 1 : Script Console (Recommandée)

1. **Restez sur cette page** : `http://localhost:5174/login`
2. **Ouvrez la console** : Appuyez sur `F12` → Onglet `Console`
3. **Copiez-collez ce script** :

```javascript
(async function() {
    await new Promise(r => setTimeout(r, 2000));
    if (window.AdminCreationService) {
        const result = await window.AdminCreationService.createDefaultAdminAccount();
        if (result.success) {
            alert(`✅ Admin créé !\nEmail: ${result.credentials.email}\nMot de passe: ${result.credentials.password}`);
            window.location.reload();
        } else if (result.message.includes('already')) {
            alert('ℹ️ Compte existe déjà !\nEmail: admin@chinetonusine.com\nMot de passe: admin123456');
        }
    } else {
        alert('⚠️ Rechargez la page et réessayez');
    }
})();
```

4. **Appuyez sur Entrée**
5. **Attendez** la confirmation
6. **Connectez-vous** avec les identifiants affichés

### Option 2 : Interface Admin

1. **Allez sur** : `http://localhost:5174/admin/users`
2. **Descendez** en bas de la page
3. **Trouvez** le panneau "Création de Comptes Admin"
4. **Cliquez** sur "Créer Compte Admin par Défaut"
5. **Notez** les identifiants
6. **Retournez** sur `/login` et connectez-vous

### Option 3 : Script Automatique

1. **Allez sur** : `http://localhost:5174/`
2. **Ouvrez la console** (F12)
3. **Collez** le contenu du fichier `direct-firebase-test.js`
4. **Le script** se lance automatiquement

## 🔑 Identifiants par Défaut

Une fois le compte créé :
- **Email** : `admin@chinetonusine.com`
- **Mot de passe** : `admin123456`

## 🔧 Si Ça Ne Marche Toujours Pas

### Réinitialisation Complète

1. **Console** (F12) → **Onglet Console**
2. **Tapez** :
```javascript
localStorage.clear();
sessionStorage.clear();
window.location.reload();
```
3. **Réessayez** la création du compte

### Vérification Firebase

1. **Console** → **Onglet Network**
2. **Rechargez** la page
3. **Vérifiez** qu'il n'y a pas d'erreurs réseau
4. **Réessayez**

## 📁 Fichiers d'Aide

Dans votre dossier de projet, vous avez :
- `direct-firebase-test.js` - Script automatique
- `fix-auth-error.js` - Diagnostic avancé
- `reset-auth.js` - Réinitialisation complète
- `quick-admin.js` - Script simple

## ✅ Résultat Attendu

Après résolution :
1. ✅ Pas d'erreur `auth/invalid-credential`
2. ✅ Connexion réussie avec `admin@chinetonusine.com`
3. ✅ Redirection vers `/admin/dashboard`

## 🆘 Support d'Urgence

Si rien ne fonctionne :
1. **Redémarrez** l'application :
   ```bash
   Ctrl+C  # Dans le terminal
   npm run dev  # Redémarrer
   ```
2. **Essayez** un autre navigateur
3. **Vérifiez** que l'application fonctionne sur `localhost:5174`

---

**💡 Astuce** : Le problème principal est que le compte admin n'existe pas encore. Une fois créé, tout fonctionnera normalement !
