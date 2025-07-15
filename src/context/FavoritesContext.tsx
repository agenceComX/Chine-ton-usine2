import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductListItem } from '../services/productService';

interface FavoritesContextType {
    favorites: Set<string>;
    addToFavorites: (productId: string) => void;
    removeFromFavorites: (productId: string) => void;
    toggleFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
    getFavoriteProducts: () => string[];
    clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'chine-ton-usine-favorites';

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Charger les favoris depuis le localStorage au montage
    useEffect(() => {
        const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (savedFavorites) {
            try {
                const favoriteIds = JSON.parse(savedFavorites);
                setFavorites(new Set(favoriteIds));
            } catch (error) {
                console.error('Erreur lors du chargement des favoris:', error);
            }
        }
    }, []);

    // Sauvegarder les favoris dans le localStorage à chaque changement
    useEffect(() => {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
    }, [favorites]);

    const addToFavorites = (productId: string) => {
        setFavorites(prev => new Set(prev).add(productId));
    };

    const removeFromFavorites = (productId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            newFavorites.delete(productId);
            return newFavorites;
        });
    };

    const toggleFavorite = (productId: string) => {
        if (favorites.has(productId)) {
            removeFromFavorites(productId);
        } else {
            addToFavorites(productId);
        }
    };

    const isFavorite = (productId: string) => {
        return favorites.has(productId);
    };

    const getFavoriteProducts = () => {
        return Array.from(favorites);
    };

    const clearFavorites = () => {
        setFavorites(new Set());
    };

    const value: FavoritesContextType = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        getFavoriteProducts,
        clearFavorites
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
