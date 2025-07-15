// Script simple pour migrer les produits vers Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Configuration Firebase (utilise la vraie configuration)
const firebaseConfig = {
    apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
    authDomain: "chine-ton-usine-2c999.firebaseapp.com",
    projectId: "chine-ton-usine-2c999",
    storageBucket: "chine-ton-usine-2c999.firebasestorage.app",
    messagingSenderId: "528021984213",
    appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
    measurementId: "G-23BQZPXP86"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Données des produits à migrer
const products = [
    {
        name: 'Montre Connectée Smartwatch Pro X1',
        description: 'Montre connectée haut de gamme avec écran AMOLED, GPS intégré et monitoring cardiaque.',
        longDescription: `Cette montre connectée révolutionnaire combine technologie de pointe et design élégant. 
    
Dotée d'un écran AMOLED HD de 1.4 pouces, elle offre une clarté exceptionnelle même en plein soleil. Le système GPS intégré permet un suivi précis de vos activités sportives, tandis que le capteur de fréquence cardiaque surveille votre santé 24h/24.

Avec une autonomie exceptionnelle de 7 jours en utilisation normale et une certification d'étanchéité IP68, cette montre vous accompagne dans toutes vos aventures. Compatible avec iOS et Android, elle synchronise automatiquement vos données de santé et notifications.

Parfaite pour les professionnels actifs et les sportifs exigeants, cette montre connectée redéfinit les standards de l'industrie wearable.`,
        price: 1.00,
        moq: 100,
        category: 'Électronique',
        images: [
            {
                id: '1',
                url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
                alt: 'Montre connectée vue de face'
            },
            {
                id: '2',
                url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop',
                alt: 'Montre connectée vue de profil'
            },
            {
                id: '3',
                url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop',
                alt: 'Montre connectée écran allumé'
            },
            {
                id: '4',
                url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=800&fit=crop',
                alt: 'Montre connectée avec bracelet'
            }
        ],
        variants: [
            { id: '1', name: 'Noir', type: 'color', value: '#000000', available: true },
            { id: '2', name: 'Blanc', type: 'color', value: '#FFFFFF', available: true },
            { id: '3', name: 'Rose Gold', type: 'color', value: '#E8B4A0', available: true },
            { id: '4', name: 'Argent', type: 'color', value: '#C0C0C0', available: false },
            { id: '5', name: '42mm', type: 'size', value: '42mm', available: true },
            { id: '6', name: '46mm', type: 'size', value: '46mm', available: true, price: 0.20 }
        ],
        supplier: {
            id: 'sup1',
            name: 'TechSource Manufacturing',
            location: 'Shenzhen, Chine',
            rating: 4.8,
            verified: true,
            responseTime: '< 2h',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop'
        },
        stock: 50000,
        tags: ['GPS', 'Étanche IP68', 'Bluetooth 5.0', 'Santé', 'Sport', 'Android', 'iOS'],
        deliveryTime: {
            min: 7,
            max: 15,
            unit: 'days'
        },
        specifications: {
            'Écran': 'AMOLED 1.4" HD',
            'Autonomie': '7 jours',
            'Étanchéité': 'IP68',
            'Connectivité': 'Bluetooth 5.0, WiFi',
            'Capteurs': 'Cardiaque, GPS, Accéléromètre',
            'Compatibilité': 'iOS 12+, Android 6.0+',
            'Matériau': 'Alliage d\'aluminium',
            'Poids': '45g'
        },
        discount: {
            minQty: 500,
            percentage: 15
        }
    },
    {
        name: 'Lunettes de Soleil Premium UV400',
        description: 'Lunettes de soleil polarisées avec protection UV400 et monture en alliage léger.',
        longDescription: `Ces lunettes de soleil premium offrent une protection optimale contre les rayons UV tout en conservant un style moderne et élégant.

Fabriquées avec des verres polarisés haute qualité, elles réduisent efficacement l'éblouissement et améliorent le contraste pour une vision claire en toutes circonstances. La monture en alliage ultra-léger garantit un confort de port exceptionnel même lors d'utilisations prolongées.

Le design intemporel s'adapte à tous les styles, que ce soit pour un usage professionnel ou décontracté. Ces lunettes sont parfaites pour la revente en boutiques d'optique, magasins de mode ou sites e-commerce.`,
        price: 0.50,
        moq: 200,
        category: 'Mode',
        images: [
            {
                id: '1',
                url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
                alt: 'Lunettes de soleil noires'
            },
            {
                id: '2',
                url: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&h=800&fit=crop',
                alt: 'Lunettes de soleil portées'
            },
            {
                id: '3',
                url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=800&fit=crop',
                alt: 'Lunettes de soleil sur table'
            }
        ],
        variants: [
            { id: '1', name: 'Noir', type: 'color', value: '#000000', available: true },
            { id: '2', name: 'Marron', type: 'color', value: '#8B4513', available: true },
            { id: '3', name: 'Doré', type: 'color', value: '#FFD700', available: true },
            { id: '4', name: 'Argent', type: 'color', value: '#C0C0C0', available: false }
        ],
        supplier: {
            id: 'sup2',
            name: 'Fashion Optics Ltd',
            location: 'Wenzhou, Chine',
            rating: 4.6,
            verified: true,
            responseTime: '< 4h',
            avatar: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop'
        },
        stock: 75000,
        tags: ['UV400', 'Polarisé', 'Léger', 'Mode', 'Unisexe'],
        deliveryTime: {
            min: 5,
            max: 12,
            unit: 'days'
        },
        specifications: {
            'Protection': 'UV400',
            'Verres': 'Polarisés',
            'Matériau monture': 'Alliage léger',
            'Poids': '28g',
            'Largeur': '145mm',
            'Hauteur': '50mm'
        },
        discount: {
            minQty: 1000,
            percentage: 20
        }
    },
    {
        name: 'Écouteurs Bluetooth Pro 5.0',
        description: 'Écouteurs sans fil avec réduction active du bruit et autonomie de 30 heures.',
        longDescription: `Ces écouteurs Bluetooth Pro 5.0 offrent une qualité sonore exceptionnelle avec réduction active du bruit pour une expérience d'écoute immersive.

Équipés de la technologie Bluetooth 5.0, ils garantissent une connexion stable et une latence réduite. L'autonomie exceptionnelle de 30 heures avec le boîtier de charge vous accompagne toute la journée.

Le design ergonomique et les embouts en silicone de différentes tailles assurent un confort optimal pour tous les utilisateurs. Parfaits pour le sport, le travail ou les loisirs.`,
        price: 2.30,
        moq: 50,
        category: 'Électronique',
        images: [
            {
                id: '1',
                url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
                alt: 'Écouteurs Bluetooth noirs'
            },
            {
                id: '2',
                url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
                alt: 'Écouteurs avec boîtier de charge'
            },
            {
                id: '3',
                url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop',
                alt: 'Écouteurs portés'
            }
        ],
        variants: [
            { id: '1', name: 'Noir', type: 'color', value: '#000000', available: true },
            { id: '2', name: 'Blanc', type: 'color', value: '#FFFFFF', available: true },
            { id: '3', name: 'Bleu', type: 'color', value: '#0066CC', available: true }
        ],
        supplier: {
            id: 'sup3',
            name: 'Audio Tech Solutions',
            location: 'Guangzhou, Chine',
            rating: 4.7,
            verified: true,
            responseTime: '< 1h',
            avatar: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=100&h=100&fit=crop'
        },
        stock: 25000,
        tags: ['Bluetooth 5.0', 'Réduction bruit', 'Autonomie 30h', 'Sport', 'Wireless'],
        deliveryTime: {
            min: 3,
            max: 10,
            unit: 'days'
        },
        specifications: {
            'Bluetooth': '5.0',
            'Autonomie': '30 heures',
            'Réduction bruit': 'Active',
            'Résistance': 'IPX7',
            'Drivers': '10mm',
            'Réponse fréquence': '20Hz-20kHz'
        },
        discount: {
            minQty: 200,
            percentage: 12
        }
    }
];

// Fonction pour migrer les produits
async function migrateProducts() {
    try {
        console.log('Début de la migration des produits...');

        for (const product of products) {
            const docRef = await addDoc(collection(db, 'products'), product);
            console.log(`Produit "${product.name}" ajouté avec l'ID: ${docRef.id}`);
        }

        console.log('Migration terminée avec succès !');
    } catch (error) {
        console.error('Erreur lors de la migration:', error);
    }
}

// Exécuter la migration
migrateProducts();
