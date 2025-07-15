import { Product, UserLanguage } from '../types';

// Mock product data - Version simplifiée et corrigée
export const products: Product[] = [
  {
    id: '1',
    name: {
      fr: 'Casque audio sans fil',
      en: 'Wireless Headphones',
      es: 'Auriculares Inalámbricos',
      ar: 'سماعات رأس لاسلكية',
      zh: '无线耳机',
      pt: 'Fones de Ouvido Sem Fio',
      nl: 'Draadloze Hoofdtelefoon'
    },
    category: 'Électronique',
    description: {
      fr: 'Casque audio sans fil avec une qualité sonore élevée et un ajustement confortable.',
      en: 'Wireless headphones with high sound quality and comfortable fit.',
      es: 'Auriculares inalámbricos con alta calidad de sonido y ajuste cómodo.',
      ar: 'سماعات رأس لاسلكية بجودة صوت عالية وملائمة مريحة.',
      zh: '无线耳机，高音质，舒适贴合。',
      pt: 'Fones de ouvido sem fio com alta qualidade de som e ajuste confortável.',
      nl: 'Draadloze hoofdtelefoon met hoge geluidskwaliteit en comfortabele pasvorm.'
    },
    images: [
      'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg',
      'https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg',
    ],
    supplier: {
      id: 'supplier-1',
      name: 'Shenzhen Audio Tech',
      email: 'contact@shenzhenaudiotech.com',
      location: 'Shenzhen, Chine'
    },
    moq: 100,
    price: {
      cny: 150,
      unitCny: 1.5,
    },
    certifiedCE: true,
    specifications: {
      brand: 'AudioTech Pro',
      origin: 'Shenzhen, Chine',
      style: 'Over-ear',
      modelNumber: 'AT-WH200',
      application: 'Grand public, Gaming',
      material: 'ABS, Cuir synthétique, Mousse à mémoire de forme'
    }
  },
  {
    id: '2',
    name: {
      fr: 'Powerbank 10000mAh',
      en: 'Powerbank 10000mAh',
      es: 'Batería Externa 10000mAh',
      ar: 'بنك طاقة 10000mAh',
      zh: '移动电源10000mAh',
      pt: 'Powerbank 10000mAh',
      nl: 'Powerbank 10000mAh'
    },
    category: 'Électronique',
    description: {
      fr: 'Powerbank portable de 10000mAh avec charge rapide et connectivité multiple.',
      en: 'Portable 10000mAh powerbank with fast charging and multiple connectivity.',
      es: 'Batería externa portátil de 10000mAh con carga rápida y conectividad múltiple.',
      ar: 'بنك طاقة محمول 10000mAh مع الشحن السريع والاتصال المتعدد.',
      zh: '便携式10000mAh移动电源，支持快充和多接口连接。',
      pt: 'Powerbank portátil de 10000mAh com carregamento rápido e conectividade múltipla.',
      nl: 'Draagbare 10000mAh powerbank met snelladen en meerdere connectiviteit.'
    },
    images: [
      'https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg',
    ],
    supplier: {
      id: 'supplier-2',
      name: 'Guangzhou Power Solutions',
      email: 'sales@gzpower.com',
      location: 'Guangzhou, Chine'
    },
    moq: 50,
    price: {
      cny: 80,
      unitCny: 1.6,
    },
    certifiedCE: true,
    specifications: {
      brand: 'PowerMax',
      origin: 'Guangzhou, Chine',
      modelNumber: 'PM-10K',
      material: 'Aluminium, Lithium-ion'
    }
  },
  {
    id: '3',
    name: {
      fr: 'Panneau solaire flexible 100W',
      en: 'Flexible Solar Panel 100W',
      es: 'Panel Solar Flexible 100W',
      ar: 'لوحة شمسية مرنة 100 واط',
      zh: '柔性太阳能板100W',
      pt: 'Painel Solar Flexível 100W',
      nl: 'Flexibel Zonnepaneel 100W'
    },
    category: 'Électronique',
    description: {
      fr: 'Panneau solaire flexible de 100W, haute efficacité, installation facile.',
      en: 'Flexible 100W solar panel, high efficiency, easy installation.',
      es: 'Panel solar flexible de 100W, alta eficiencia, instalación fácil.',
      ar: 'لوحة شمسية مرنة 100 واط، كفاءة عالية، تركيب سهل.',
      zh: '柔性太阳能板，高效转换，轻便安装。',
      pt: 'Painel solar flexível de 100W, alta eficiência, instalação fácil.',
      nl: 'Flexibel 100W zonnepaneel, hoge efficiëntie, eenvoudige installatie.'
    },
    images: [
      'https://images.pexels.com/photos/159160/solar-panel-array-power-sun-electricity-159160.jpeg',
    ],
    supplier: {
      id: 'supplier-3',
      name: 'Solar Energy Co',
      email: 'info@solarenergy.cn',
      location: 'Shanghai, Chine'
    },
    moq: 20,
    price: {
      cny: 800,
      unitCny: 40,
    },
    certifiedCE: true,
    specifications: {
      brand: 'SolarFlex',
      origin: 'Shanghai, Chine',
      modelNumber: 'SF-100F',
      material: 'Silicium monocristallin'
    }
  },
  {
    id: '4',
    name: {
      fr: 'Veste imperméable recyclée',
      en: 'Recycled Waterproof Jacket',
      es: 'Chaqueta Impermeable Reciclada',
      ar: 'سترة مقاومة للماء معاد تدويرها',
      zh: '回收防水夹克',
      pt: 'Jaqueta Impermeável Reciclada',
      nl: 'Gerecyclede Waterdichte Jas'
    },
    category: 'Vêtements',
    description: {
      fr: 'Veste imperméable fabriquée à partir de matériaux recyclés, respectueuse de l\'environnement.',
      en: 'Waterproof jacket made from recycled materials, environmentally friendly.',
      es: 'Chaqueta impermeable hecha de materiales reciclados, respetuosa con el medio ambiente.',
      ar: 'سترة مقاومة للماء مصنوعة من مواد معاد تدويرها، صديقة للبيئة.',
      zh: '环保防水夹克，采用回收材料制成。',
      pt: 'Jaqueta impermeável feita de materiais reciclados, ecologicamente correta.',
      nl: 'Waterdichte jas gemaakt van gerecyclede materialen, milieuvriendelijk.'
    },
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    ],
    supplier: {
      id: 'supplier-4',
      name: 'EcoWear Manufacturing',
      email: 'contact@ecowear.cn',
      location: 'Hangzhou, Chine'
    },
    moq: 200,
    price: {
      cny: 350,
      unitCny: 1.75,
    },
    certifiedCE: false,
    specifications: {
      brand: 'EcoShield',
      origin: 'Hangzhou, Chine',
      style: 'Outdoor',
      modelNumber: 'ES-R200',
      application: 'Randonnée, Sport, Casual',
      material: 'Polyester recyclé, PFC-free DWR'
    }
  },
  {
    id: '5',
    name: {
      fr: 'Robot aspirateur intelligent',
      en: 'Smart Robot Vacuum',
      es: 'Robot Aspiradora Inteligente',
      ar: 'مكنسة كهربائية ذكية',
      zh: '智能扫地机器人',
      pt: 'Aspirador Robô Inteligente',
      nl: 'Slimme Robotstofzuiger'
    },
    category: 'Maison',
    description: {
      fr: 'Robot aspirateur intelligent avec navigation laser et station de charge automatique.',
      en: 'Smart robot vacuum with laser navigation and automatic charging station.',
      es: 'Robot aspiradora inteligente con navegación láser y estación de carga automática.',
      ar: 'مكنسة كهربائية ذكية مع الملاحة بالليزر ومحطة الشحن التلقائي.',
      zh: '智能扫地机器人，激光导航，自动充电。',
      pt: 'Aspirador robô inteligente com navegação a laser e estação de carregamento automático.',
      nl: 'Slimme robotstofzuiger met lasernavigatie en automatisch laadstation.'
    },
    images: [
      'https://images.pexels.com/photos/8005370/pexels-photo-8005370.jpeg',
    ],
    supplier: {
      id: 'supplier-5',
      name: 'Smart Home Tech',
      email: 'sales@smarthometech.cn',
      location: 'Beijing, Chine'
    },
    moq: 10,
    price: {
      cny: 1800,
      unitCny: 180,
    },
    certifiedCE: true,
    specifications: {
      brand: 'CleanBot Pro',
      origin: 'Beijing, Chine',
      style: 'Circulaire',
      modelNumber: 'CB-LX3000',
      application: 'Domestique, Bureau',
      material: 'ABS, Métal brossé'
    }
  }
];

