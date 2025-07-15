import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types/notification';

interface UseNotificationsOptions {
  pollInterval?: number;
  autoRefresh?: boolean;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { pollInterval = 30000, autoRefresh = true } = options;
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer le nombre de notifications non lues
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
      return count;
    } catch (err) {
      console.error('Error fetching unread count:', err);
      return 0;
    }
  }, []);

  // Récupérer les notifications récentes
  const fetchRecentNotifications = useCallback(async (limit = 5) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await notificationService.getNotifications(1, limit);
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      console.error('Error fetching notifications:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead([notificationId]);
      
      // Mettre à jour l'état local
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      // Décrémenter le compteur
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Mettre à jour l'état local
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  }, []);

  // Ajouter une nouvelle notification (pour les tests)
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newNotification = await notificationService.createNotification({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        userId: notification.userId,
        priority: notification.priority,
        actionUrl: notification.actionUrl,
        metadata: notification.metadata
      });
      
      // Ajouter à l'état local
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
      
      if (!newNotification.isRead) {
        setUnreadCount(prev => prev + 1);
      }
        return newNotification;
    } catch (err) {
      console.error('Error adding notification:', err);
      return null;
    }
  }, []);

  // Effet pour le polling automatique
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, pollInterval, fetchUnreadCount]);

  // Chargement initial
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchRecentNotifications,
    fetchUnreadCount,
    markAsRead,    markAllAsRead,
    addNotification,
    refresh: fetchUnreadCount
  };
};
