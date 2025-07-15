import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Product } from '../types';
import { productsService } from '../services/productsService';
import ProductCard from './ProductCard';

// Liste des catégories (clé, nom, icône, description courte)
const categories = [
  { key: 'environment', label: 'Environnement', icon: '/categories/environment.svg', description: 'Produits et solutions pour l’environnement.' },
  { key: 'clothing', label: 'Vêtements et accessoires', icon: '/categories/clothing.svg', description: 'Mode, vêtements et accessoires.' },
  { key: 'home', label: 'Maison et jardin', icon: '/categories/home.svg', description: 'Articles pour la maison et le jardin.' },
  { key: 'beauty', label: 'Beauté', icon: '/categories/beauty.svg', description: 'Cosmétiques, soins et beauté.' },
  { key: 'auto', label: 'Pièces et accessoires auto', icon: '/categories/auto.svg', description: 'Pièces détachées et accessoires automobiles.' },
  { key: 'jewelry', label: 'Bijouterie, lunetterie', icon: '/categories/jewelry.svg', description: 'Bijoux, montres et lunettes.' },
  { key: 'tools', label: 'Outils et matériel', icon: '/categories/tools.svg', description: 'Outils professionnels et matériel.' },
  { key: 'furniture', label: 'Meubles', icon: '/categories/furniture.svg', description: 'Mobilier et ameublement.' },
  { key: 'services', label: 'Services commerciaux', icon: '/categories/services.svg', description: 'Services pour entreprises.' },
  { key: 'electronics', label: 'Électronique grand public', icon: '/categories/electronics.svg', description: 'Électronique et gadgets.' },
  { key: 'sports', label: 'Sports et loisirs', icon: '/categories/sports.svg', description: 'Articles de sport et loisirs.' },
  { key: 'machinery', label: 'Machines et équipements', icon: '/categories/machinery.svg', description: 'Machines et équipements industriels.' },
  { key: 'packaging', label: 'Emballage et impression', icon: '/categories/packaging.svg', description: 'Solutions d’emballage et impression.' },
  { key: 'industrial', label: 'Machines industrielles', icon: '/categories/industrial.svg', description: 'Machines pour l’industrie.' },
  { key: 'toys', label: 'Mère, enfants et jouets', icon: '/categories/toys.svg', description: 'Jouets, puériculture et enfants.' },
  { key: 'shoes', label: 'Chaussures et accessoires', icon: '/categories/shoes.svg', description: 'Chaussures et accessoires.' },
  { key: 'general', label: 'Autres et général', icon: '/categories/general.svg', description: 'Divers et général.' },
];

// Fonction utilitaire pour compter les produits par catégorie
function getProductCount(categoryKey: string) {
  const allProducts = productsService.getAllProducts();
  return allProducts.filter((p: Product) => p.category === categoryKey).length;
}

const CategoriesSection: React.FC<{ onCategorySelect?: (key: string|null) => void }> = ({ onCategorySelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showProducts, setShowProducts] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  // Charger les produits depuis le service centralisé
  useEffect(() => {
    const loadProducts = () => {
      const allProducts = productsService.getAllProducts();
      setFilteredProducts(allProducts);
    };
    
    // Charger les produits initialement
    loadProducts();
    
    // S'abonner aux changements pour mise à jour automatique
    const unsubscribe = productsService.subscribe(loadProducts);
    
    // Nettoyer l'abonnement au démontage
    return unsubscribe;
  }, []);

  // Synchronise l’URL et la sélection
  useEffect(() => {
    const match = location.pathname.match(/^\/categorie\/([a-z0-9-]+)/);
    if (match) {
      setActiveCategory(match[1]);
    } else {
      setActiveCategory(null);
    }
  }, [location.pathname]);
  // Filtrage dynamique
  useEffect(() => {
    const allProducts = productsService.getAllProducts();
    if (activeCategory) {
      setShowProducts(false);
      setTimeout(() => setShowProducts(true), 200);
      setFilteredProducts(allProducts.filter((p: Product) => p.category === activeCategory));
      if (onCategorySelect) onCategorySelect(activeCategory);
    } else {
      setFilteredProducts(allProducts);
      setShowProducts(true);
      if (onCategorySelect) onCategorySelect(null);
    }
  }, [activeCategory, onCategorySelect]);

  // Fil d’Ariane
  const breadcrumb = activeCategory ? (
    <nav className="text-sm text-gray-400 mb-4">
      <Link to="/" className="hover:underline">Accueil</Link> &gt; <span className="text-white font-semibold">{categories.find(c => c.key === activeCategory)?.label}</span>
    </nav>
  ) : null;

  // Gestion du clic sur une catégorie
  const handleCategoryClick = (catKey: string) => {
    navigate(`/search?category=${catKey}`);
  };

  // Bouton "Voir toutes les catégories"
  const handleAllCategories = () => {
    navigate('/categories');
  };

  return (
    <section className="bg-[#181f2c] text-white py-10 rounded-xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-1">Explorez nos catégories</h2>
        <div className="text-gray-400 mb-6">Des millions d'offres adaptées aux besoins de votre entreprise</div>
      </div>
      {breadcrumb}
      <div className="flex flex-wrap gap-6 justify-center mb-6">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => handleCategoryClick(cat.key)}
            className={`relative flex flex-col items-center justify-center bg-[#232b3e] rounded-xl px-8 py-6 min-w-[150px] min-h-[110px] shadow-md transition-all duration-200
              ${activeCategory === cat.key ? 'scale-105 bg-[#2a3350] shadow-lg' : 'hover:scale-105 hover:bg-[#2a3350]'}`}
            style={{ outline: 'none', border: 'none', cursor: 'pointer' }}
          >
            <img src={cat.icon} alt={cat.label} className="w-10 h-10 mb-2" />
            <span className="font-semibold mb-1 text-center">{cat.label}</span>
            <span className="absolute top-2 right-4 bg-green-300 text-[#181f2c] rounded-full text-xs font-bold px-3 py-1 shadow">{getProductCount(cat.key)}+</span>
          </button>
        ))}
      </div>
      <div className="text-center mt-2">
        <button
          onClick={handleAllCategories}
          className="text-blue-300 font-semibold underline hover:text-blue-400 transition"
        >
          Voir toutes les catégories &gt;
        </button>
      </div>
      {/* Animation d’ouverture des produits */}
      <div className={`transition-all duration-500 ${showProducts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              Aucun produit dans cette catégorie.
            </div>
          ) : (
            filteredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
