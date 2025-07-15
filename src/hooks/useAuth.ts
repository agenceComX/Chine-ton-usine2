import { useState, useEffect } from 'react';

// Interface pour l'utilisateur connecté
export interface CurrentUser {
    id: string;
    name: string;
    email: string;
    type: 'supplier' | 'buyer' | 'admin';
    supplierId?: string; // ID du fournisseur si c'est un compte fournisseur
    permissions: string[];
}

// Hook pour gérer l'authentification et les permissions
export const useAuth = () => {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simuler le chargement de l'utilisateur connecté
        // En production, cela ferait appel à votre API d'authentification
        setTimeout(() => {
            // Exemple d'utilisateur fournisseur connecté
            const mockUser: CurrentUser = {
                id: 'user-1',
                name: 'Wang Lei',
                email: 'wang.lei@technomax.com',
                type: 'supplier',
                supplierId: 'supplier-1',
                permissions: [
                    'manage_business_cards',
                    'edit_profile',
                    'manage_products',
                    'view_analytics'
                ]
            };
            setUser(mockUser);
            setIsLoading(false);
        }, 500);
    }, []);

    const hasPermission = (permission: string): boolean => {
        return user?.permissions.includes(permission) || false;
    };

    const isSupplierOwner = (supplierId: string): boolean => {
        return user?.type === 'supplier' && user?.supplierId === supplierId;
    };

    const canEditSupplierProfile = (supplierId: string): boolean => {
        return isSupplierOwner(supplierId) || user?.type === 'admin';
    };

    const canManageBusinessCards = (supplierId: string): boolean => {
        return isSupplierOwner(supplierId) && hasPermission('manage_business_cards');
    };

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        hasPermission,
        isSupplierOwner,
        canEditSupplierProfile,
        canManageBusinessCards
    };
};

// Hook pour les données du fournisseur actuel
export const useSupplierData = (supplierId: string) => {
    const { user, canEditSupplierProfile, canManageBusinessCards } = useAuth();

    const isOwner = user?.type === 'supplier' && user?.supplierId === supplierId;
    const canEdit = canEditSupplierProfile(supplierId);
    const canManageCards = canManageBusinessCards(supplierId);

    return {
        isOwner,
        canEdit,
        canManageCards,
        user
    };
};
