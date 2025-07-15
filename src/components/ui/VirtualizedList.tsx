import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

// Hook de debounce simple
function useDebounce<T>(value: T, delay: number): T {
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
}

interface VirtualizedListProps<T> {
    items: T[];
    height: number;
    itemHeight: number;
    renderItem: (props: { index: number; style: React.CSSProperties; data: T[] }) => React.ReactElement;
    searchFields?: (keyof T)[];
    onSearch?: (searchTerm: string) => void;
    filterComponent?: React.ReactNode;
    emptyMessage?: string;
    loading?: boolean;
}

// Composant pour chaque item de la liste
const VirtualizedItem = memo(({ index, style, data, renderItem }: any) => {
    return (
        <div style={style}>
            {renderItem({ index, style, data })}
        </div>
    );
});

VirtualizedItem.displayName = 'VirtualizedItem';

// Composant de loading pour la liste
const ListSkeleton = memo(({ height, itemHeight }: { height: number; itemHeight: number }) => {
    const itemCount = Math.ceil(height / itemHeight);

    return (
        <div className="space-y-2">
            {Array.from({ length: itemCount }, (_, index) => (
                <div
                    key={index}
                    className="animate-pulse bg-gray-200 rounded"
                    style={{ height: itemHeight - 8 }}
                />
            ))}
        </div>
    );
});

ListSkeleton.displayName = 'ListSkeleton';

function VirtualizedList<T extends Record<string, any>>({
    items,
    height,
    itemHeight,
    renderItem,
    searchFields = [],
    onSearch,
    filterComponent,
    emptyMessage = 'Aucun élément trouvé',
    loading = false
}: VirtualizedListProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Filtrage des items basé sur la recherche
    const filteredItems = useMemo(() => {
        if (!debouncedSearchTerm || searchFields.length === 0) {
            return items;
        }

        return items.filter(item =>
            searchFields.some(field => {
                const fieldValue = item[field];
                return fieldValue &&
                    String(fieldValue).toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            })
        );
    }, [items, debouncedSearchTerm, searchFields]);

    // Handler pour la recherche
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    }, [onSearch]);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
                    <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
                </div>
                <ListSkeleton height={height} itemHeight={itemHeight} />
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Barre de recherche et filtres */}
            <div className="mb-4 space-y-4">
                <div className="flex gap-4">
                    {/* Champ de recherche */}
                    {searchFields.length > 0 && (
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                    )}

                    {/* Bouton de filtres */}
                    {filterComponent && (
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Filter size={16} className="mr-2" />
                            Filtres
                        </button>
                    )}
                </div>

                {/* Panneau de filtres */}
                {showFilters && filterComponent && (
                    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                        {filterComponent}
                    </div>
                )}
            </div>

            {/* Indicateur de résultats */}
            <div className="mb-4 text-sm text-gray-600">
                {filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''}
                {debouncedSearchTerm && ` pour "${debouncedSearchTerm}"`}
            </div>

            {/* Liste avec pagination pour éviter la virtualisation complexe */}
            {filteredItems.length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <div className="text-center">
                        <div className="text-gray-400 mb-2">
                            <Search size={48} />
                        </div>
                        <p className="text-gray-500">{emptyMessage}</p>
                    </div>
                </div>
            ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div style={{ height }} className="overflow-y-auto">
                        {filteredItems.map((_item, index) => (
                            <div key={index} style={{ height: itemHeight }}>
                                {renderItem({ index, style: { height: itemHeight }, data: filteredItems })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(VirtualizedList) as typeof VirtualizedList;
