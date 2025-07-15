import React, { memo, useMemo, useCallback } from 'react';
import { Building2, Mail, Phone, User, MapPin, DollarSign, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useOptimizedMutation, useOptimizedQuery } from '../../hooks/useOptimizedSupabase';

// Types temporaires (à adapter selon votre structure)
interface Company {
    id: string;
    name: string;
    country: string;
    email: string;
    phone: string;
    contact_person: string;
    preferred_currency: string;
    interested_products: string[];
    website: string;
}

interface CompanyProfile {
    id: string;
    company_id: string;
    monthly_sales_volume: string;
    has_merchandising: boolean;
    is_top_importer: boolean;
    has_warehouses: boolean;
    warehouse_count: number;
    has_logistics_vehicles: boolean;
    vehicle_count: number;
    business_type: string;
    notes: string;
}

// Composants UI simplifiés pour la démo
const Button: React.FC<any> = ({ children, ...props }) => (
    <button {...props} className={`px-4 py-2 rounded ${props.className || ''}`}>
        {children}
    </button>
);

const Input: React.FC<any> = ({ label, icon, className, ...props }) => (
    <div className={className}>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <div className="relative">
            {icon && <div className="absolute left-3 top-2.5">{icon}</div>}
            <input
                {...props}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2`}
            />
        </div>
    </div>
);

const Select: React.FC<any> = ({ label, options, value, onChange, ...props }) => (
    <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            {...props}
        >
            {options.map((option: any) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);

interface EditProspectModalProps {
    prospect: Company;
    onClose: () => void;
    onUpdate: (prospect: Company) => void;
}

const EditProspectModal: React.FC<EditProspectModalProps> = memo(({
    prospect,
    onClose,
    onUpdate
}) => {
    const companyMutation = useOptimizedMutation('companies');
    const profileMutation = useOptimizedMutation('company_profiles');

    const { data: profiles } = useOptimizedQuery<CompanyProfile>('company_profiles', {
        filter: { company_id: prospect.id },
        limit: 1,
        select: '*',
        cacheKey: `profile-${prospect.id}`
    });

    const profile = useMemo(() => profiles?.[0], [profiles]);

    const [formData, setFormData] = React.useState(() => ({
        // Informations de base
        name: prospect.name || '',
        country: prospect.country || '',
        email: prospect.email || '',
        phone: prospect.phone || '',
        contactPerson: prospect.contact_person || '',

        // Informations détaillées du profil
        monthlySalesVolume: profile?.monthly_sales_volume || '',
        hasMerchandising: profile?.has_merchandising || false,
        isTopImporter: profile?.is_top_importer || false,
        hasWarehouses: profile?.has_warehouses || false,
        warehouseCount: profile?.warehouse_count?.toString() || '',
        hasLogisticsVehicles: profile?.has_logistics_vehicles || false,
        vehicleCount: profile?.vehicle_count?.toString() || '',
        preferredCurrency: prospect.preferred_currency || 'EUR',
        interestedProducts: prospect.interested_products || [],
        businessType: profile?.business_type || '',
        website: prospect.website || '',
        notes: profile?.notes || ''
    }));

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Mémorisation des handlers
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const handleProductSelect = useCallback((product: string) => {
        setFormData(prev => ({
            ...prev,
            interestedProducts: prev.interestedProducts.includes(product)
                ? prev.interestedProducts.filter(p => p !== product)
                : [...prev.interestedProducts, product]
        }));
    }, []);

    // Optimistic update pour les mutations
    const optimisticUpdateCompany = useCallback((data: Partial<Company>) => {
        onUpdate({ ...prospect, ...data });
    }, [prospect, onUpdate]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Données de l'entreprise
            const companyData = {
                name: formData.name,
                country: formData.country,
                email: formData.email,
                phone: formData.phone,
                contact_person: formData.contactPerson,
                preferred_currency: formData.preferredCurrency,
                interested_products: formData.interestedProducts,
                website: formData.website,
                updated_at: new Date().toISOString()
            };

            // Données du profil
            const profileData = {
                monthly_sales_volume: formData.monthlySalesVolume,
                has_merchandising: formData.hasMerchandising,
                is_top_importer: formData.isTopImporter,
                has_warehouses: formData.hasWarehouses,
                warehouse_count: formData.hasWarehouses ? parseInt(formData.warehouseCount) || 0 : null,
                has_logistics_vehicles: formData.hasLogisticsVehicles,
                vehicle_count: formData.hasLogisticsVehicles ? parseInt(formData.vehicleCount) || 0 : null,
                business_type: formData.businessType,
                notes: formData.notes,
                updated_at: new Date().toISOString()
            };

            // Mise à jour de l'entreprise avec optimistic update
            await companyMutation.update(
                prospect.id,
                companyData,
                optimisticUpdateCompany
            );

            // Mise à jour du profil
            if (profile) {
                await profileMutation.update(profile.id, profileData);
            } else {
                await profileMutation.insert({
                    ...profileData,
                    company_id: prospect.id,
                    created_at: new Date().toISOString()
                });
            }

            onClose();
        } catch (err) {
            console.error('Erreur lors de la mise à jour:', err);
            setError('Erreur lors de la mise à jour du prospect');
        } finally {
            setLoading(false);
        }
    }, [
        formData,
        prospect.id,
        profile,
        companyMutation,
        profileMutation,
        optimisticUpdateCompany,
        onClose
    ]);

    // Mémorisation des options
    const currencyOptions = useMemo(() => [
        { value: 'EUR', label: 'Euro (€)' },
        { value: 'USD', label: 'Dollar ($)' },
        { value: 'GBP', label: 'Livre Sterling (£)' },
        { value: 'DZD', label: 'Dinar Algérien (DA)' }
    ], []);

    const businessTypeOptions = useMemo(() => [
        { value: 'importer', label: 'Importateur' },
        { value: 'distributor', label: 'Distributeur' },
        { value: 'retailer', label: 'Détaillant' },
        { value: 'wholesaler', label: 'Grossiste' }
    ], []);

    const productCategories = useMemo(() => [
        'Épices et condiments',
        'Huiles et vinaigres',
        'Conserves',
        'Produits secs',
        'Boissons',
        'Confiserie',
        'Produits bio',
        'Équipements culinaires'
    ], []);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Modifier le prospect : {prospect.name}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-4 space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de base</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Nom de l'entreprise"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    icon={<Building2 className="text-gray-400" size={20} />}
                                />

                                <Input
                                    label="Pays"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    icon={<MapPin className="text-gray-400" size={20} />}
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    icon={<Mail className="text-gray-400" size={20} />}
                                />

                                <Input
                                    label="Téléphone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    icon={<Phone className="text-gray-400" size={20} />}
                                />

                                <Input
                                    label="Personne de contact"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    required
                                    icon={<User className="text-gray-400" size={20} />}
                                />

                                <Input
                                    label="Site web"
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations commerciales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="Devise préférée"
                                    name="preferredCurrency"
                                    value={formData.preferredCurrency}
                                    onChange={(value) => setFormData(prev => ({ ...prev, preferredCurrency: value }))}
                                    options={currencyOptions}
                                />

                                <Select
                                    label="Type d'activité"
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}
                                    options={businessTypeOptions}
                                />

                                <Input
                                    label="Volume mensuel de ventes"
                                    name="monthlySalesVolume"
                                    value={formData.monthlySalesVolume}
                                    onChange={handleChange}
                                    placeholder="Ex: 50 000 €"
                                    icon={<DollarSign className="text-gray-400" size={20} />}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Capacités logistiques</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="hasMerchandising"
                                        name="hasMerchandising"
                                        checked={formData.hasMerchandising}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <label htmlFor="hasMerchandising" className="ml-2">
                                        Service merchandising disponible
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isTopImporter"
                                        name="isTopImporter"
                                        checked={formData.isTopImporter}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <label htmlFor="isTopImporter" className="ml-2">
                                        Importateur principal dans le pays
                                    </label>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <input
                                        type="checkbox"
                                        id="hasWarehouses"
                                        name="hasWarehouses"
                                        checked={formData.hasWarehouses}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <label htmlFor="hasWarehouses">Possède des entrepôts</label>
                                    {formData.hasWarehouses && (
                                        <Input
                                            type="number"
                                            name="warehouseCount"
                                            value={formData.warehouseCount}
                                            onChange={handleChange}
                                            placeholder="Nombre"
                                            className="w-24"
                                        />
                                    )}
                                </div>

                                <div className="flex items-center space-x-4">
                                    <input
                                        type="checkbox"
                                        id="hasLogisticsVehicles"
                                        name="hasLogisticsVehicles"
                                        checked={formData.hasLogisticsVehicles}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <label htmlFor="hasLogisticsVehicles">Véhicules logistiques</label>
                                    {formData.hasLogisticsVehicles && (
                                        <Input
                                            type="number"
                                            name="vehicleCount"
                                            value={formData.vehicleCount}
                                            onChange={handleChange}
                                            placeholder="Nombre"
                                            className="w-24"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Produits d'intérêt
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {productCategories.map(product => (
                                    <label key={product} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.interestedProducts.includes(product)}
                                            onChange={() => handleProductSelect(product)}
                                            className="h-4 w-4 text-blue-600 rounded"
                                        />
                                        <span className="ml-2 text-sm">{product}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Notes supplémentaires..."
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Mise à jour...' : 'Mettre à jour'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
});

EditProspectModal.displayName = 'EditProspectModal';

export default EditProspectModal;
