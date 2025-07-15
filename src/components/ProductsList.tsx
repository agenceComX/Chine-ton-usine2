import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const ProductsList: React.FC = () => {
    const { products, loading, error } = useProducts();

    if (loading) {
        return <LoadingSpinner size="lg" />;
    }

    if (error) {
        return <div className="text-red-600">Erreur : {error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Produits disponibles dans Firebase</h2>
            <div className="grid gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                                <p className="text-blue-600 font-bold">{product.price.toFixed(2)}€ / unité</p>
                                <p className="text-gray-500 text-sm">MOQ: {product.moq} | Stock: {product.stock}</p>
                                <p className="text-gray-400 text-xs">ID Firebase: {product.id}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link
                                    to={`/product/${product.id}`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center text-sm"
                                >
                                    Voir détail
                                </Link>
                                <Link
                                    to="/products"
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-center text-sm"
                                >
                                    Voir liste
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <Link
                    to="/products"
                    className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                    Aller à la page produits B2B
                </Link>
            </div>
        </div>
    );
};

export default ProductsList;
