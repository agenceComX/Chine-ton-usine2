# Script de déploiement Firebase pour ChineTonUsine

## Prérequis

Avant de déployer les règles Firestore et configurer Firebase, assurez-vous d'avoir :

1. **Firebase CLI installé** :
   ```bash
   npm install -g firebase-tools
   ```

2. **Connexion à Firebase** :
   ```bash
   firebase login
   ```

3. **Initialisation du projet** (si pas déjà fait) :
   ```bash
   firebase init firestore
   ```
   - Sélectionnez votre projet Firebase : `chine-ton-usine-2c999`
   - Utilisez le fichier `firestore.rules` existant
   - Ne pas écraser le fichier d'index

## Déploiement des règles de sécurité

### 1. Vérification des règles
```bash
firebase firestore:rules:get
```

### 2. Test des règles en local (optionnel)
```bash
firebase emulators:start --only firestore
```

### 3. Déploiement des règles
```bash
firebase deploy --only firestore:rules
```

### 4. Vérification du déploiement
```bash
firebase firestore:rules:get
```

## Configuration des index (si nécessaire)

Si votre application nécessite des index composés, Firebase vous les suggérera automatiquement. Vous pouvez aussi les déployer manuellement :

```bash
firebase deploy --only firestore:indexes
```

## Commandes utiles

### Voir les règles actuelles
```bash
firebase firestore:rules:get
```

### Déployer uniquement Firestore
```bash
firebase deploy --only firestore
```

### Déployer tout le projet
```bash
firebase deploy
```

### Voir les logs de déploiement
```bash
firebase functions:log
```

## Configuration recommandée pour la production

### 1. Variables d'environnement
Créez un fichier `.env.production` :
```
VITE_FIREBASE_API_KEY=AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8
VITE_FIREBASE_AUTH_DOMAIN=chine-ton-usine-2c999.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=chine-ton-usine-2c999
VITE_FIREBASE_STORAGE_BUCKET=chine-ton-usine-2c999.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=528021984213
VITE_FIREBASE_APP_ID=1:528021984213:web:9d5e249e7c6c2ddcd1635c
VITE_FIREBASE_MEASUREMENT_ID=G-23BQZPXP86
```

### 2. Build et déploiement
```bash
# Build de l'application
npm run build

# Déploiement Firebase Hosting + Firestore
firebase deploy
```

## Surveillance et maintenance

### 1. Monitoring des règles
Surveillez les métriques dans la Console Firebase :
- Nombre de requêtes
- Erreurs d'autorisation
- Performance des règles

### 2. Logs de sécurité
```bash
# Voir les violations de règles
firebase firestore:rules:logs
```

### 3. Backup automatique
Configurez des exports automatiques de votre base de données :
```bash
gcloud firestore export gs://chine-ton-usine-2c999.appspot.com/backups/$(date +%Y-%m-%d)
```

## Résolution de problèmes

### Erreur de permissions
Si vous obtenez des erreurs de permissions :
1. Vérifiez que l'utilisateur est bien authentifié
2. Vérifiez que le rôle de l'utilisateur est correct dans Firestore
3. Testez les règles avec l'émulateur

### Performance lente
Si les règles sont lentes :
1. Simplifiez les règles complexes
2. Utilisez des index appropriés
3. Évitez les requêtes trop nombreuses dans les règles

### Règles trop restrictives
Si les utilisateurs ne peuvent pas accéder aux données :
1. Vérifiez les logs des règles
2. Testez avec différents rôles d'utilisateur
3. Ajustez les conditions dans les règles

## Sécurité avancée

### 1. Audit des accès
Activez les logs d'audit dans Google Cloud Console.

### 2. Rotation des clés
Régénérez périodiquement les clés API dans la Console Firebase.

### 3. Limitation des API
Configurez les quotas et limites dans Google Cloud Console.

## Support et documentation

- [Documentation Firestore Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

**Note importante** : Toujours tester les règles en environnement de développement avant de les déployer en production.
