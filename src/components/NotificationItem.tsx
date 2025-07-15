import React from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  Settings,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Notification } from '../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onNotificationClick: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onNotificationClick
}) => {
  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = "h-5 w-5";
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'info':
        return <Info className={`${iconClass} text-blue-500`} />;
      case 'order':
        return <ShoppingBag className={`${iconClass} text-purple-500`} />;
      case 'payment':
        return <CreditCard className={`${iconClass} text-green-500`} />;
      case 'shipment':
        return <Truck className={`${iconClass} text-blue-500`} />;
      case 'system':
        return <Settings className={`${iconClass} text-gray-500`} />;
      default:
        return <Info className={`${iconClass} text-gray-500`} />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-gray-400';
      default:
        return 'border-l-gray-400';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} min`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours}h`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days}j`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick(notification);
  };

  const handleMarkAsReadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(notification.id);
  };

  return (
    <div
      className={`
        relative p-4 border-l-4 ${getPriorityColor(notification.priority)}
        ${notification.isRead 
          ? 'bg-white dark:bg-gray-800' 
          : 'bg-blue-50 dark:bg-blue-900/20'
        }
        hover:bg-gray-50 dark:hover:bg-gray-700
        transition-all duration-200 cursor-pointer
        border-b border-gray-200 dark:border-gray-600
      `}
      onClick={handleClick}
    >
      {/* Indicateur de notification non lue */}
      {!notification.isRead && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      )}

      <div className="flex items-start space-x-3">
        {/* Icône */}
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`
              text-sm font-semibold truncate
              ${notification.isRead 
                ? 'text-gray-800 dark:text-gray-200' 
                : 'text-gray-900 dark:text-white'
              }
            `}>
              {notification.title}
            </h4>
            
            {/* Bouton marquer comme lu */}
            {!notification.isRead && (
              <button
                onClick={handleMarkAsReadClick}
                className="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 whitespace-nowrap"
                title="Marquer comme lu"
              >
                Marquer lu
              </button>
            )}
          </div>

          <p className={`
            text-sm mt-1 line-clamp-2
            ${notification.isRead 
              ? 'text-gray-600 dark:text-gray-400' 
              : 'text-gray-700 dark:text-gray-300'
            }
          `}>
            {notification.message}
          </p>

          {/* Métadonnées */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(notification.createdAt)}</span>
              
              {notification.metadata?.amount && (
                <>
                  <span>•</span>
                  <span className="font-medium">
                    {notification.metadata.amount.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: notification.metadata.currency || 'EUR'
                    })}
                  </span>
                </>
              )}
            </div>

            {/* Lien d'action */}
            {notification.actionUrl && (
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                <ExternalLink className="h-3 w-3 mr-1" />
                <span>Voir détails</span>
              </div>
            )}
          </div>

          {/* Badge de priorité */}
          {notification.priority === 'urgent' && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                Urgent
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
