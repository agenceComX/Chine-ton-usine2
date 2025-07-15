import { UserLanguage } from '../types';

/**
 * Obtient le nom du produit dans la langue spécifiée
 * @param product Le produit
 * @param language La langue souhaitée
 * @returns Le nom du produit dans la langue demandée ou un fallback
 */
export const getProductName = (product: any, language: UserLanguage): string => {
  // Si le nom est déjà multilingue
  if (typeof product.name === 'object' && product.name !== null) {
    return product.name[language] || product.name.fr || product.name.en || Object.values(product.name)[0] || 'Produit sans nom';
  }

  // Si le nom est encore une chaîne simple, utiliser les traductions prédéfinies
  const productNameTranslations: Record<string, Record<UserLanguage, string>> = {
    'Casque audio sans fil': {
      fr: 'Casque audio sans fil',
      en: 'Wireless Headphones',
      es: 'Auriculares inalámbricos',
      ar: 'سماعات رأس لاسلكية',
      zh: '无线耳机',
      pt: 'Fones de ouvido sem fio',
      de: 'Kabellose Kopfhörer'
    },
    'Powerbank 10000mAh': {
      fr: 'Powerbank 10000mAh',
      en: 'Power Bank 10000mAh',
      es: 'Batería externa 10000mAh',
      ar: 'بنك طاقة 10000 مللي أمبير',
      zh: '10000毫安移动电源',
      pt: 'Power Bank 10000mAh',
      de: 'Powerbank 10000mAh'
    },
    'Panneau solaire flexible 100W': {
      fr: 'Panneau solaire flexible 100W',
      en: 'Flexible Solar Panel 100W',
      es: 'Panel solar flexible 100W',
      ar: 'لوحة شمسية مرنة 100 واط',
      zh: '柔性太阳能板100W',
      pt: 'Painel Solar Flexível 100W',
      de: 'Flexibel zonnepaneel 100W'
    },
    'Veste imperméable recyclée': {
      fr: 'Veste imperméable recyclée',
      en: 'Recycled Waterproof Jacket',
      es: 'Chaqueta impermeable reciclada',
      ar: 'سترة مقاومة للماء معاد تدويرها',
      zh: '回收防水夹克',
      pt: 'Jaqueta impermeável reciclada',
      de: 'Gerecyclede waterdichte jas'
    },
    'Robot aspirateur intelligent': {
      fr: 'Robot aspirateur intelligent',
      en: 'Smart Robot Vacuum',
      es: 'Aspiradora robot inteligente',
      ar: 'مكنسة روبوت ذكية',
      zh: '智能扫地机器人',
      pt: 'Aspirador robô inteligente',
      de: 'Slimme robotstofzuiger'
    },
    'Crème hydratante bio': {
      fr: 'Crème hydratante bio',
      en: 'Organic Moisturizing Cream',
      es: 'Crema hidratante orgánica',
      ar: 'كريم مرطب عضوي',
      zh: '有机保湿霜',
      pt: 'Creme hidratante orgânico',
      de: 'Biologische vochtinbrengende crème'
    },
    'Machine à café expresso': {
      fr: 'Machine à café expresso',
      en: 'Espresso Coffee Machine',
      es: 'Máquina de café espresso',
      ar: 'آلة قهوة اسبريسو',
      zh: '浓缩咖啡机',
      pt: 'Máquina de café expresso',
      de: 'Espresso koffiemachine'
    },
    'Télescope astronomique 150mm': {
      fr: 'Télescope astronomique 150mm',
      en: 'Astronomical Telescope 150mm',
      es: 'Telescopio astronómico 150mm',
      ar: 'تلسكوب فلكي 150 مم',
      zh: '150mm天文望远镜',
      pt: 'Telescópio astronômico 150mm',
      de: 'Astronomische telescoop 150mm'
    },
    'Drone professionnel 4K': {
      fr: 'Drone professionnel 4K',
      en: 'Professional 4K Drone',
      es: 'Drone profesional 4K',
      ar: 'طائرة مسيرة احترافية 4K',
      zh: '专业4K无人机',
      pt: 'Drone profissional 4K',
      de: 'Professionele 4K drone'
    }, 'Kit de filtres à huile': {
      fr: 'Kit de filtres à huile',
      en: 'Oil Filter Kit',
      es: 'Kit de filtros de aceite',
      ar: 'طقم فلتر زيت',
      zh: '机油滤清器套装',
      pt: 'Kit de filtros de óleo',
      de: 'Oliefilter kit'
    },
    'Monture de lunettes titane': {
      fr: 'Monture de lunettes titane',
      en: 'Titanium Glasses Frame',
      es: 'Marco de gafas de titanio',
      ar: 'إطار نظارات من التيتانيوم',
      zh: '钛合金眼镜框',
      pt: 'Armação de óculos de titânio',
      de: 'Titanium brillenmontuur'
    },
    'Perceuse sans fil professionnelle': {
      fr: 'Perceuse sans fil professionnelle',
      en: 'Professional Cordless Drill',
      es: 'Taladro inalámbrico profesional',
      ar: 'مثقاب لاسلكي احترافي',
      zh: '专业无线电钻',
      pt: 'Furadeira sem fio profissional',
      de: 'Professionele draadloze boor'
    },
    'Bureau ergonomique réglable': {
      fr: 'Bureau ergonomique réglable',
      en: 'Adjustable Ergonomic Desk',
      es: 'Escritorio ergonómico ajustable',
      ar: 'مكتب مريح قابل للتعديل',
      zh: '可调节人体工学桌',
      pt: 'Mesa ergonômica ajustável',
      de: 'Verstelbaar ergonomisch bureau'
    },
    'Appareil photo': {
      fr: 'Appareil photo',
      en: 'Camera',
      es: 'Cámara',
      ar: 'كاميرا',
      zh: '相机',
      pt: 'Câmera',
      de: 'Camera'
    },
    'Wireless Headphones': {
      fr: 'Casque sans fil',
      en: 'Wireless Headphones',
      es: 'Auriculares inalámbricos',
      ar: 'سماعات لاسلكية',
      zh: '无线耳机',
      pt: 'Fones de ouvido sem fio',
      de: 'Draadloze hoofdtelefoon'
    },
    'Power Bank 10000mAh': {
      fr: 'Batterie externe 10000mAh',
      en: 'Power Bank 10000mAh',
      es: 'Batería externa 10000mAh',
      ar: 'بنك طاقة 10000 مللي أمبير',
      zh: '10000毫安移动电源',
      pt: 'Power Bank 10000mAh',
      de: 'Powerbank 10000mAh'
    },
    'Flexible Solar Panel 100W': {
      fr: 'Panneau solaire flexible 100W',
      en: 'Flexible Solar Panel 100W',
      es: 'Panel solar flexible 100W',
      ar: 'لوحة شمسية مرنة 100 واط',
      zh: '100W柔性太阳能板',
      pt: 'Painel solar flexível 100W',
      de: 'Flexibel zonnepaneel 100W'
    },
    'Recycled Waterproof Jacket': {
      fr: 'Veste imperméable recyclée',
      en: 'Recycled Waterproof Jacket',
      es: 'Chaqueta impermeable reciclada',
      ar: 'سترة مقاومة للماء معاد تدويرها',
      zh: '回收防水夹克',
      pt: 'Jaqueta impermeável reciclada',
      de: 'Gerecyclede waterdichte jas'
    },
    'Smart Robot Vacuum': {
      fr: 'Robot aspirateur intelligent',
      en: 'Smart Robot Vacuum',
      es: 'Aspiradora robot inteligente',
      ar: 'مكنسة روبوت ذكية',
      zh: '智能扫地机器人',
      pt: 'Aspirador robô inteligente',
      de: 'Slimme robotstofzuiger'
    },
    'Organic Moisturizing Cream': {
      fr: 'Crème hydratante bio',
      en: 'Organic Moisturizing Cream',
      es: 'Crema hidratante orgánica',
      ar: 'كريم مرطب عضوي',
      zh: '有机保湿霜',
      pt: 'Creme hidratante orgânico',
      de: 'Biologische vochtinbrengende crème'
    }
  };

  const originalName = product.name as string;
  const translations = productNameTranslations[originalName];

  if (translations) {
    return translations[language] || translations.fr || translations.en || originalName;
  }

  // Fallback : retourner le nom original
  return originalName;
};

/**
 * Obtient la description du produit dans la langue spécifiée
 * @param product Le produit
 * @param language La langue souhaitée
 * @returns La description du produit dans la langue demandée ou un fallback
 */
export const getProductDescription = (product: any, language: UserLanguage): string => {
  if (typeof product.description === 'object' && product.description !== null) {
    return product.description[language] ||
      product.description.fr ||
      product.description.en ||
      product.description.chinese ||
      product.description.english ||
      product.description.french ||
      Object.values(product.description)[0] ||
      'Description non disponible';
  }

  return product.description || 'Description non disponible';
};
