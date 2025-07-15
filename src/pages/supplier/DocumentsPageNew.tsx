import React, { useState } from 'react';
import SupplierLayout from '../../layouts/SupplierLayout';
import BackButton from '../../components/BackButton';
import DocumentUploadModal from '../../components/DocumentUploadModal';
import { useLanguage } from '../../context/LanguageContext';
import { 
  FileText, 
  Download, 
  Search, 
  Eye,
  Trash2,
  Plus,
  Calendar,
  FolderOpen,
  Check,
  Clock,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/Button';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'invoice' | 'certificate' | 'manual' | 'other';
  size: string;
  uploadDate: string;
  status: 'approved' | 'pending' | 'rejected';
  downloadCount: number;
  category: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Contrat fournisseur 2024.pdf',
    type: 'contract',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    status: 'approved',
    downloadCount: 45,
    category: 'Contrats'
  },
  {
    id: '2',
    name: 'Facture F-2024-001.pdf',
    type: 'invoice',
    size: '1.2 MB',
    uploadDate: '2024-01-14',
    status: 'approved',
    downloadCount: 23,
    category: 'Factures'
  },
  {
    id: '3',
    name: 'Certificat ISO 9001.pdf',
    type: 'certificate',
    size: '856 KB',
    uploadDate: '2024-01-10',
    status: 'pending',
    downloadCount: 12,
    category: 'Certifications'
  },
  {
    id: '4',
    name: 'Manuel utilisateur produit A.pdf',
    type: 'manual',
    size: '5.1 MB',
    uploadDate: '2024-01-08',
    status: 'approved',
    downloadCount: 67,
    category: 'Manuels'
  },
  {
    id: '5',
    name: 'Conditions générales.pdf',
    type: 'other',
    size: '743 KB',
    uploadDate: '2024-01-05',
    status: 'rejected',
    downloadCount: 8,
    category: 'Légal'
  }
];

const DocumentsPage: React.FC = () => {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'contract':
        return 'Contrat';
      case 'invoice':
        return 'Facture';
      case 'certificate':
        return 'Certificat';
      case 'manual':
        return 'Manuel';
      case 'other':
        return 'Autre';
      default:
        return type;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUploadDocuments = async (files: File[], metadata: any) => {
    try {
      // Simulation de l'upload - dans un vrai projet, vous feriez un appel API
      console.log('Uploading files:', files);
      console.log('Metadata:', metadata);

      // Simuler un délai d'upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Ajouter les nouveaux documents à la liste
      const newDocuments = files.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        type: metadata.type,
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending' as const,
        downloadCount: 0,
        category: metadata.category
      }));

      setDocuments(prev => [...newDocuments, ...prev]);
      
      // Afficher un message de succès
      alert(`${files.length} document(s) téléchargé(s) avec succès !`);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      throw error;
    }
  };

  const handleDownloadDocument = (document: Document) => {
    // Simulation du téléchargement
    console.log('Downloading document:', document.name);
    
    // Créer un lien de téléchargement fictif
    const link = window.document.createElement('a');
    link.href = `data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKCR7ZG9jdW1lbnQubmFtZX0pCi9Qcm9kdWNlciAoKQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSAKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+Cj4+Cj4+Ci9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKNSAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzIwIFRkCihEb2N1bWVudCBkZSBkZW1vbnN0cmF0aW9uKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMDMgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAyIDAgUgo+PgpzdGFydHhyZWYKMzk0CiUlRU9G`;
    link.download = document.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);

    // Incrémenter le compteur de téléchargements
    setDocuments(prev => prev.map(doc => 
      doc.id === document.id 
        ? { ...doc, downloadCount: doc.downloadCount + 1 }
        : doc
    ));
  };
  const handleDeleteDocument = (documentId: string) => {
    if (confirm(t('supplier.documents.confirm.delete'))) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    }
  };

  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Bouton retour */}
        <BackButton to="/supplier/dashboard" label="Retour au tableau de bord" variant="ghost" />

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Gérez vos documents et fichiers
            </p>
          </div>          <Button 
            className="mt-4 sm:mt-0"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('supplier.documents.uploadDocument')}
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Documents</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{documents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Approuvés</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {documents.filter(d => d.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">En attente</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {documents.filter(d => d.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Download className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Téléchargements</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {documents.reduce((total, doc) => total + doc.downloadCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher un document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                />
              </div>            </div>
            
            <div className="w-full sm:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                  <option value="all">Tous les types</option>
                  <option value="contract">Contrats</option>
                  <option value="invoice">Factures</option>
                  <option value="certificate">Certificats</option>
                  <option value="manual">Manuels</option>
                  <option value="other">Autres</option>                <option value="all">Tous les types</option>
                <option value="contract">Contrats</option>
                <option value="invoice">Factures</option>
                <option value="certificate">Certificats</option>
                <option value="manual">Manuels</option>
                <option value="other">Autres</option>
              </select>
            </div>
              
            <div className="w-full sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="approved">Approuvés</option>
                <option value="pending">En attente</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des documents */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Taille
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Téléchargements
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FolderOpen className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {document.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {document.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {getTypeText(document.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {document.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(document.status)}
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                          {getStatusText(document.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {document.downloadCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          title="Prévisualiser"
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="h-4 w-4" />
                        </button>                        <button 
                          title={t('supplier.documents.download')}
                          onClick={() => handleDownloadDocument(document)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <Download className="h-4 w-4" />
                        </button>                        <button 
                          title={t('supplier.documents.delete')}
                          onClick={() => handleDeleteDocument(document.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun document trouvé</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aucun document ne correspond à vos critères de recherche.
            </p>
          </div>
        )}

        {/* Modal d'upload */}
        <DocumentUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUploadDocuments}
        />
      </div>
    </SupplierLayout>
  );
};

export default DocumentsPage;
