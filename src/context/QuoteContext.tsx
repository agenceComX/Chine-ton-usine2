import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductListItem } from '../services/productService';

export interface QuoteItem {
    productId: string;
    product: ProductListItem;
    quantity: number;
    variants: Record<string, string>; // type -> variantId
    unitPrice: number;
    totalPrice: number;
    addedAt: Date;
}

interface QuoteContextType {
    items: QuoteItem[];
    addToQuote: (product: ProductListItem, quantity: number, variants?: Record<string, string>) => void;
    removeFromQuote: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    updateVariants: (productId: string, variants: Record<string, string>) => void;
    getItemQuantity: (productId: string) => number;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    clearQuote: () => void;
    isInQuote: (productId: string) => boolean;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

const QUOTE_STORAGE_KEY = 'chine-ton-usine-quote';

export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<QuoteItem[]>([]);

    // Charger le devis depuis le localStorage au montage
    useEffect(() => {
        const savedQuote = localStorage.getItem(QUOTE_STORAGE_KEY);
        if (savedQuote) {
            try {
                const quoteItems = JSON.parse(savedQuote);
                // Convertir les dates string en objets Date
                const parsedItems = quoteItems.map((item: any) => ({
                    ...item,
                    addedAt: new Date(item.addedAt)
                }));
                setItems(parsedItems);
            } catch (error) {
                console.error('Erreur lors du chargement du devis:', error);
            }
        }
    }, []);

    // Sauvegarder le devis dans le localStorage à chaque changement
    useEffect(() => {
        localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const calculateItemPrice = (product: ProductListItem, quantity: number, variants: Record<string, string> = {}) => {
        let unitPrice = product.price;

        // Ajouter le prix des variantes (si disponibles)
        // Note: Pour simplifier, on considère que les variantes n'ont pas de prix supplémentaire ici
        // Dans une vraie app, il faudrait récupérer les données complètes du produit

        let totalPrice = unitPrice * quantity;

        // Appliquer les réductions si disponibles
        if (product.discount && quantity >= product.discount.minQty) {
            totalPrice = totalPrice * (1 - product.discount.percentage / 100);
        }

        return { unitPrice, totalPrice };
    };

    const addToQuote = (product: ProductListItem, quantity: number, variants: Record<string, string> = {}) => {
        const existingItemIndex = items.findIndex(item => item.productId === product.id);

        const { unitPrice, totalPrice } = calculateItemPrice(product, quantity, variants);

        if (existingItemIndex >= 0) {
            // Mettre à jour l'élément existant
            setItems(prev => prev.map((item, index) =>
                index === existingItemIndex
                    ? {
                        ...item,
                        quantity,
                        variants,
                        unitPrice,
                        totalPrice,
                        addedAt: new Date()
                    }
                    : item
            ));
        } else {
            // Ajouter un nouvel élément
            const newItem: QuoteItem = {
                productId: product.id!,
                product,
                quantity,
                variants,
                unitPrice,
                totalPrice,
                addedAt: new Date()
            };
            setItems(prev => [...prev, newItem]);
        }
    };

    const removeFromQuote = (productId: string) => {
        setItems(prev => prev.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setItems(prev => prev.map(item => {
            if (item.productId === productId) {
                const { unitPrice, totalPrice } = calculateItemPrice(item.product, quantity, item.variants);
                return {
                    ...item,
                    quantity,
                    unitPrice,
                    totalPrice
                };
            }
            return item;
        }));
    };

    const updateVariants = (productId: string, variants: Record<string, string>) => {
        setItems(prev => prev.map(item => {
            if (item.productId === productId) {
                const { unitPrice, totalPrice } = calculateItemPrice(item.product, item.quantity, variants);
                return {
                    ...item,
                    variants,
                    unitPrice,
                    totalPrice
                };
            }
            return item;
        }));
    };

    const getItemQuantity = (productId: string) => {
        const item = items.find(item => item.productId === productId);
        return item ? item.quantity : 0;
    };

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + item.totalPrice, 0);
    };

    const clearQuote = () => {
        setItems([]);
    };

    const isInQuote = (productId: string) => {
        return items.some(item => item.productId === productId);
    };

    const value: QuoteContextType = {
        items,
        addToQuote,
        removeFromQuote,
        updateQuantity,
        updateVariants,
        getItemQuantity,
        getTotalItems,
        getTotalPrice,
        clearQuote,
        isInQuote
    };

    return (
        <QuoteContext.Provider value={value}>
            {children}
        </QuoteContext.Provider>
    );
};

export const useQuote = () => {
    const context = useContext(QuoteContext);
    if (!context) {
        throw new Error('useQuote must be used within a QuoteProvider');
    }
    return context;
};
