import React, { useState } from 'react';
import { Badge, Tabs } from '../../common';
import type { Tab } from '../../common/Tabs';

interface Notification {
  id: string;
  type: 'prescription' | 'appointment' | 'system' | 'message';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
}

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'prescription',
      title: 'Prescription Refill Ready',
      description: 'Your prescription for Lisinopril 10mg is ready for pickup at CVS Pharmacy.',
      timestamp: '2 hours ago',
      read: false,
      priority: 'high',
      actionUrl: '/patient/prescriptions/1',
      actionLabel: 'View Prescription',
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Appointment Reminder',
      description: 'Upcoming appointment with Dr. Sarah Smith tomorrow at 10:30 AM.',
      timestamp: '5 hours ago',
      read: false,
      priority: 'high',
      actionUrl: '/patient/dashboard',
      actionLabel: 'View Appointment',
    },
    {
      id: '3',
      type: 'system',
      title: 'Lab Results Available',
      description: 'Your recent blood work results are now available for review.',
      timestamp: '1 day ago',
      read: false,
      priority: 'medium',
      actionUrl: '/patient/medical-history',
      actionLabel: 'View Results',
    },
    {
      id: '4',
      type: 'message',
      title: 'New Message from Dr. Smith',
      description: 'Dr. Smith has sent you a message regarding your recent visit.',
      timestamp: '2 days ago',
      read: true,
      priority: 'medium',
      actionUrl: '/messages/1',
      actionLabel: 'Read Message',
    },
    {
      id: '5',
      type: 'prescription',
      title: 'Prescription Expiring Soon',
      description: 'Your prescription for Metformin will expire in 7 days. Request a refill now.',
      timestamp: '3 days ago',
      read: true,
      priority: 'medium',
      actionUrl: '/patient/prescriptions/2',
      actionLabel: 'Request Refill',
    },
    {
      id: '6',
      type: 'system',
      title: 'Account Security Update',
      description: 'Two-factor authentication is now available. Enable it to secure your account.',
      timestamp: '1 week ago',
      read: true,
      priority: 'low',
      actionUrl: '/patient/settings',
      actionLabel: 'Enable 2FA',
    },
  ]);

  const tabs: Tab[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'prescription', label: 'Prescriptions' },
    { key: 'appointment', label: 'Appointments' },
  ];

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return (
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case 'appointment':
        return (
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case 'message':
        return (
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0 ? (
              <>
                You have <span className="font-medium">{unreadCount}</span> unread
                notification{unreadCount !== 1 ? 's' : ''}
              </>
            ) : (
              'You\'re all caught up!'
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-xl font-semibold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Unread</p>
              <p className="text-xl font-semibold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Prescriptions</p>
              <p className="text-xl font-semibold text-gray-900">
                {notifications.filter((n) => n.type === 'prescription').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Appointments</p>
              <p className="text-xl font-semibold text-gray-900">
                {notifications.filter((n) => n.type === 'appointment').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'unread'
                  ? 'You\'re all caught up! No unread notifications.'
                  : 'No notifications in this category.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                      !notification.read ? 'bg-white' : 'bg-gray-100'
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                          )}
                          {notification.priority === 'high' && (
                            <Badge variant="danger" size="sm">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.description}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {notification.timestamp}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Action Button */}
                    {notification.actionLabel && (
                      <div className="mt-3">
                        <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                          {notification.actionLabel} →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
