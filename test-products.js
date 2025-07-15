// Test simple pour vérifier les produits
console.log('=== TEST PRODUITS ===');

// Simuler un environnement simple
const { products } = require('./src/data/products.ts');

console.log('Produits chargés:', products?.length || 'ERREUR');
if (products && products.length > 0) {
    console.log('Premier produit:', products[0]);
} else {
    console.log('AUCUN PRODUIT TROUVÉ !');
}
