# Configuration Google Authentication Firebase

## Étapes pour activer l'authentification Google dans Firebase

### 1. Accéder à la Console Firebase
1. Allez sur [console.firebase.google.com](https://console.firebase.google.com)
2. Sélectionnez votre projet `chine-ton-usine-2c999`

### 2. Activer Google Authentication
1. Dans le menu latéral, cliquez sur **Authentication**
2. Allez dans l'onglet **Sign-in method**
3. Cliquez sur **Google** dans la liste des fournisseurs
4. Activez le fournisseur en cliquant sur le bouton **Enable**
5. Renseignez les informations requises :
   - **Project support email** : votre email
   - **Public-facing name** : "ChineTonUsine"

### 3. Configuration des domaines autorisés
Dans la section **Authorized domains**, assurez-vous que ces domaines sont ajoutés :
- `localhost` (pour le développement)
- `chine-ton-usine-2c999.firebaseapp.com` (domaine Firebase par défaut)
- Votre domaine de production si vous en avez un

### 4. Récupération des identifiants (optionnel)
Si vous avez besoin de personnaliser davantage :
1. Allez dans **Google Cloud Console**
2. Sélectionnez votre projet
3. Activez l'API **Google+ API** si elle n'est pas déjà activée
4. Dans **Credentials**, vous pouvez personnaliser votre OAuth 2.0 client

## Fonctionnalités implémentées

### ✅ Composant GoogleSignInButton
- Bouton stylé avec logo Google officiel
- Support de différentes variantes (default, outlined, minimal)
- Gestion des états de chargement
- Traductions multilingues
- Gestion d'erreurs intégrée

### ✅ Intégration Firebase
- Service `signInWithGoogle()` dans `firebaseAuthService`
- Création automatique d'utilisateur en base Firestore
- Gestion des utilisateurs existants
- Attribution de rôle par défaut ('customer')

### ✅ Contexte d'authentification
- Méthode `signInWithGoogle` dans AuthContext
- Écouteur automatique des changements d'état
- Gestion des erreurs et des redirections

### ✅ Interface utilisateur
- Intégration dans `AuthPageCombined.tsx`
- Séparateur "Ou continuer avec"
- Design cohérent avec le thème existant

## Utilisation

### Dans une page d'authentification
```tsx
import GoogleSignInButton from '../components/GoogleSignInButton';

<GoogleSignInButton
  onSuccess={() => {
    console.log('Connexion réussie');
  }}
  onError={(error) => {
    console.error('Erreur de connexion:', error);
  }}
  variant="default"
  className="w-full"
/>
```

### Avec le contexte d'authentification
```tsx
const { signInWithGoogle } = useAuth();

const handleGoogleLogin = async () => {
  const result = await signInWithGoogle();
  if (result.error) {
    console.error(result.error);
  } else {
    console.log('Utilisateur connecté:', result.user);
  }
};
```

## Test de l'implémentation

1. Assurez-vous que Firebase est configuré (voir étapes ci-dessus)
2. Démarrez l'application : `npm run dev`
3. Allez sur `http://localhost:5174/login`
4. Cliquez sur le bouton "Continuer avec Google"
5. Complétez le processus d'authentification Google
6. Vérifiez que l'utilisateur est créé dans Firestore

## Traductions disponibles

Le bouton Google Sign-In est traduit dans toutes les langues supportées :
- Français : "Continuer avec Google"
- Anglais : "Continue with Google"
- Espagnol : "Continuar con Google"
- Arabe : "تابع مع جوجل"
- Chinois : "使用谷歌继续"
- Portugais : "Continue com Google"
- Néerlandais : "Ga verder met Google"

## Sécurité

- Le token Google est vérifié côté Firebase
- L'utilisateur est automatiquement créé en base avec un rôle par défaut
- Les redirections sont gérées de manière sécurisée
- Support de la déconnexion

## Prochaines étapes

Pour une production complète, vous pourriez vouloir :
1. Personnaliser le logo et les couleurs dans Google Cloud Console
2. Ajouter une vérification email pour les nouveaux comptes Google
3. Implémenter un système de mapping de domaines email vers des rôles spécifiques
4. Ajouter des analytics pour tracker les connexions Google

---

**Note** : L'authentification Google est maintenant complètement intégrée et prête à l'emploi ! 🚀