// Get product categories with translations
export const getCategoriesWithTranslations = (lang: UserLanguage) => {
  const categories = [
    {
      id: 'Électronique',
      name: 'Électronique',
      translatedName: lang === 'fr' ? 'Électronique' :
        lang === 'en' ? 'Electronics' :
          lang === 'es' ? 'Electrónicos' :
            lang === 'ar' ? 'إلكترونيات' :
              lang === 'zh' ? '电子产品' :
                lang === 'pt' ? 'Eletrônicos' :
                  'Elektronica'
    },
    {
      id: 'Vêtements',
      name: 'Vêtements',
      translatedName: lang === 'fr' ? 'Vêtements' :
        lang === 'en' ? 'Clothing' :
          lang === 'es' ? 'Ropa' :
            lang === 'ar' ? 'ملابس' :
              lang === 'zh' ? '服装' :
                lang === 'pt' ? 'Roupas' :
                  'Kleding'
    },
    {
      id: 'Maison',
      name: 'Maison',
      translatedName: lang === 'fr' ? 'Maison' :
        lang === 'en' ? 'Home' :
          lang === 'es' ? 'Hogar' :
            lang === 'ar' ? 'منزل' :
              lang === 'zh' ? '家居' :
                lang === 'pt' ? 'Casa' :
                  'Thuis'
    }
  ];

  return categories;
};

// Get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
