import React, { useState, useEffect } from 'react';
import {
    Palette,
    Type,
    Image,
    Download,
    Eye,
    Copy,
    Save,
    RefreshCw,
    Layout,
    Settings,
    Upload,
    X,
    Check,
    Sparkles,
    Zap
} from 'lucide-react';
import BusinessCardTemplate, {
    BusinessCardData,
    defaultBusinessCardData,
    businessCardTemplates
} from './BusinessCardTemplate';

interface BusinessCardEditorProps {
    initialData?: BusinessCardData;
    onSave?: (data: BusinessCardData) => void;
    onClose?: () => void;
}

const BusinessCardEditor: React.FC<BusinessCardEditorProps> = ({
    initialData = defaultBusinessCardData,
    onSave,
    onClose
}) => {
    const [cardData, setCardData] = useState<BusinessCardData>(initialData);
    const [activeTab, setActiveTab] = useState('content');
    const [previewMode, setPreviewMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Mettre à jour les données de la carte
    const updateCardData = (updates: Partial<BusinessCardData>) => {
        setCardData(prev => ({ ...prev, ...updates }));
    };

    // Sauvegarder la carte
    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(cardData);
            }
            // Simuler une sauvegarde
            await new Promise(resolve => setTimeout(resolve, 1000));
        } finally {
            setIsSaving(false);
        }
    };

    // Télécharger comme image (simulé)
    const handleDownload = () => {
        // En production, ici on convertirait le composant en image
        alert('Fonctionnalité de téléchargement à implémenter avec html2canvas');
    };

    // Réinitialiser
    const handleReset = () => {
        setCardData(defaultBusinessCardData);
    };

    const colorPresets = [
        { name: 'Bleu océan', primary: '#3B82F6', secondary: '#8B5CF6', accent: '#10B981' },
        { name: 'Rouge passion', primary: '#EF4444', secondary: '#F59E0B', accent: '#EC4899' },
        { name: 'Vert nature', primary: '#10B981', secondary: '#059669', accent: '#F59E0B' },
        { name: 'Violet royal', primary: '#8B5CF6', secondary: '#A855F7', accent: '#EC4899' },
        { name: 'Orange énergie', primary: '#F59E0B', secondary: '#EF4444', accent: '#8B5CF6' },
        { name: 'Gris élégant', primary: '#6B7280', secondary: '#4B5563', accent: '#3B82F6' }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] overflow-hidden flex">
                {/* Panel de gauche - Éditeur */}
                <div className="w-1/2 flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                                <Sparkles className="h-6 w-6 text-blue-500" />
                                <span>Éditeur de Carte de Visite</span>
                            </h2>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleReset}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Réinitialiser"
                                >
                                    <RefreshCw className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Télécharger"
                                >
                                    <Download className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1 mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            {[
                                { id: 'content', label: 'Contenu', icon: Type },
                                { id: 'design', label: 'Design', icon: Palette },
                                { id: 'layout', label: 'Layout', icon: Layout },
                                { id: 'images', label: 'Images', icon: Image }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === tab.id
                                                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'content' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nom de l'entreprise
                                    </label>
                                    <input
                                        type="text"
                                        value={cardData.companyName}
                                        onChange={(e) => updateCardData({ companyName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Slogan
                                    </label>
                                    <input
                                        type="text"
                                        value={cardData.tagline}
                                        onChange={(e) => updateCardData({ tagline: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nom de contact
                                        </label>
                                        <input
                                            type="text"
                                            value={cardData.contactPerson}
                                            onChange={(e) => updateCardData({ contactPerson: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Poste
                                        </label>
                                        <input
                                            type="text"
                                            value={cardData.position}
                                            onChange={(e) => updateCardData({ position: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Téléphone
                                        </label>
                                        <input
                                            type="text"
                                            value={cardData.phone}
                                            onChange={(e) => updateCardData({ phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={cardData.email}
                                            onChange={(e) => updateCardData({ email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Site web
                                    </label>
                                    <input
                                        type="text"
                                        value={cardData.website}
                                        onChange={(e) => updateCardData({ website: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        value={cardData.address}
                                        onChange={(e) => updateCardData({ address: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            LinkedIn
                                        </label>
                                        <input
                                            type="text"
                                            value={cardData.linkedin || ''}
                                            onChange={(e) => updateCardData({ linkedin: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            WhatsApp
                                        </label>
                                        <input
                                            type="text"
                                            value={cardData.whatsapp || ''}
                                            onChange={(e) => updateCardData({ whatsapp: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            WeChat
                                        </label>
                                        <input
                                            type="text"
                                            value={cardData.wechat || ''}
                                            onChange={(e) => updateCardData({ wechat: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'design' && (
                            <div className="space-y-6">
                                {/* Templates */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Template
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {businessCardTemplates.map((template) => (
                                            <button
                                                key={template.id}
                                                onClick={() => updateCardData({
                                                    template: template.id,
                                                    primaryColor: template.primaryColor,
                                                    secondaryColor: template.secondaryColor,
                                                    textColor: template.textColor,
                                                    accentColor: template.accentColor
                                                })}
                                                className={`p-3 rounded-lg border-2 transition-all ${cardData.template === template.id
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="text-sm font-medium mb-1">{template.name}</div>
                                                <div className="text-xs text-gray-500">{template.description}</div>
                                                <div className="flex space-x-1 mt-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.primaryColor }} />
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.secondaryColor }} />
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.accentColor }} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Couleurs prédéfinies */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Palettes de couleurs
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {colorPresets.map((preset, index) => (
                                            <button
                                                key={index}
                                                onClick={() => updateCardData({
                                                    primaryColor: preset.primary,
                                                    secondaryColor: preset.secondary,
                                                    accentColor: preset.accent
                                                })}
                                                className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 transition-colors"
                                            >
                                                <div className="text-xs font-medium mb-2">{preset.name}</div>
                                                <div className="flex space-x-1">
                                                    <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.primary }} />
                                                    <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.secondary }} />
                                                    <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.accent }} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Couleurs personnalisées */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Couleur primaire
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="color"
                                                value={cardData.primaryColor}
                                                onChange={(e) => updateCardData({ primaryColor: e.target.value })}
                                                className="w-12 h-10 rounded border border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                value={cardData.primaryColor}
                                                onChange={(e) => updateCardData({ primaryColor: e.target.value })}
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Couleur secondaire
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="color"
                                                value={cardData.secondaryColor}
                                                onChange={(e) => updateCardData({ secondaryColor: e.target.value })}
                                                className="w-12 h-10 rounded border border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                value={cardData.secondaryColor}
                                                onChange={(e) => updateCardData({ secondaryColor: e.target.value })}
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Couleur d'accent
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="color"
                                                value={cardData.accentColor}
                                                onChange={(e) => updateCardData({ accentColor: e.target.value })}
                                                className="w-12 h-10 rounded border border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                value={cardData.accentColor}
                                                onChange={(e) => updateCardData({ accentColor: e.target.value })}
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Couleur du texte
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="color"
                                                value={cardData.textColor}
                                                onChange={(e) => updateCardData({ textColor: e.target.value })}
                                                className="w-12 h-10 rounded border border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                value={cardData.textColor}
                                                onChange={(e) => updateCardData({ textColor: e.target.value })}
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'layout' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Taille de police
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['small', 'medium', 'large'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => updateCardData({ fontSize: size as any })}
                                                className={`p-3 rounded-lg border-2 transition-all ${cardData.fontSize === size
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className={`font-medium ${size === 'small' ? 'text-sm' :
                                                        size === 'large' ? 'text-lg' : 'text-base'
                                                    }`}>
                                                    {size === 'small' ? 'Petite' :
                                                        size === 'large' ? 'Grande' : 'Moyenne'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Taille du logo
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['small', 'medium', 'large'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => updateCardData({ logoSize: size as any })}
                                                className={`p-3 rounded-lg border-2 transition-all ${cardData.logoSize === size
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="font-medium">
                                                    {size === 'small' ? 'Petit' :
                                                        size === 'large' ? 'Grand' : 'Moyen'}
                                                </div>
                                                <div className={`mx-auto mt-2 bg-gray-300 rounded ${size === 'small' ? 'w-6 h-6' :
                                                        size === 'large' ? 'w-10 h-10' : 'w-8 h-8'
                                                    }`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'images' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Logo de l'entreprise
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        {cardData.logo && (
                                            <img
                                                src={cardData.logo}
                                                alt="Logo actuel"
                                                className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                                            />
                                        )}
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="URL du logo"
                                                value={cardData.logo}
                                                onChange={(e) => updateCardData({ logo: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
                                            />
                                            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                                <Upload className="h-4 w-4" />
                                                <span>Télécharger une image</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Image de fond (optionnel)
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        {cardData.backgroundImage && (
                                            <img
                                                src={cardData.backgroundImage}
                                                alt="Fond actuel"
                                                className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                                            />
                                        )}
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="URL de l'image de fond"
                                                value={cardData.backgroundImage || ''}
                                                onChange={(e) => updateCardData({ backgroundImage: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
                                            />
                                            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                                <Upload className="h-4 w-4" />
                                                <span>Télécharger une image</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${previewMode
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <Eye className="h-4 w-4" />
                                    <span>Mode aperçu</span>
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded-lg font-medium hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Télécharger</span>
                                </button>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Sauvegarde...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            <span>Sauvegarder</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel de droite - Prévisualisation */}
                <div className="w-1/2 bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
                    <div className="relative">
                        <div className="mb-4 text-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Prévisualisation
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Carte de visite en temps réel
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <BusinessCardTemplate
                                data={cardData}
                                scale={previewMode ? 1.2 : 1}
                                className="transition-transform duration-300"
                            />
                        </div>

                        {/* Badge de template */}
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                            <Zap className="h-3 w-3" />
                            <span>{businessCardTemplates.find(t => t.id === cardData.template)?.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessCardEditor;
