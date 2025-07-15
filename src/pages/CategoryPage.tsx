import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Grid, List } from 'lucide-react';

// Données de catégories avec des produits d'exemple
const categoryData: Record<string, { name: string; icon: string; products: any[] }> = {
  electronics: {
    name: 'Électronique',
    icon: '📱',
    products: [
      { id: 1, name: 'Smartphone Pro X', price: 299, image: '/api/placeholder/300/300' },
      { id: 2, name: 'Écouteurs Bluetooth', price: 49, image: '/api/placeholder/300/300' },
      { id: 3, name: 'Tablette HD 10"', price: 199, image: '/api/placeholder/300/300' },
      { id: 4, name: 'Montre Connectée', price: 89, image: '/api/placeholder/300/300' },
    ]
  },
  fashion: {
    name: 'Mode',
    icon: '👔',
    products: [
      { id: 5, name: 'T-shirt Premium', price: 19, image: '/api/placeholder/300/300' },
      { id: 6, name: 'Jean Slim Fit', price: 39, image: '/api/placeholder/300/300' },
      { id: 7, name: 'Veste Casual', price: 59, image: '/api/placeholder/300/300' },
      { id: 8, name: 'Sneakers Sport', price: 79, image: '/api/placeholder/300/300' },
    ]
  },
  home: {
    name: 'Maison',
    icon: '🏠',
    products: [
      { id: 9, name: 'Lampe LED Design', price: 29, image: '/api/placeholder/300/300' },
      { id: 10, name: 'Coussin Décoratif', price: 15, image: '/api/placeholder/300/300' },
      { id: 11, name: 'Tapis Moderne', price: 89, image: '/api/placeholder/300/300' },
      { id: 12, name: 'Vase Céramique', price: 25, image: '/api/placeholder/300/300' },
    ]
  },
  beauty: {
    name: 'Beauté',
    icon: '💄',
    products: [
      { id: 13, name: 'Sérum Anti-Âge', price: 45, image: '/api/placeholder/300/300' },
      { id: 14, name: 'Rouge à Lèvres Mat', price: 12, image: '/api/placeholder/300/300' },
      { id: 15, name: 'Crème Hydratante', price: 28, image: '/api/placeholder/300/300' },
      { id: 16, name: 'Palette Maquillage', price: 35, image: '/api/placeholder/300/300' },
    ]
  },
  sports: {
    name: 'Sport',
    icon: '⚽',
    products: [
      { id: 17, name: 'Ballon de Football', price: 25, image: '/api/placeholder/300/300' },
      { id: 18, name: 'Raquette de Tennis', price: 89, image: '/api/placeholder/300/300' },
      { id: 19, name: 'Tapis de Yoga', price: 35, image: '/api/placeholder/300/300' },
      { id: 20, name: 'Haltères 5kg', price: 45, image: '/api/placeholder/300/300' },
    ]
  },
  automotive: {
    name: 'Auto',
    icon: '🚗',
    products: [
      { id: 21, name: 'Chargeur USB Auto', price: 15, image: '/api/placeholder/300/300' },
      { id: 22, name: 'Support Téléphone', price: 12, image: '/api/placeholder/300/300' },
      { id: 23, name: 'Aspirateur Auto', price: 45, image: '/api/placeholder/300/300' },
      { id: 24, name: 'Tapis de Sol', price: 35, image: '/api/placeholder/300/300' },
    ]
  },
  tools: {
    name: 'Outils',
    icon: '🔧',
    products: [
      { id: 25, name: 'Perceuse Sans Fil', price: 89, image: '/api/placeholder/300/300' },
      { id: 26, name: 'Kit Tournevis', price: 25, image: '/api/placeholder/300/300' },
      { id: 27, name: 'Marteau Multifonction', price: 35, image: '/api/placeholder/300/300' },
      { id: 28, name: 'Boîte à Outils', price: 55, image: '/api/placeholder/300/300' },
    ]
  },
  toys: {
    name: 'Jouets',
    icon: '🧸',
    products: [
      { id: 29, name: 'Puzzle 1000 pièces', price: 18, image: '/api/placeholder/300/300' },
      { id: 30, name: 'Peluche Ours', price: 22, image: '/api/placeholder/300/300' },
      { id: 31, name: 'Jeu de Construction', price: 45, image: '/api/placeholder/300/300' },
      { id: 32, name: 'Robot Télécommandé', price: 65, image: '/api/placeholder/300/300' },
    ]
  },
  books: {
    name: 'Livres',
    icon: '📚',
    products: [
      { id: 33, name: 'Roman Bestseller', price: 12, image: '/api/placeholder/300/300' },
      { id: 34, name: 'Guide Cuisine', price: 25, image: '/api/placeholder/300/300' },
      { id: 35, name: 'Livre Développement', price: 35, image: '/api/placeholder/300/300' },
      { id: 36, name: 'BD Aventure', price: 15, image: '/api/placeholder/300/300' },
    ]
  },
  music: {
    name: 'Musique',
    icon: '🎵',
    products: [
      { id: 37, name: 'Guitare Acoustique', price: 129, image: '/api/placeholder/300/300' },
      { id: 38, name: 'Casque Audio Pro', price: 89, image: '/api/placeholder/300/300' },
      { id: 39, name: 'Microphone USB', price: 55, image: '/api/placeholder/300/300' },
      { id: 40, name: 'Enceinte Portable', price: 45, image: '/api/placeholder/300/300' },
    ]
  },
  garden: {
    name: 'Jardin',
    icon: '🌱',
    products: [
      { id: 41, name: 'Kit Graines Bio', price: 15, image: '/api/placeholder/300/300' },
      { id: 42, name: 'Arrosoir Design', price: 25, image: '/api/placeholder/300/300' },
      { id: 43, name: 'Sécateur Pro', price: 35, image: '/api/placeholder/300/300' },
      { id: 44, name: 'Pot Terre Cuite', price: 18, image: '/api/placeholder/300/300' },
    ]
  },
  food: {
    name: 'Alimentation',
    icon: '🍎',
    products: [
      { id: 45, name: 'Miel Bio 500g', price: 12, image: '/api/placeholder/300/300' },
      { id: 46, name: 'Thé Vert Premium', price: 18, image: '/api/placeholder/300/300' },
      { id: 47, name: 'Épices du Monde', price: 25, image: '/api/placeholder/300/300' },
      { id: 48, name: 'Chocolat Artisanal', price: 15, image: '/api/placeholder/300/300' },
    ]
  },
};

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const category = categoryId ? categoryData[categoryId] : null;

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Catégorie non trouvée</h1>
          <p className="text-gray-600 mb-8">La catégorie que vous recherchez n'existe pas.</p>
          <Link 
            to="/" 
            className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-200"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-400 rounded-full flex items-center justify-center text-white text-xl">
                  {category.icon}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            {category.products.length} produits trouvés dans {category.name}
          </p>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold text-orange-600">{product.price}€</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">{product.price}€</span>
                    <button className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:from-blue-600 hover:to-orange-600 transition-all duration-200">
                      Voir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {category.products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-6 flex items-center space-x-6"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm">Produit de qualité premium</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-blue-600">{product.price}€</span>
                  <button className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-200">
                    Voir le produit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
