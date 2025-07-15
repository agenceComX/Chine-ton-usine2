# Composant BackButton

## Description

Le composant `BackButton` est un bouton de retour réutilisable avec des animations fluides et plusieurs variantes de style.

## Fonctionnalités

- ✨ **Animations fluides** : Transform scale et translation de l'icône
- 🎨 **3 variantes de style** : default, outline, ghost
- 🔄 **Navigation intelligente** : vers une URL spécifique ou historique du navigateur
- 🌙 **Mode sombre** : Support complet du dark mode
- 📱 **Responsive** : Adapté à tous les écrans

## Utilisation

### Retour simple (historique du navigateur)

```tsx
<BackButton />
```

### Retour vers une page spécifique

```tsx
<BackButton to="/supplier/dashboard" label="Retour au tableau de bord" />
```

### Variantes de style

```tsx
{
  /* Bouton par défaut */
}
<BackButton variant="default" />;

{
  /* Bouton avec bordure */
}
<BackButton variant="outline" />;

{
  /* Bouton transparent (utilisé actuellement) */
}
<BackButton variant="ghost" />;
```

### Avec classes CSS personnalisées

```tsx
<BackButton
  to="/dashboard"
  label="Retour"
  variant="outline"
  className="mb-6 ml-auto"
/>
```

## Props

| Prop        | Type                                | Default    | Description                    |
| ----------- | ----------------------------------- | ---------- | ------------------------------ |
| `to`        | `string`                            | -          | URL de destination (optionnel) |
| `label`     | `string`                            | `"Retour"` | Texte du bouton                |
| `className` | `string`                            | `""`       | Classes CSS supplémentaires    |
| `variant`   | `"default" \| "outline" \| "ghost"` | `"ghost"`  | Variante de style              |

## Animations

- **Hover** : Scale 1.05x et translation de l'icône vers la gauche
- **Active** : Scale 0.95x pour feedback tactile
- **Icône** : Translation fluide de l'icône ArrowLeft

## Implémentation dans les pages

Le bouton a été ajouté à toutes les pages supplier et admin :

### Pages Supplier

- Documents
- Analytics
- Settings
- Reviews
- Messages
- Shipments
- Customers
- Orders
- Products

### Pages Admin

- Users (exemple)

Chaque page utilise le même pattern :

```tsx
<BackButton
  to="/supplier/dashboard"
  label="Retour au tableau de bord"
  variant="ghost"
/>
```
