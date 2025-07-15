import React from 'react';
import {
    Phone,
    Mail,
    Globe,
    MapPin
} from 'lucide-react';

// Interface pour les données de la carte de visite
export interface BusinessCardData {
    // Informations de base
    companyName: string;
    tagline: string;
    contactPerson: string;
    position: string;

    // Contact
    phone: string;
    email: string;
    website: string;
    address: string;

    // Réseaux sociaux
    linkedin?: string;
    whatsapp?: string;
    wechat?: string;

    // Visuels
    logo: string;
    backgroundImage?: string;

    // Branding
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    accentColor: string;

    // Style et layout
    template: string;
    fontSize: 'small' | 'medium' | 'large';
    logoSize: 'small' | 'medium' | 'large';
    layout: 'modern' | 'classic' | 'minimal' | 'creative' | 'professional';
}

// Templates prédéfinis
export const businessCardTemplates = [
    {
        id: 'modern',
        name: 'Moderne',
        description: 'Design épuré avec gradients',
        preview: '/templates/modern.jpg',
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
        textColor: '#1F2937',
        accentColor: '#10B981'
    },
    {
        id: 'classic',
        name: 'Classique',
        description: 'Style traditionnel et élégant',
        preview: '/templates/classic.jpg',
        primaryColor: '#1F2937',
        secondaryColor: '#6B7280',
        textColor: '#FFFFFF',
        accentColor: '#F59E0B'
    },
    {
        id: 'minimal',
        name: 'Minimaliste',
        description: 'Design simple et propre',
        preview: '/templates/minimal.jpg',
        primaryColor: '#FFFFFF',
        secondaryColor: '#F3F4F6',
        textColor: '#111827',
        accentColor: '#3B82F6'
    },
    {
        id: 'creative',
        name: 'Créatif',
        description: 'Design artistique et coloré',
        preview: '/templates/creative.jpg',
        primaryColor: '#EC4899',
        secondaryColor: '#8B5CF6',
        textColor: '#FFFFFF',
        accentColor: '#F59E0B'
    },
    {
        id: 'professional',
        name: 'Professionnel',
        description: 'Style corporate sérieux',
        preview: '/templates/professional.jpg',
        primaryColor: '#1E40AF',
        secondaryColor: '#1F2937',
        textColor: '#FFFFFF',
        accentColor: '#059669'
    },
    {
        id: 'tech',
        name: 'Tech',
        description: 'Design futuriste et high-tech',
        preview: '/templates/tech.jpg',
        primaryColor: '#0F172A',
        secondaryColor: '#1E293B',
        textColor: '#E2E8F0',
        accentColor: '#06B6D4'
    }
];

// Données par défaut
export const defaultBusinessCardData: BusinessCardData = {
    companyName: 'TechnoMax Solutions',
    tagline: 'Innovation & Excellence',
    contactPerson: 'Zhang Wei',
    position: 'Directeur Commercial',
    phone: '+86 755 1234 5678',
    email: 'zhang.wei@technomax.com',
    website: 'www.technomax-solutions.com',
    address: 'Shenzhen, Chine',
    linkedin: 'technomax-solutions',
    whatsapp: '+8675512345678',
    wechat: 'TechnoMax_ZW',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
    backgroundImage: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    textColor: '#1F2937',
    accentColor: '#10B981',
    template: 'modern',
    fontSize: 'medium',
    logoSize: 'medium',
    layout: 'modern'
};

interface BusinessCardTemplateProps {
    data: BusinessCardData;
    className?: string;
    scale?: number;
}

