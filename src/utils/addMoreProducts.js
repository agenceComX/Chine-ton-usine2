// Script pour ajouter plus de produits sample
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
    authDomain: "chine-ton-usine-2c999.firebaseapp.com",
    projectId: "chine-ton-usine-2c999",
    storageBucket: "chine-ton-usine-2c999.firebasestorage.app",
    messagingSenderId: "528021984213",
    appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
    measurementId: "G-23BQZPXP86"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const moreProducts = [
    {
        name: 'Chargeur Sans Fil Rapide 15W',
        description: 'Chargeur sans fil ultra-rapide compatible avec tous les smartphones Qi.',
        longDescription: `Ce chargeur sans fil rapide 15W offre une recharge ultra-efficace pour tous vos appareils compatibles Qi.

Doté de la technologie de charge rapide, il peut recharger votre smartphone jusqu'à 50% plus rapidement qu'un chargeur sans fil standard. Le design élégant avec indicateur LED s'intègre parfaitement dans tout environnement.

Protection contre la surchauffe, la surcharge et les courts-circuits pour une utilisation en toute sécurité. Compatible avec les étuis jusqu'à 5mm d'épaisseur.`,
        price: 1.80,
        moq: 100,
        category: 'Électronique',
        images: [
            {
                id: '1',
                url: 'https://images.unsplash.com/photo-1609592806003-c8b24c4e16db?w=800&h=800&fit=crop',
                alt: 'Chargeur sans fil rond'
            },
            {
                id: '2',
                url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
                alt: 'Chargeur sans fil avec téléphone'
            },
            {
                id: '3',
                url: 'https://images.unsplash.com/photo-1621570180008-3be2e4bbf56b?w=800&h=800&fit=crop',
                alt: 'Chargeur sans fil design'
            }
        ],
        variants: [
            { id: '1', name: 'Noir', type: 'color', value: '#000000', available: true },
            { id: '2', name: 'Blanc', type: 'color', value: '#FFFFFF', available: true },
            { id: '3', name: 'Bois', type: 'material', value: 'wood', available: true, price: 0.50 }
        ],
        supplier: {
            id: 'sup4',
            name: 'Wireless Power Tech',
            location: 'Shenzhen, Chine',
            rating: 4.9,
            verified: true,
            responseTime: '< 30min',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        },
        stock: 40000,
        tags: ['Qi', 'Charge rapide 15W', 'LED', 'Sécurisé', 'Universel'],
        deliveryTime: {
            min: 2,
            max: 8,
            unit: 'days'
        },
        specifications: {
            'Puissance': '15W max',
            'Compatibilité': 'Qi standard',
            'Entrée': '9V/2A, 5V/3A',
            'Distance': 'Jusqu\'à 8mm',
            'Matériau': 'ABS + PC',
            'Dimensions': '100 x 100 x 8mm'
        },
        discount: {
            minQty: 300,
            percentage: 10
        }
    },
    {
        name: 'Housse Téléphone Protection 360°',
        description: 'Housse de protection complète avec verre trempé intégré et design anti-choc.',
        longDescription: `Cette housse de protection 360° offre une sécurité maximale pour votre smartphone avec un design élégant et fonctionnel.

Fabriquée en TPU de qualité militaire et PC rigide, elle résiste aux chutes jusqu'à 2 mètres. Le verre trempé avant intégré protège l'écran sans affecter la sensibilité tactile.

Les découpes précises permettent un accès complet à tous les ports et boutons. Le design slim ne compromet pas l'esthétique de votre appareil tout en offrant une protection maximale.`,
        price: 0.75,
        moq: 500,
        category: 'Accessoires',
        images: [
            {
                id: '1',
                url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=800&fit=crop',
                alt: 'Housse téléphone transparente'
            },
            {
                id: '2',
                url: 'https://images.unsplash.com/photo-1571490165200-7e34adba4590?w=800&h=800&fit=crop',
                alt: 'Housse téléphone colorée'
            },
            {
                id: '3',
                url: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&h=800&fit=crop',
                alt: 'Housse téléphone robuste'
            }
        ],
        variants: [
            { id: '1', name: 'Transparent', type: 'color', value: 'transparent', available: true },
            { id: '2', name: 'Noir', type: 'color', value: '#000000', available: true },
            { id: '3', name: 'Bleu', type: 'color', value: '#0066CC', available: true },
            { id: '4', name: 'Rouge', type: 'color', value: '#CC0000', available: true },
            { id: '5', name: 'iPhone 14', type: 'size', value: 'iphone14', available: true },
            { id: '6', name: 'Samsung S23', type: 'size', value: 'samsungs23', available: true }
        ],
        supplier: {
            id: 'sup5',
            name: 'Mobile Accessories Pro',
            location: 'Dongguan, Chine',
            rating: 4.5,
            verified: true,
            responseTime: '< 3h',
            avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop'
        },
        stock: 100000,
        tags: ['Anti-choc', 'Verre trempé', '360°', 'TPU', 'Militaire'],
        deliveryTime: {
            min: 3,
            max: 10,
            unit: 'days'
        },
        specifications: {
            'Matériau': 'TPU + PC',
            'Protection': 'Militaire',
            'Résistance chute': '2 mètres',
            'Épaisseur': '1.5mm',
            'Verre trempé': '9H',
            'Compatibilité': 'Multi-modèles'
        },
        discount: {
            minQty: 2000,
            percentage: 25
        }
    },
    {
        name: 'Powerbank 20000mAh Ultra-Compact',
        description: 'Batterie externe haute capacité avec charge rapide et 3 ports USB.',
        longDescription: `Cette powerbank 20000mAh ultra-compacte vous assure une autonomie exceptionnelle pour tous vos appareils mobiles.

Équipée de la technologie de charge rapide 22.5W, elle peut recharger votre smartphone jusqu'à 4 fois. Les 3 ports USB permettent de charger simultanément plusieurs appareils.

L'écran LED digital affiche le niveau de batterie précis. Le design compact et léger la rend facile à transporter partout. Certifications de sécurité CE, FCC, RoHS.`,
        price: 3.50,
        moq: 50,
        category: 'Électronique',
        images: [
            {
                id: '1',
                url: 'https://images.unsplash.com/photo-1585979542925-f4c7c52b1c1c?w=800&h=800&fit=crop',
                alt: 'Powerbank noir compact'
            },
            {
                id: '2',
                url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&h=800&fit=crop',
                alt: 'Powerbank avec écran LED'
            },
            {
                id: '3',
                url: 'https://images.unsplash.com/photo-1605811748877-9a78b0b9c2b5?w=800&h=800&fit=crop',
                alt: 'Powerbank en charge'
            }
        ],
        variants: [
            { id: '1', name: 'Noir', type: 'color', value: '#000000', available: true },
            { id: '2', name: 'Blanc', type: 'color', value: '#FFFFFF', available: true },
            { id: '3', name: 'Bleu', type: 'color', value: '#0066CC', available: true },
            { id: '4', name: '20000mAh', type: 'capacity', value: '20000', available: true },
            { id: '5', name: '30000mAh', type: 'capacity', value: '30000', available: true, price: 1.00 }
        ],
        supplier: {
            id: 'sup6',
            name: 'Power Solutions Inc',
            location: 'Guangzhou, Chine',
            rating: 4.8,
            verified: true,
            responseTime: '< 1h',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
        },
        stock: 15000,
        tags: ['20000mAh', 'Charge rapide', '3 ports', 'LED', 'Compact', 'Sécurisé'],
        deliveryTime: {
            min: 5,
            max: 12,
            unit: 'days'
        },
        specifications: {
            'Capacité': '20000mAh',
            'Puissance sortie': '22.5W',
            'Ports': '3 USB + 1 USB-C',
            'Écran': 'LED digital',
            'Dimensions': '150 x 70 x 25mm',
            'Poids': '450g',
            'Sécurité': 'CE, FCC, RoHS'
        },
        discount: {
            minQty: 100,
            percentage: 15
        }
    }
];

async function addMoreProducts() {
    try {
        console.log('Ajout de produits supplémentaires...');

        for (const product of moreProducts) {
            const docRef = await addDoc(collection(db, 'products'), product);
            console.log(`Produit "${product.name}" ajouté avec l'ID: ${docRef.id}`);
        }

        console.log('Produits supplémentaires ajoutés avec succès !');
    } catch (error) {
        console.error('Erreur lors de l\'ajout:', error);
    }
}

addMoreProducts();
