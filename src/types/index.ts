export type UserRole = 'admin' | 'supplier' | 'customer' | 'sourcer' | 'influencer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  language: UserLanguage;
  currency: string;
  favorites: string[];
  browsingHistory: string[];
  messages: Message[];
  created_at: string;
  updated_at: string;
  last_login?: string;
  subscription?: string;
}

export type Permission = {
  id: string;
  name: string;
  description: string;
};

export type Role = {
  id: string;
  name: UserRole;
  description: string;
  permissions: Permission[];
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: {
    chinese: string;
    english: string;
    french: string;
  };
  images: string[];
  video?: {
    url: string;
    type: 'youtube' | 'vimeo' | 'direct';
    thumbnail?: string;
  };
  supplier: {
    name: string;
    email: string;
  };
  moq: number;
  price: {
    cny: number;
    unitCny: number;
  };
  pricePerUnit: boolean;
  certifiedCE: boolean;
  specifications: {
    brand: string;
    origin: string;
    style: string;
    modelNumber: string;
    application: string;
    material: string;
    additionalSpecs?: Record<string, string>;
  };
};

export type Message = {
  id: string;
  supplierId: string;
  supplierName: string;
  content: string;
  date: string;
};

export type UserLanguage = 'fr' | 'en' | 'es' | 'zh' | 'pt' | 'de' | 'ar';

export type UserCurrency = 'EUR' | 'USD' | 'GBP' | 'CNY' | 'AED';

export type SubscriptionTier = 'free' | 'premium' | 'business';

export type ExchangeRates = {
  EUR: number;
  USD: number;
  GBP: number;
  CNY: number;
  AED: number;
};

export type Subscription = {
  id: string;
  name: string;
  price: number;
  currency: UserCurrency;
  features: string[];
  isPopular?: boolean;
};

// Interface pour la compatibilité avec la base de données
export type DatabaseUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  language: UserLanguage;
  currency: UserCurrency;
  subscription: SubscriptionTier;
  favorites: string[]; // JSON array dans la DB
  messages: Message[]; // JSON array dans la DB
  browsing_history: string[]; // JSON array dans la DB
  created_at: string;
  updated_at: string;
  last_login?: string;
};

export type ContainerStatus = 'active' | 'closed';

export interface Container {
  id: string;
  name: string;
  departureLocation: string;
  arrivalLocation: string;
  estimatedDepartureDate: string; // ISO Date string, e.g., 'YYYY-MM-DD'
  totalCapacity: number; // in units, e.g., cubic meters, kg, or number of items
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