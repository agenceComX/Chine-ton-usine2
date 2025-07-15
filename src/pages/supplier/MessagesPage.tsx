import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Search, Plus, Send, Paperclip, MoreVertical, User } from 'lucide-react';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import SupplierLayout from '../../layouts/SupplierLayout';

interface Message {
  id: string;
  conversationId: string;
  from: string;
  fromType: 'customer' | 'supplier' | 'admin';
  to: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  hasAttachment: boolean;
  priority: 'low' | 'normal' | 'high';
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  subject: string;
}

// Mock data for demonstration (moved outside component)
const mockMessages: Message[] = [
  {
    id: '1',
    conversationId: 'conv1',
    from: 'Marie Dupont',
    fromType: 'customer',
    to: 'Shanghai Electronics Co.',
    subject: 'Question sur la commande ORD-2024-001',
    content: 'Bonjour, je souhaiterais savoir si ma commande de smartphones sera bien livrée demain comme prévu ?',
    timestamp: new Date('2024-01-15T10:30:00'),
    isRead: false,
    hasAttachment: false,
    priority: 'normal'
  },
  {
    id: '2',
    conversationId: 'conv1',
    from: 'Shanghai Electronics Co.',
    fromType: 'supplier',
    to: 'Marie Dupont',
    subject: 'Re: Question sur la commande ORD-2024-001',
    content: 'Bonjour Marie, votre commande a bien été expédiée et sera livrée demain avant 18h. Vous recevrez un SMS de confirmation.',
    timestamp: new Date('2024-01-15T11:15:00'),
    isRead: true,
    hasAttachment: false,
    priority: 'normal'
  },
  {
    id: '3',
    conversationId: 'conv2',
    from: 'Jean Martin',
    fromType: 'customer',
    to: 'Shanghai Electronics Co.',
    subject: 'Demande de devis pour commande groupée',
    content: 'Bonjour, je représente une boutique de mode et je souhaiterais obtenir un devis pour une commande de 100 articles textiles. Pouvez-vous me faire une offre personnalisée ?',
    timestamp: new Date('2024-01-14T16:45:00'),
    isRead: false,
    hasAttachment: true,
    priority: 'high'
  },
  {
    id: '4',
    conversationId: 'conv3',
    from: 'Support ChineTonUsine',
    fromType: 'admin',
    to: 'Shanghai Electronics Co.',
    subject: 'Mise à jour des conditions de vente',
    content: 'Cher partenaire, nous vous informons d\'une mise à jour de nos conditions générales de vente qui entrera en vigueur le 1er février 2024.',
    timestamp: new Date('2024-01-13T09:00:00'),
    isRead: true,
    hasAttachment: true,
    priority: 'normal'
  }
];

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: ['Marie Dupont', 'Shanghai Electronics Co.'],
    lastMessage: mockMessages[1],
    unreadCount: 0,
    subject: 'Question sur la commande ORD-2024-001'
  },
  {
    id: 'conv2',
    participants: ['Jean Martin', 'Shanghai Electronics Co.'],
    lastMessage: mockMessages[2],
    unreadCount: 1,
    subject: 'Demande de devis pour commande groupée'
  },
  {
    id: 'conv3',
    participants: ['Support ChineTonUsine', 'Shanghai Electronics Co.'],
    lastMessage: mockMessages[3],
    unreadCount: 0,
    subject: 'Mise à jour des conditions de vente'
  }
];

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  // Load conversations and messages
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setConversations(mockConversations);
      setMessages(mockMessages);    } catch (err: unknown) {
      console.error('Erreur lors du chargement:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    return conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
           conv.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Get messages for selected conversation
  const conversationMessages = selectedConversation 
    ? messages.filter(m => m.conversationId === selectedConversation)
    : [];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return `Il y a ${days} jours`;
    } else {
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short'
      }).format(date);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (fromType: string) => {
    const icons = {
      customer: <User size={16} />,
      supplier: <MessageSquare size={16} />,
      admin: <User size={16} />
    };
    return icons[fromType as keyof typeof icons] || <User size={16} />;
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const message: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation,
      from: 'Shanghai Electronics Co.',
      fromType: 'supplier',
      to: conversationMessages[0]?.fromType === 'supplier' ? conversationMessages[0].to : conversationMessages[0].from,
      subject: `Re: ${conversationMessages[0]?.subject}`,
      content: newMessage,
      timestamp: new Date(),
      isRead: true,
      hasAttachment: false,
      priority: 'normal'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  return (
    <SupplierLayout>
      {/* Bouton retour */}
      <div className="mb-6">
        <BackButton to="/supplier/dashboard" label="Retour au tableau de bord" variant="ghost" />
      </div>
      
      <div className="flex h-[calc(100vh-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
              <Button size="sm" className="flex items-center gap-2">
                <Plus size={16} />
                Nouveau
              </Button>
            </div>            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" size={16} />
              <input
                type="text"
                placeholder="Rechercher conversations..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Messages non lus</span>
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                {totalUnread}
              </span>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedConversation === conv.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(conv.lastMessage.fromType)}
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {conv.participants.find(p => p !== 'Shanghai Electronics Co.')}
                          </h3>
                          {conv.unreadCount > 0 && (
                            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
                          {conv.subject}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                          {conv.lastMessage.content}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 flex flex-col items-end gap-1">
                        {formatDate(conv.lastMessage.timestamp)}
                        {conv.lastMessage.hasAttachment && (
                          <Paperclip size={12} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Messages Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {conversationMessages[0]?.subject}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Avec {conversationMessages[0]?.fromType === 'supplier' ? conversationMessages[0].to : conversationMessages[0].from}
                    </p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.fromType === 'supplier' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.fromType === 'supplier'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {message.from}
                        </span>
                        {message.priority === 'high' && (
                          <span className={`px-1.5 py-0.5 text-xs rounded ${getPriorityColor(message.priority)}`}>
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${
                          message.fromType === 'supplier' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatDate(message.timestamp)}
                        </span>
                        {message.hasAttachment && (
                          <Paperclip size={12} className={
                            message.fromType === 'supplier' ? 'text-blue-100' : 'text-gray-500'
                          } />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Paperclip size={20} />
                    </button>
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Send size={16} />
                      Envoyer
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choisissez une conversation pour voir les messages
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="absolute top-4 right-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
};

export default MessagesPage;
