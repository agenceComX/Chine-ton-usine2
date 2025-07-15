# 🚀 ÉTAPES POUR CRÉER VOS UTILISATEURS FIREBASE

## 📊 État actuel
- ❌ Aucun utilisateur dans Firebase Authentication
- ❌ Service Account Firebase non configuré
- ✅ Scripts de création prêts

## 🔧 ÉTAPE 1 : Configuration Firebase (OBLIGATOIRE)

### Option A : Assistant configuration (recommandé)
```bash
npm run configure
```

### Option B : Configuration manuelle
1. Allez sur https://console.firebase.google.com/
2. Sélectionnez le projet "chine-ton-usine"
3. Paramètres projet > Comptes de service
4. "Générer une nouvelle clé privée"
5. Téléchargez le fichier JSON
6. Renommez-le en `firebase-service-account.json`
7. Placez-le dans le dossier du projet

### Option C : Variables d'environnement
```bash
# Définir ces variables :
FIREBASE_PROJECT_ID=chine-ton-usine
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@chine-ton-usine.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=...
```

## 🧪 ÉTAPE 2 : Test de la configuration
```bash
npm run test:config
```

Si le test réussit ✅, vous verrez : "CONFIGURATION FIREBASE VALIDÉE !"

## 🚀 ÉTAPE 3 : Création des utilisateurs

### Commande simple
```bash
npm run create:production
```

### Ou avec le script guidé complet
```bash
npm run setup:production
```

## 👥 RÉSULTAT ATTENDU

4 utilisateurs seront créés :

| Rôle | Email | Mot de passe | Permissions |
|------|-------|--------------|-------------|
| **Admin** | admin@chine-ton-usine.com | AdminSecure2024! | Gestion complète |
| **Supplier** | supplier@chine-ton-usine.com | SupplierSecure2024! | Gestion produits |
| **Client** | client@chine-ton-usine.com | ClientSecure2024! | Commandes |
| **Influencer** | influencer@chine-ton-usine.com | InfluencerSecure2024! | Contenu |

## 📋 Chaque utilisateur aura :

### Dans Firebase Authentication
- ✅ Email et mot de passe
- ✅ Nom d'affichage
- ✅ Email vérifié automatiquement
- ✅ Compte activé

### Dans Firestore (collection `users`)
- ✅ **Champs principaux** : uid, name, email, role, company, language, currency, createdAt, isActive
- ✅ **Structure future** : favorites[], messages[], browsingHistory[]
- ✅ **Métadonnées complètes** :
  - Préférences (notifications, thème, timezone)
  - Profil spécifique au rôle avec permissions
  - Statistiques d'usage (lastLogin, loginCount, etc.)
  - Sécurité (2FA, tentatives de connexion)
  - Contact (téléphone, adresse, réseaux sociaux)

## ✅ ÉTAPE 4 : Vérification
```bash
npm run verify:users
```

## 🔐 ÉTAPE 5 : Sécurisation (IMPORTANT!)
1. **Changer tous les mots de passe par défaut**
2. Activer la vérification email si nécessaire
3. Configurer la 2FA pour l'admin
4. Mettre à jour les règles Firestore en production

## 🎯 ÉTAPE 6 : Test de connexion
Testez chaque utilisateur dans votre application :
- Admin → Dashboard administration
- Supplier → Interface fournisseur
- Client → Interface client  
- Influencer → Interface influenceur

## 🛠️ Commandes utiles

```bash
# Configuration
npm run configure              # Assistant configuration
npm run test:config           # Tester la config

# Création
npm run setup:production      # Script guidé complet
npm run create:production     # Création directe

# Vérification
npm run verify:users          # État des utilisateurs
npm run menu                  # Menu interactif

# Aide
npm run demo                  # Démonstration du processus
```

## 📚 Documentation complète
- `GUIDE_SERVICE_ACCOUNT.md` - Configuration Firebase détaillée
- `README_PRODUCTION_USERS.md` - Guide complet
- `GUIDE_EXECUTION_PRODUCTION.md` - Instructions d'exécution

---

## 🚀 COMMANDE RAPIDE POUR COMMENCER

```bash
# 1. Configuration Firebase
npm run configure

# 2. Test de la configuration  
npm run test:config

# 3. Création des utilisateurs
npm run create:production

# 4. Vérification
npm run verify:users
```

**🎯 En 4 commandes, vos utilisateurs de production seront prêts !**
