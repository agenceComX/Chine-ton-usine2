export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'order' | 'payment' | 'shipment' | 'system';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: {
    orderId?: string;
    productId?: string;
    amount?: number;
    currency?: string;
    [key: string]: any;
  };
}

export interface NotificationFilters {
  isRead?: boolean;
  type?: Notification['type'];
  priority?: Notification['priority'];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: Notification['type'];
  userId: string;
  priority?: Notification['priority'];
  actionUrl?: string;
  metadata?: Notification['metadata'];
}

export interface MarkAsReadRequest {
  notificationIds: string[];
}
