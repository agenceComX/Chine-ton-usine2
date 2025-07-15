import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Filter, 
  Loader2, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import { Notification, NotificationFilters } from '../types/notification';
import { notificationService } from '../services/notificationService';
import { useLanguage } from '../context/LanguageContext';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange: (count: number) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onUnreadCountChange
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  const notificationCenterRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Charger les notifications
  const loadNotifications = async (resetPage = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const currentPage = resetPage ? 1 : page;
      const response = await notificationService.getNotifications(currentPage, 20, filters);
      
      if (resetPage) {
        setNotifications(response.notifications);
        setPage(2);
      } else {
        setNotifications(prev => [...prev, ...response.notifications]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(response.hasMore);
      setUnreadCount(response.unreadCount);
      onUnreadCountChange(response.unreadCount);
    } catch (err) {
      setError('Erreur lors du chargement des notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fermeture avec Échap
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Fermeture au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        notificationCenterRef.current &&
        !notificationCenterRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Charger les notifications au montage et lors des changements de filtres
  useEffect(() => {
    if (isOpen) {
      loadNotifications(true);
    }
  }, [isOpen, filters]);

  // Scroll infini
  const handleScroll = () => {
    if (!scrollContainerRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      loadNotifications();
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [loading, hasMore]);

  // Marquer une notification comme lue
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead([notificationId]);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      const newUnreadCount = Math.max(0, unreadCount - 1);
      setUnreadCount(newUnreadCount);
      onUnreadCountChange(newUnreadCount);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Marquer toutes les notifications comme lues
  const handleMarkAllAsRead = async () => {
    if (markingAllAsRead) return;

    setMarkingAllAsRead(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
      onUnreadCountChange(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  // Gérer le clic sur une notification
  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  // Rafraîchir les notifications
  const handleRefresh = () => {
    setPage(1);
    loadNotifications(true);
  };

  // Gestion des filtres
  const handleFilterChange = (newFilters: Partial<NotificationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" />
      
      {/* Notification Center */}
      <div
        ref={notificationCenterRef}
        className={`
          fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Rafraîchir"
            >
              <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                p-2 rounded-lg transition-colors
                ${showFilters 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
              title="Filtres"
            >
              <Filter className="h-4 w-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filtres */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                value={filters.isRead === undefined ? 'all' : filters.isRead ? 'read' : 'unread'}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange({
                    isRead: value === 'all' ? undefined : value === 'read'
                  });
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes</option>
                <option value="unread">Non lues</option>
                <option value="read">Lues</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={filters.type || 'all'}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange({
                    type: value === 'all' ? undefined : value as Notification['type']
                  });
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="order">Commandes</option>
                <option value="payment">Paiements</option>
                <option value="shipment">Expéditions</option>
                <option value="system">Système</option>
                <option value="info">Informations</option>
                <option value="warning">Avertissements</option>
                <option value="error">Erreurs</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={clearFilters}
                className="flex-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Effacer
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAllAsRead}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {markingAllAsRead ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}
              <span>Marquer tout comme lu</span>
            </button>
          </div>
        )}

        {/* Liste des notifications */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
        >
          {error && (
            <div className="p-4 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2 text-red-800 dark:text-red-300">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {notifications.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500 dark:text-gray-400">
              <Bell className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Aucune notification</p>
              <p className="text-sm text-center">
                Vous n'avez pas de notifications pour le moment
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onNotificationClick={handleNotificationClick}
                />
              ))}

              {loading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    Chargement...
                  </span>
                </div>
              )}

              {!hasMore && notifications.length > 0 && (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
                  Toutes les notifications ont été chargées
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;
