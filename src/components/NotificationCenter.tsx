import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Bell, Clock, Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  const unreadCount = 0;
  const criticalCount = 0;
  const notifications: any[] = [];

  const filteredNotifications = notifications
    .filter(notification => {
      switch (filter) {
        case 'unread':
          return !notification.is_read;
        case 'critical':
          return notification.severity === 'critical';
        default:
          return true;
      }
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sla_warning':
        return <Clock className="h-4 w-4" />;
      case 'escalation':
        return <AlertTriangle className="h-4 w-4" />;
      case 'urgent_ticket':
        return <Bell className="h-4 w-4" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {criticalCount > 0 && (
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2 mt-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === 'all' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === 'unread'
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('critical')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === 'critical' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Critical ({criticalCount})
                </button>
              </div>

              {/* Actions */}
              {unreadCount > 0 && (
                <button className="mt-2 text-sm text-primary-600 hover:text-primary-800">Mark all as read</button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filter === 'all' ? "You're all caught up!" : `No ${filter} notifications`}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 p-2 rounded-full ${getSeverityColor(notification.severity)}`}>
                          {getTypeIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p
                              className={`text-sm ${
                                !notification.is_read ? 'font-semibold' : 'font-medium'
                              } text-gray-900`}
                            >
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => {}}
                                className="text-gray-400 hover:text-gray-600"
                                title={notification.is_read ? 'Mark as unread' : 'Mark as read'}
                              >
                                {notification.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => {}}
                                className="text-gray-400 hover:text-red-600"
                                title="Delete notification"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">Ticket #{notification.ticket_id}</p>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </p>
                          </div>

                          <div className="flex items-center mt-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                                notification.severity
                              )}`}
                            >
                              {notification.severity}
                            </span>
                            <span className="ml-2 text-xs text-gray-500 capitalize">
                              {notification.type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
