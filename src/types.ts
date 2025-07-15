export type UserLanguage = 'en' | 'fr' | 'es' | 'ar' | 'zh' | 'pt' | 'de';
export type UserCurrency = 'USD' | 'EUR' | 'GBP' | 'CNY' | 'ECOM' | 'XOF';
export type UserRole = 'customer' | 'supplier' | 'admin' | 'sourcer' | 'influencer';

// Interface pour la création d'utilisateurs
export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive?: boolean;
}

export interface User {
  uid?: string; // UID Firebase (optionnel pour compatibilité)
  id: string;
  email: string;
  role: UserRole;
  name: string;
  company?: string;
  subscription: 'free' | 'premium';
  favorites: string[];
  browsingHistory: string[];
  messages: any[];
  stripeCustomerId?: string;
  subscriptionId?: string;
  language?: UserLanguage;
  currency?: UserCurrency;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  createdAt?: string; // Alias pour created_at
  updatedAt?: string; // Alias pour updated_at
  lastLogin?: string; // Alias pour last_login
  isActive?: boolean; // Statut actif/inactif
  phone?: string; // Numéro de téléphone
  address?: string; // Adresse
}

export interface Supplier {
  id: string;
  name: string;
  description?: string;
  location: string;
  rating?: number;
  verified?: boolean;
  products?: string[];
  email?: string;
}

export interface Product {
  id: string;
  name: Record<UserLanguage, string>;
  description: Record<UserLanguage, string>;
  price: { cny: number; unitCny: number; };
  images: string[];
  category: string;
  supplier: Supplier;
  moq: number;
  certifiedCE: boolean;
  origin?: string;
  material?: string;
  brand?: string;
  modelNumber?: string;
  application?: string;
  style?: string;
  specifications?: Record<string, string | number | boolean>;
  createdAt?: Date;
  updatedAt?: Date;
  // Nouvelles propriétés pour le UI amélioré
  discount?: number; // Pourcentage de remise
  featured?: string[]; // Liste des fonctionnalités/caractéristiques
  isPopular?: boolean; // Produit populaire
  isNew?: boolean; // Nouveau produit
  rating?: number; // Note du produit
  reviewCount?: number; // Nombre d'avis
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Order {
  id: string;
  userId: string;
  supplierId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  currency: UserCurrency;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: UserCurrency;
  features: string[];
  isPopular?: boolean;
}

export type ContainerStatus = 'active' | 'closed';

export interface Container {
  id: string;
  name: string;
  departureLocation: string;
  arrivalLocation: string;
  estimatedDepartureDate: string;
  totalCapacity: number;
  usedCapacity: number;
  status: ContainerStatus;
}

export interface ContainerItem {
  id: string;
  containerId: string;
  productId: string;
  quantity: number;
  userId: string;
}