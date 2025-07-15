import { ProductService, Product } from '../services/productService';

// Données mock à migrer vers Firebase
const mockProductsData: Omit<Product, 'id'>[] = [
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
                url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop',
                alt: 'Collection de lunettes'
            }
        ],
        variants: [
            { id: '1', name: 'Noir', type: 'color', value: '#000000', available: true },
            { id: '2', name: 'Marron', type: 'color', value: '#8B4513', available: true },
            { id: '3', name: 'Bleu', type: 'color', value: '#4169E1', available: true },
            { id: '4', name: 'Standard', type: 'size', value: 'Standard', available: true },
            { id: '5', name: 'Large', type: 'size', value: 'Large', available: true, price: 0.10 }
        ],
        supplier: {
            id: 'sup2',
            name: 'Fashion Forward Co',
            location: 'Guangzhou, Chine',
            rating: 4.6,
            verified: true,
            responseTime: '< 4h',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        },
        stock: 25000,
        tags: ['UV400', 'Polarisé', 'Mode', 'Léger', 'Unisexe'],
        deliveryTime: {
            min: 5,
            max: 12,
            unit: 'days'
        },
        specifications: {
            'Protection': 'UV400',
            'Verres': 'Polarisés anti-reflet',
            'Monture': 'Alliage ultra-léger',
            'Poids': '25g',
            'Largeur': '145mm',
            'Hauteur': '50mm',
            'Pont': '18mm'
        },
        discount: {
            minQty: 1000,
            percentage: 20
        }
    },
    {
        name: 'Écouteurs Bluetooth 5.0 TWS Pro',
        description: 'Écouteurs sans fil avec réduction de bruit active et autonomie 24h.',
        longDescription: `Ces écouteurs True Wireless offrent une expérience audio exceptionnelle avec leur technologie de réduction de bruit active et leur qualité sonore premium.

Équipés de la dernière puce Bluetooth 5.0, ils garantissent une connexion stable et une latence minimale. L'autonomie exceptionnelle de 6h par écouteur (24h avec le boîtier) vous accompagne toute la journée.

Le design ergonomique assure un confort optimal même lors d'utilisations prolongées. Résistants à l'eau IPX7, ils sont parfaits pour le sport et les activités en extérieur. Compatible avec tous les appareils Bluetooth.`,
        price: 2.30,
        moq: 120,
        category: 'Électronique',
        images: [
            {
                id: '1',
                url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
                alt: 'Écouteurs Bluetooth dans leur boîtier'
            },
            {
                id: '2',
                url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
                alt: 'Écouteurs en cours d\'utilisation'
            },
            {
                id: '3',
                url: 'https://images.unsplash.com/photo-1608156639585-b3a35e2d4fb7?w=800&h=800&fit=crop',
                alt: 'Boîtier de charge ouvert'
            }
        ],
        variants: [
            { id: '1', name: 'Noir', type: 'color', value: '#000000', available: true },
            { id: '2', name: 'Blanc', type: 'color', value: '#FFFFFF', available: true },
            { id: '3', name: 'Bleu', type: 'color', value: '#4169E1', available: true }
        ],
        supplier: {
            id: 'sup3',
            name: 'AudioTech Solutions',
            location: 'Shenzhen, Chine',
            rating: 4.7,
            verified: true,
            responseTime: '< 1h',
            avatar: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=100&h=100&fit=crop'
        },
        stock: 18000,
        tags: ['Bluetooth 5.0', 'TWS', 'Réduction bruit', 'IPX7', 'Sport'],
        deliveryTime: {
            min: 10,
            max: 18,
            unit: 'days'
        },
        specifications: {
            'Bluetooth': '5.0',
            'Autonomie écouteurs': '6h',
            'Autonomie totale': '24h',
            'Réduction de bruit': 'ANC active',
            'Résistance': 'IPX7',
            'Pilotes': '13mm graphène',
            'Poids': '5g par écouteur'
        }
    },
    {
        name: 'Sac à Dos Ordinateur Business',
        description: 'Sac à dos professionnel avec compartiment laptop 15.6" et port USB.',
        longDescription: `Ce sac à dos business combine fonctionnalité et élégance pour répondre aux besoins des professionnels modernes.

Conçu avec un compartiment dédié pour ordinateurs portables jusqu'à 15.6 pouces, il offre une protection optimale grâce à son rembourrage haute densité. Le port USB intégré permet de charger vos appareils en déplacement.

Fabriqué en tissu imperméable haute qualité, il résiste aux intempéries et à l'usure quotidienne. Les multiples compartiments organisent efficacement vos affaires : documents, câbles, power bank, et accessoires.

Parfait pour les voyages d'affaires, l'usage quotidien ou comme cadeau corporate.`,
        price: 3.20,
        moq: 100,
        category: 'Bagagerie',
        images: [
            {
                id: '1',
                url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
                alt: 'Sac à dos business noir'
            },
            {
                id: '2',
                url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&h=800&fit=crop',
                alt: 'Sac à dos porté'
            },
            {
                id: '3',
                url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop',
                alt: 'Compartiments intérieurs'
            }
        ],
        variants: [
            { id: '1', name: 'Noir', type: 'color', value: '#000000', available: true },
            { id: '2', name: 'Gris', type: 'color', value: '#808080', available: true },
            { id: '3', name: 'Bleu Marine', type: 'color', value: '#000080', available: true }
        ],
        supplier: {
            id: 'sup4',
            name: 'BagCraft Industries',
            location: 'Dongguan, Chine',
            rating: 4.5,
            verified: true,
            responseTime: '< 3h',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        },
        stock: 15000,
        tags: ['Business', 'USB Port', 'Imperméable', '15.6"', 'Ergonomique'],
        deliveryTime: {
            min: 8,
            max: 16,
            unit: 'days'
        },
        specifications: {
            'Capacité laptop': '15.6 pouces max',
            'Matériau': 'Polyester 1680D',
            'Imperméabilité': 'Oui',
            'Port USB': 'Intégré',
            'Dimensions': '45x30x15 cm',
            'Poids': '850g',
            'Compartiments': '6 poches'
        }
    },
    {
        name: 'Chargeur Sans Fil Rapide 15W Qi',
        description: 'Chargeur sans fil compatible Qi avec charge rapide 15W et LED indicateur.',
        longDescription: `Ce chargeur sans fil nouvelle génération offre une charge rapide et sécurisée pour tous vos appareils compatibles Qi.

Avec sa puissance de 15W, il charge vos smartphones jusqu'à 2x plus rapidement qu'un chargeur sans fil standard. Le design ultra-fin et élégant s'intègre parfaitement sur n'importe quel bureau ou table de chevet.

Les LED indicatrices informent du statut de charge en temps réel, tandis que les protections intégrées préviennent la surchauffe et les surtensions. Compatible avec iPhone, Samsung Galaxy, et tous les appareils Qi.

Design moderne et épuré, parfait pour les environnements professionnels ou domestiques haut de gamme.`,
        price: 1.80,
        moq: 150,
        category: 'Électronique',
        images: [
            {
                id: '1',
                url: 'https://images.unsplash.com/photo-1609592806003-c8b24c4e16db?w=800&h=800&fit=crop',
                alt: 'Chargeur sans fil en charge'
            },
            {
                id: '2',
                url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
                alt: 'Chargeur sans fil vue de profil'
            },
            {
                id: '3',
                url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&h=800&fit=crop',
                alt: 'Smartphone en charge'
            }
        ],
        variants: [
            { id: '1', name: 'Blanc', type: 'color', value: '#FFFFFF', available: true },
            { id: '2', name: 'Noir', type: 'color', value: '#000000', available: true },
            { id: '3', name: 'Transparent', type: 'color', value: 'transparent', available: true }
        ],
        supplier: {
            id: 'sup5',
            name: 'PowerTech Solutions',
            location: 'Shenzhen, Chine',
            rating: 4.9,
            verified: true,
            responseTime: '< 1h',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        },
        stock: 40000,
        tags: ['Qi', '15W', 'LED', 'Ultra-fin', 'Protection'],
        deliveryTime: {
            min: 5,
            max: 10,
            unit: 'days'
        },
        specifications: {
            'Puissance': '15W max',
            'Standard': 'Qi compatible',
            'Épaisseur': '8mm',
            'Matériau': 'Alliage + Verre',
            'LED': 'Indicateur de charge',
            'Protection': 'Surchauffe, surtension',
            'Compatibilité': 'iPhone, Samsung, etc.'
        },
        discount: {
            minQty: 500,
            percentage: 12
        }
    },
    {
        name: 'Lampe LED Bureau Pliable Touch',
        description: 'Lampe de bureau LED avec bras articulé, 3 modes de couleur et dimmer tactile.',
        longDescription: `Cette lampe de bureau intelligente révolutionne votre espace de travail avec ses fonctionnalités avancées et son design moderne.

Équipée de LEDs haute qualité, elle offre 3 modes de température de couleur (chaud, neutre, froid) pour s'adapter à tous vos besoins : lecture, travail sur écran, ou détente. Le dimmer tactile permet un réglage précis de l'intensité lumineuse.

Le bras articulé multi-positions vous permet d'orienter la lumière exactement où vous en avez besoin. Le port USB intégré vous permet de charger vos appareils directement depuis la lampe.

Construction robuste en alliage d'aluminium, design minimaliste qui s'intègre parfaitement dans tout environnement moderne.`,
        price: 4.50,
        moq: 80,
        category: 'Maison',
        images: [
            {
                id: '1',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
                alt: 'Lampe LED sur bureau'
            },
            {
                id: '2',
                url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
                alt: 'Lampe avec éclairage chaud'
            },
            {
                id: '3',
                url: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=800&h=800&fit=crop',
                alt: 'Bras articulé en action'
            }
        ],
        variants: [
            { id: '1', name: 'Blanc', type: 'color', value: '#FFFFFF', available: true },
            { id: '2', name: 'Noir', type: 'color', value: '#000000', available: true },
            { id: '3', name: 'Argent', type: 'color', value: '#C0C0C0', available: true }
        ],
        supplier: {
            id: 'sup6',
            name: 'Lighting Innovations',
            location: 'Zhongshan, Chine',
            rating: 4.4,
            verified: true,
            responseTime: '< 2h',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        },
        stock: 12000,
        tags: ['LED', '3 Modes', 'Tactile', 'USB', 'Pliable', 'Dimmer'],
        deliveryTime: {
            min: 12,
            max: 20,
            unit: 'days'
        },
        specifications: {
            'Technologie': 'LED haute efficacité',
            'Modes couleur': '3 (3000K/4500K/6000K)',
            'Dimmer': 'Tactile 10 niveaux',
            'Puissance': '12W',
            'Port USB': '5V/1A',
            'Matériau': 'Alliage aluminium',
            'Bras': '2 articulations'
        }
    }
];

// Fonction pour migrer les données vers Firebase
export const migrateProductsToFirebase = async (): Promise<void> => {
    console.log('🚀 Début de la migration des produits vers Firebase...');

    try {
        for (let i = 0; i < mockProductsData.length; i++) {
            const product = mockProductsData[i];
            console.log(`📦 Migration du produit ${i + 1}/${mockProductsData.length}: ${product.name}`);

            const productId = await ProductService.addProduct(product);
            console.log(`✅ Produit migré avec l'ID: ${productId}`);
        }

        console.log('🎉 Migration terminée avec succès !');
        console.log(`📊 ${mockProductsData.length} produits ont été ajoutés à Firebase`);

    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        throw error;
    }
};

// Fonction pour tester la récupération des produits
export const testFirebaseProducts = async (): Promise<void> => {
    console.log('🧪 Test de récupération des produits depuis Firebase...');

    try {
        const products = await ProductService.getAllProducts();
        console.log(`📊 ${products.length} produits récupérés depuis Firebase`);

        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ${product.price}€ (MOQ: ${product.moq})`);
        });

        console.log('✅ Test de récupération réussi !');

    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
        throw error;
    }
};

export default { migrateProductsToFirebase, testFirebaseProducts };
