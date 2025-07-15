import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Cache global pour les données
const dataCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Configuration par défaut
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Utilitaires de cache
export const cacheUtils = {
    set: (key: string, data: any, ttl: number = DEFAULT_CACHE_TTL) => {
        dataCache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    },

    get: (key: string) => {
        const cached = dataCache.get(key);
        if (!cached) return null;

        if (Date.now() - cached.timestamp > cached.ttl) {
            dataCache.delete(key);
            return null;
        }

        return cached.data;
    },

    invalidate: (key: string) => {
        dataCache.delete(key);
    },

    clear: () => {
        dataCache.clear();
    },

    clearPattern: (pattern: string) => {
        for (const key of dataCache.keys()) {
            if (key.includes(pattern)) {
                dataCache.delete(key);
            }
        }
    }
};

// Hook pour debounce optimisé
export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Hook pour API optimisée avec cache
interface UseOptimizedApiOptions {
    cacheKey?: string;
    cacheTTL?: number;
    enableCache?: boolean;
    retryCount?: number;
    retryDelay?: number;
}

export function useOptimizedApi<T>(
    apiFunction: () => Promise<T>,
    dependencies: any[] = [],
    options: UseOptimizedApiOptions = {}
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [lastFetch, setLastFetch] = useState<number>(0);

    const abortControllerRef = useRef<AbortController | null>(null);

    const {
        cacheKey,
        cacheTTL = DEFAULT_CACHE_TTL,
        enableCache = true,
        retryCount = 3,
        retryDelay = 1000
    } = options;

    // Génération automatique de la clé de cache
    const effectiveCacheKey = useMemo(() => {
        return cacheKey || `api-${JSON.stringify(dependencies)}`;
    }, [cacheKey, dependencies]);

    const fetchData = useCallback(async (skipCache = false) => {
        // Annuler la requête précédente
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        // Vérifier le cache d'abord
        if (enableCache && !skipCache) {
            const cachedData = cacheUtils.get(effectiveCacheKey);
            if (cachedData) {
                setData(cachedData);
                setError(null);
                setLoading(false);
                return;
            }
        }

        setLoading(true);
        setError(null);

        let retries = 0;

        const attemptFetch = async (): Promise<void> => {
            try {
                const result = await apiFunction();

                if (enableCache) {
                    cacheUtils.set(effectiveCacheKey, result, cacheTTL);
                }

                setData(result);
                setError(null);
                setLastFetch(Date.now());
            } catch (err) {
                if (retries < retryCount) {
                    retries++;
                    await new Promise(resolve => setTimeout(resolve, retryDelay * retries));
                    return attemptFetch();
                }

                const error = err instanceof Error ? err : new Error('API call failed');
                setError(error);
                console.error('API Error:', error);
            } finally {
                setLoading(false);
            }
        };

        await attemptFetch();
    }, [apiFunction, effectiveCacheKey, enableCache, cacheTTL, retryCount, retryDelay]);

    // Fetch initial et re-fetch sur changement des dépendances
    useEffect(() => {
        fetchData();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, dependencies);

    const refetch = useCallback(() => {
        return fetchData(true);
    }, [fetchData]);

    const isStale = useMemo(() => {
        if (!enableCache) return false;
        const cached = dataCache.get(effectiveCacheKey);
        return !cached || Date.now() - cached.timestamp > cacheTTL;
    }, [effectiveCacheKey, enableCache, cacheTTL, lastFetch]);

    return {
        data,
        loading,
        error,
        refetch,
        isStale,
        lastFetch: new Date(lastFetch)
    };
}

// Hook pour recherche avec debounce
export function useDebouncedSearch<T>(
    searchFunction: (query: string) => Promise<T[]>,
    searchTerm: string,
    delay: number = 300,
    options: UseOptimizedApiOptions = {}
) {
    const debouncedSearchTerm = useDebounce(searchTerm, delay);

    const searchApi = useCallback(() => {
        if (!debouncedSearchTerm.trim()) {
            return Promise.resolve([]);
        }
        return searchFunction(debouncedSearchTerm);
    }, [searchFunction, debouncedSearchTerm]);

    return useOptimizedApi<T[]>(
        searchApi,
        [debouncedSearchTerm],
        {
            ...options,
            cacheKey: options.cacheKey || `search-${debouncedSearchTerm}`,
            cacheTTL: options.cacheTTL || 60000 // 1 minute pour les recherches
        }
    );
}

// Hook pour mutations optimisées
interface UseMutationOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    invalidateCache?: string | string[];
    optimisticUpdate?: (data: any) => void;
}

export function useOptimizedMutation<TData, TVariables>(
    mutationFunction: (variables: TVariables) => Promise<TData>,
    options: UseMutationOptions<TData> = {}
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(async (variables: TVariables) => {
        setLoading(true);
        setError(null);

        // Mise à jour optimiste
        if (options.optimisticUpdate) {
            options.optimisticUpdate(variables);
        }

        try {
            const result = await mutationFunction(variables);

            // Invalidation du cache
            if (options.invalidateCache) {
                const cacheKeys = Array.isArray(options.invalidateCache)
                    ? options.invalidateCache
                    : [options.invalidateCache];

                cacheKeys.forEach(key => {
                    if (key.includes('*')) {
                        cacheUtils.clearPattern(key.replace('*', ''));
                    } else {
                        cacheUtils.invalidate(key);
                    }
                });
            }

            options.onSuccess?.(result);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Mutation failed');
            setError(error);
            options.onError?.(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [mutationFunction, options]);

    return {
        mutate,
        loading,
        error
    };
}

// Hook pour local storage avec cache
export function useOptimizedLocalStorage<T>(
    key: string,
    initialValue: T,
    options: { syncAcrossTabs?: boolean } = {}
) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    // Synchronisation entre onglets
    useEffect(() => {
        if (!options.syncAcrossTabs) return;

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error(`Error parsing localStorage key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, options.syncAcrossTabs]);

    return [storedValue, setValue] as const;
}

// Hook pour intersection observer optimisé
export function useIntersectionObserver(
    ref: React.RefObject<Element>,
    options: IntersectionObserverInit = {}
) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasIntersected, setHasIntersected] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            if (entry.isIntersecting && !hasIntersected) {
                setHasIntersected(true);
            }
        }, {
            threshold: 0.1,
            rootMargin: '50px',
            ...options
        });

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [ref, options, hasIntersected]);

    return { isIntersecting, hasIntersected };
}

// Hook pour performance monitoring
export function usePerformanceMonitor(label: string) {
    const startTimeRef = useRef<number>(0);

    const start = useCallback(() => {
        startTimeRef.current = performance.now();
    }, []);

    const end = useCallback(() => {
        if (startTimeRef.current === 0) return 0;

        const duration = performance.now() - startTimeRef.current;
        startTimeRef.current = 0;

        if (process.env.NODE_ENV === 'development') {
            console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
        }

        return duration;
    }, [label]);

    const measure = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
        start();
        try {
            return await fn();
        } finally {
            end();
        }
    }, [start, end]);

    return { start, end, measure };
}
