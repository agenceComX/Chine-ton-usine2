import { Subscription } from '../types';

export const subscriptions: Subscription[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    currency: 'EUR',
    features: [
      'Accès limité au catalogue (20 produits/jour)',
      'Recherche de base',
      'Fiches produit simplifiées',
      '1 demande de contact fournisseur/jour',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    currency: 'EUR',
    isPopular: true,
    features: [
      'Accès illimité au catalogue',
      'Recherche avancée avec tous les filtres',
      'Fiches produit détaillées',
      'Contacts fournisseurs illimités',
      'Support prioritaire',
      'Échantillons à prix réduits',
      'Traduction automatique des messages',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 199.99,
    currency: 'EUR',
    features: [
      'Tous les avantages Premium',
      'Agent personnel dédié',
      'Négociation des prix en votre nom',
      'Vérification qualité pré-expédition',
      'Gestion logistique complète',
      'Certification des produits',
      'Personnalisation des produits',
    ],
  },
];