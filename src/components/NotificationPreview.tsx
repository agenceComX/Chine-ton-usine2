import React from 'react';
import { Bell, Clock, ExternalLink } from 'lucide-react';
import { Notification } from '../types/notification';
import { useLanguage } from '../context/LanguageContext';

interface NotificationPreviewProps {
  notifications: Notification[];
  unreadCount: number;
  onViewAll: () => void;
  onNotificationClick: (notification: Notification) => void;
  isVisible: boolean;
}

const NotificationPreview: React.FC<NotificationPreviewProps> = ({
  notifications,
  unreadCount,
  onViewAll,
  onNotificationClick,
  isVisible
}) => {
  const { t } = useLanguage();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return t('notifications.timeAgo.now');
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t('notifications.timeAgo.minutes').replace('{0}', minutes.toString());
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t('notifications.timeAgo.hours').replace('{0}', hours.toString());
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return t('notifications.timeAgo.days').replace('{0}', days.toString());
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = "h-4 w-4";
    
    switch (type) {
      case 'order':
        return <Bell className={`${iconClass} text-purple-500`} />;
      case 'payment':
        return <Bell className={`${iconClass} text-green-500`} />;
      case 'shipment':
        return <Bell className={`${iconClass} text-blue-500`} />;
      default:
        return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 z-50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {t('notifications.title')}
          </h3>
          {unreadCount > 0 && (
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {unreadCount > 1 
                ? t('notifications.count.plural').replace('{0}', unreadCount.toString())
                : t('notifications.count.singular').replace('{0}', unreadCount.toString())
              }
            </span>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('notifications.noNotificationsMessage')}</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`
                px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0
                ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
              `}
              onClick={() => onNotificationClick(notification)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`
                    text-sm font-medium truncate
                    ${!notification.isRead 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-700 dark:text-gray-300'
                    }
                  `}>
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                    {notification.actionUrl && (
                      <ExternalLink className="h-3 w-3 text-blue-500" />
                    )}
                  </div>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
          <button
            onClick={onViewAll}
            className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
          >
            {t('notifications.allTypes')} ({notifications.length > 5 ? `${notifications.length - 5}+` : notifications.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPreview;
