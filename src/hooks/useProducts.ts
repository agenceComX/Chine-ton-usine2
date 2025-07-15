import { useState, useEffect } from 'react';
import { ProductService, ProductListItem, Product } from '../services/productService';

// Hook pour récupérer tous les produits
export const useProducts = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProducts = await ProductService.getAllProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur lors du chargement des produits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await ProductService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur lors du rechargement des produits:', err);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch };
};

// Hook pour récupérer un produit par ID
export const useProduct = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProduct = await ProductService.getProductById(productId);
        setProduct(fetchedProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur lors du chargement du produit:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const refetch = async () => {
    if (productId) {
      try {
        setLoading(true);
        setError(null);
        const fetchedProduct = await ProductService.getProductById(productId);
        setProduct(fetchedProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur lors du rechargement du produit:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return { product, loading, error, refetch };
};

// Hook pour récupérer les produits similaires
export const useSimilarProducts = (productId: string | undefined, category: string | undefined) => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId || !category) {
      setLoading(false);
      return;
    }

    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const similarProducts = await ProductService.getSimilarProducts(productId, category, 3);
        setProducts(similarProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur lors du chargement des produits similaires:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [productId, category]);

  return { products, loading, error };
};

// Hook pour les filtres de produits (côté client)
export const useProductFilters = (products: ProductListItem[]) => {
  const [filteredProducts, setFilteredProducts] = useState<ProductListItem[]>(products);
  const [filters, setFilters] = useState({
    category: 'Toutes',
    priceRange: { min: 0, max: 10 },
    moqRange: { min: 0, max: 500 }
  });

  useEffect(() => {
    const filtered = products.filter(product => {
      const categoryMatch = filters.category === 'Toutes' || product.category === filters.category;
      const priceMatch = product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
      const moqMatch = product.moq >= filters.moqRange.min && product.moq <= filters.moqRange.max;
      return categoryMatch && priceMatch && moqMatch;
    });

    setFilteredProducts(filtered);
  }, [products, filters]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'Toutes',
      priceRange: { min: 0, max: 10 },
      moqRange: { min: 0, max: 500 }
    });
  };

  return { filteredProducts, filters, updateFilters, resetFilters };
};