const BusinessCardTemplate: React.FC<BusinessCardTemplateProps> = ({
    data,
    className = '',
    scale = 1
}) => {
    const getTemplateStyle = () => {
        const baseStyle = {
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
        };

        switch (data.template) {
            case 'modern':
                return {
                    ...baseStyle,
                    background: `linear-gradient(135deg, ${data.primaryColor} 0%, ${data.secondaryColor} 100%)`,
                    color: data.textColor
                };
            case 'classic':
                return {
                    ...baseStyle,
                    background: data.primaryColor,
                    color: data.textColor,
                    border: `3px solid ${data.accentColor}`
                };
            case 'minimal':
                return {
                    ...baseStyle,
                    background: data.primaryColor,
                    color: data.textColor,
                    border: `1px solid ${data.secondaryColor}`
                };
            case 'creative':
                return {
                    ...baseStyle,
                    background: `radial-gradient(circle at 30% 30%, ${data.primaryColor} 0%, ${data.secondaryColor} 100%)`,
                    color: data.textColor
                };
            case 'professional':
                return {
                    ...baseStyle,
                    background: `linear-gradient(90deg, ${data.primaryColor} 0%, ${data.secondaryColor} 100%)`,
                    color: data.textColor
                };
            case 'tech':
                return {
                    ...baseStyle,
                    background: `linear-gradient(45deg, ${data.primaryColor} 0%, ${data.secondaryColor} 50%, ${data.accentColor}22 100%)`,
                    color: data.textColor,
                    boxShadow: `0 0 20px ${data.accentColor}33`
                };
            default:
                return baseStyle;
        }
    };

    const getFontSize = () => {
        switch (data.fontSize) {
            case 'small': return 'text-sm';
            case 'large': return 'text-lg';
            default: return 'text-base';
        }
    };

    const getLogoSize = () => {
        switch (data.logoSize) {
            case 'small': return 'w-12 h-12';
            case 'large': return 'w-20 h-20';
            default: return 'w-16 h-16';
        }
    };

    return (
        <div
            className={`relative w-96 h-56 rounded-2xl p-6 shadow-2xl overflow-hidden ${className}`}
            style={getTemplateStyle()}
        >
            {/* Background Image */}
            {data.backgroundImage && (
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url(${data.backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h1 className={`font-bold ${getFontSize() === 'text-sm' ? 'text-lg' : getFontSize() === 'text-lg' ? 'text-2xl' : 'text-xl'} mb-1`}>
                            {data.companyName}
                        </h1>
                        {data.tagline && (
                            <p className={`opacity-90 ${getFontSize()} font-medium`} style={{ color: data.accentColor }}>
                                {data.tagline}
                            </p>
                        )}
                    </div>

                    {/* Logo */}
                    {data.logo && (
                        <img
                            src={data.logo}
                            alt="Logo"
                            className={`${getLogoSize()} rounded-lg object-cover bg-white/20 backdrop-blur-sm`}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    )}
                </div>

                {/* Contact Person */}
                <div className="my-4">
                    <h2 className={`font-semibold ${getFontSize() === 'text-sm' ? 'text-base' : getFontSize() === 'text-lg' ? 'text-xl' : 'text-lg'}`}>
                        {data.contactPerson}
                    </h2>
                    <p className={`opacity-80 ${getFontSize()}`}>
                        {data.position}
                    </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-1">
                    <div className={`flex items-center space-x-2 ${getFontSize()}`}>
                        <Phone className="w-4 h-4" style={{ color: data.accentColor }} />
                        <span>{data.phone}</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${getFontSize()}`}>
                        <Mail className="w-4 h-4" style={{ color: data.accentColor }} />
                        <span>{data.email}</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${getFontSize()}`}>
                        <Globe className="w-4 h-4" style={{ color: data.accentColor }} />
                        <span>{data.website}</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${getFontSize()}`}>
                        <MapPin className="w-4 h-4" style={{ color: data.accentColor }} />
                        <span>{data.address}</span>
                    </div>
                </div>

                {/* Social Media */}
                {(data.linkedin || data.whatsapp || data.wechat) && (
                    <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-white/20">
                        {data.linkedin && (
                            <div className="flex items-center space-x-1 text-xs">
                                <span style={{ color: data.accentColor }}>LinkedIn:</span>
                                <span>{data.linkedin}</span>
                            </div>
                        )}
                        {data.whatsapp && (
                            <div className="flex items-center space-x-1 text-xs">
                                <span style={{ color: data.accentColor }}>WhatsApp:</span>
                                <span>{data.whatsapp}</span>
                            </div>
                        )}
                        {data.wechat && (
                            <div className="flex items-center space-x-1 text-xs">
                                <span style={{ color: data.accentColor }}>WeChat:</span>
                                <span>{data.wechat}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Decorative Elements for specific templates */}
                {data.template === 'creative' && (
                    <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 rounded-full" style={{ background: data.accentColor, opacity: 0.3 }} />
                    </div>
                )}

                {data.template === 'tech' && (
                    <>
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full border border-current opacity-20" style={{ borderColor: data.accentColor }} />
                        <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full border border-current opacity-10" style={{ borderColor: data.accentColor }} />
                    </>
                )}
            </div>
        </div>
    );
};

export default BusinessCardTemplate;
