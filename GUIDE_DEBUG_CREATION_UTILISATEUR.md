# Guide de débogage - Création d'utilisateur admin

## Problème identifié
Une erreur se produit lors de la création d'un nouvel utilisateur via le bouton "Nouvel utilisateur" dans l'espace admin.

## Outils de débogage ajoutés

### 1. Panel de test admin (AdminTestPanel)
- **Localisation**: Page admin/utilisateurs (section jaune en haut)
- **Fonction**: Permet de tester la connexion admin et la création d'utilisateurs
- **Utilisation**:
  1. Entrer l'email et mot de passe d'un admin existant
  2. Cliquer sur "Se connecter comme Admin"
  3. Une fois connecté, cliquer sur "Créer utilisateur test"

### 2. Test de connexion Firebase (UserCreationTest)
- **Localisation**: Page admin/utilisateurs (section blanche en dessous)
- **Fonction**: Teste la connexion Firebase et la création d'utilisateurs
- **Utilisation**:
  1. Cliquer sur "Test Connexion" pour vérifier Firebase
  2. Cliquer sur "Test Création" pour tester la création d'un utilisateur

## Étapes de diagnostic

### Étape 1: Vérifier l'état de l'authentification
1. Aller sur `/admin/users`
2. Regarder le "Utilisateur actuel" dans le panel jaune
3. Si "Non connecté", se connecter avec un compte admin

### Étape 2: Tester la connexion Firebase
1. Cliquer sur "Test Connexion"
2. Vérifier que Firestore est accessible
3. Noter le nombre de documents dans la collection 'users'

### Étape 3: Tester la création d'utilisateur
1. S'assurer d'être connecté en tant qu'admin
2. Cliquer sur "Créer utilisateur test"
3. Observer le résultat et les erreurs

## Erreurs communes et solutions

### Erreur: "Non connecté"
- **Cause**: Aucun utilisateur admin connecté
- **Solution**: Se connecter avec un compte admin valide

### Erreur: "Permission denied"
- **Cause**: Règles de sécurité Firestore trop strictes
- **Solution**: Vérifier les règles dans `firestore.rules`

### Erreur: "Email already in use"
- **Cause**: L'email existe déjà dans Firebase Auth
- **Solution**: Utiliser un email différent ou gérer les doublons

### Erreur: "Network error"
- **Cause**: Problème de connexion Firebase
- **Solution**: Vérifier la configuration Firebase dans `firebaseClient.ts`

## Après diagnostic

Une fois l'erreur identifiée et corrigée, les composants de test peuvent être retirés en supprimant :
- `AdminTestPanel` et `UserCreationTest` de `UsersPage.tsx`
- Les fichiers `AdminTestPanel.tsx` et `UserCreationTest.tsx`

## Informations utiles

- **Console du navigateur**: Ouvrir les outils de développeur (F12) pour voir les logs détaillés
- **Authentification Firebase**: L'état de connexion est affiché en temps réel
- **Erreurs Firebase**: Les codes d'erreur Firebase sont traduits en français
