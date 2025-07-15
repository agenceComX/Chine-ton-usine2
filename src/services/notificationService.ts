import { Notification, NotificationFilters, NotificationResponse, CreateNotificationRequest } from '../types/notification';

// Stockage des notifications (vide par défaut)
let mockNotifications: Notification[] = [];

class NotificationService {
  async getNotifications(
    page: number = 1,
    limit: number = 20,
    filters?: NotificationFilters
  ): Promise<NotificationResponse> {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredNotifications = [...mockNotifications];

    // Appliquer les filtres
    if (filters) {
      if (filters.isRead !== undefined) {
        filteredNotifications = filteredNotifications.filter(n => n.isRead === filters.isRead);
      }
      if (filters.type) {
        filteredNotifications = filteredNotifications.filter(n => n.type === filters.type);
      }
      if (filters.priority) {
        filteredNotifications = filteredNotifications.filter(n => n.priority === filters.priority);
      }
      if (filters.dateFrom) {
        filteredNotifications = filteredNotifications.filter(n => n.createdAt >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        filteredNotifications = filteredNotifications.filter(n => n.createdAt <= filters.dateTo!);
      }
    }

    // Trier par date décroissante
    filteredNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

    const unreadCount = mockNotifications.filter(n => !n.isRead).length;

    return {
      notifications: paginatedNotifications,
      total: filteredNotifications.length,
      unreadCount,
      hasMore: endIndex < filteredNotifications.length
    };
  }

  async markAsRead(notificationIds: string[]): Promise<void> {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    mockNotifications = mockNotifications.map(notification => 
      notificationIds.includes(notification.id) 
        ? { ...notification, isRead: true, updatedAt: new Date() }
        : notification
    );
  }

  async markAllAsRead(): Promise<void> {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    mockNotifications = mockNotifications.map(notification => ({
      ...notification,
      isRead: true,
      updatedAt: new Date()
    }));
  }

  async createNotification(request: CreateNotificationRequest): Promise<Notification> {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: request.title,
      message: request.message,
      type: request.type,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: request.userId,
      priority: request.priority || 'medium',
      actionUrl: request.actionUrl,
      metadata: request.metadata || {}
    };

    mockNotifications.unshift(newNotification);
    return newNotification;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    mockNotifications = mockNotifications.filter(n => n.id !== notificationId);
  }
  // Méthode pour obtenir le nombre de notifications non lues
  async getUnreadCount(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockNotifications.filter(n => !n.isRead).length;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
