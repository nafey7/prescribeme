import { useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

/**
 * Custom hook for notifications
 * Note: This is a simple implementation. You can replace with a toast library like react-hot-toast, sonner, etc.
 */
export function useNotification() {
  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);

    // TODO: Integrate with your preferred notification library
    // Example with react-hot-toast:
    // if (type === 'success') toast.success(message);
    // if (type === 'error') toast.error(message);
    // if (type === 'info') toast(message);
    // if (type === 'warning') toast((t) => <span>{message}</span>);
  }, []);

  const success = useCallback((message: string) => showNotification(message, 'success'), [showNotification]);
  const error = useCallback((message: string) => showNotification(message, 'error'), [showNotification]);
  const info = useCallback((message: string) => showNotification(message, 'info'), [showNotification]);
  const warning = useCallback((message: string) => showNotification(message, 'warning'), [showNotification]);

  return { showNotification, success, error, info, warning };
}
