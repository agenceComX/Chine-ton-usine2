import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, Eye, Upload, Calendar, File } from 'lucide-react';
import Button from '../../components/Button';
import AdminLayout from '../../layouts/AdminLayout';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'invoice' | 'certificate' | 'report' | 'other';
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  downloads: number;
  isPublic: boolean;
  tags: string[];
  description?: string;
}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [error, setError] = useState('');

  // Mock data for demonstration
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Contrat fournisseur Shanghai Electronics.pdf',
      type: 'contract',
      size: 2048576, // 2MB
      uploadedBy: 'admin@chinetousine.com',
      uploadedAt: new Date('2024-01-10'),
      downloads: 23,
      isPublic: false,
      tags: ['fournisseur', 'électronique', 'shanghai'],
      description: 'Contrat de partenariat avec Shanghai Electronics Co.'
    },
    {
      id: '2',
      name: 'Certificats de qualité Q4 2023.pdf',
      type: 'certificate',
      size: 1536000, // 1.5MB
      uploadedBy: 'quality@chinetousine.com',
      uploadedAt: new Date('2024-01-08'),
      downloads: 45,
      isPublic: true,
      tags: ['qualité', 'certification', 'Q4'],
      description: 'Certificats de qualité pour le Q4 2023'
    },
    {
      id: '3',
      name: 'Rapport activité janvier 2024.docx',
      type: 'report',
      size: 512000, // 500KB
      uploadedBy: 'manager@chinetousine.com',
      uploadedAt: new Date('2024-01-15'),
      downloads: 12,
      isPublic: false,
      tags: ['rapport', 'activité', 'janvier'],
      description: 'Rapport mensuel d\'activité'
    },
    {
      id: '4',
      name: 'Facture_001_Guangzhou_Textiles.pdf',
      type: 'invoice',
      size: 256000, // 250KB
      uploadedBy: 'accounting@chinetousine.com',
      uploadedAt: new Date('2024-01-12'),
      downloads: 8,
      isPublic: false,
      tags: ['facture', 'guangzhou', 'textile'],
      description: 'Facture fournisseur Guangzhou Textiles'
    },
    {
      id: '5',
      name: 'Guide utilisateur plateforme.pdf',
      type: 'other',
      size: 3072000, // 3MB
      uploadedBy: 'support@chinetousine.com',
      uploadedAt: new Date('2024-01-05'),
      downloads: 156,
      isPublic: true,
      tags: ['guide', 'utilisateur', 'aide'],
      description: 'Guide d\'utilisation de la plateforme'
    }
  ];

  // Load documents
  const loadDocuments = async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setDocuments(mockDocuments);
    } catch (err: unknown) {
      console.error('Erreur lors du chargement:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === '' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      contract: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      invoice: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      certificate: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
      report: 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeText = (type: string) => {
    const texts = {
      contract: 'Contrat',
      invoice: 'Facture',
      certificate: 'Certificat',
      report: 'Rapport',
      other: 'Autre'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestion des Documents
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez tous les documents de la plateforme
            </p>
          </div>
          <Button onClick={() => console.log('Upload document')} className="flex items-center gap-2">
            <Upload size={16} />
            Télécharger un document
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{documents.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Publics</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {documents.filter(d => d.isPublic).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Téléchargements</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {documents.reduce((sum, doc) => sum + doc.downloads, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <File className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Taille totale</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, description ou tags..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={typeFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Tous les types</option>
                <option value="contract">Contrat</option>
                <option value="invoice">Facture</option>
                <option value="certificate">Certificat</option>
                <option value="report">Rapport</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Chargement...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center mr-4">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {doc.name}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(doc.type)}`}>
                            {getTypeText(doc.type)}
                          </span>
                          {doc.isPublic && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full">
                              Public
                            </span>
                          )}
                        </div>
                        
                        {doc.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {doc.description}
                          </p>
                        )}
                        
                        {doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {doc.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <File size={12} />
                            {formatFileSize(doc.size)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download size={12} />
                            {doc.downloads} téléchargements
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(doc.uploadedAt)}
                          </span>
                          <span>par {doc.uploadedBy}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        onClick={() => console.log('View document:', doc)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye size={14} />
                        Voir
                      </Button>
                      <Button
                        onClick={() => console.log('Download document:', doc)}
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Download size={14} />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DocumentsPage;
