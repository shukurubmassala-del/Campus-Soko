import { app } from './firebase';
import { StorageService } from './storage';
import { AppNotification, NotificationType } from '../types';

let messagingInstance: any = null;

/**
 * Checks if Notification API & ServiceWorker are supported in the current browser/device
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Returns current browser notification permission
 */
export function getPushPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!isPushNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Dynamically initializes Firebase Messaging only if supported
 */
export async function getFirebaseMessaging() {
  if (messagingInstance) return messagingInstance;
  if (!isPushNotificationSupported()) return null;

  try {
    const { getMessaging, isSupported } = await import('firebase/messaging');
    const supported = await isSupported();
    if (supported) {
      messagingInstance = getMessaging(app);
      return messagingInstance;
    }
  } catch (err) {
    console.warn('[FCM] Firebase Messaging is not supported or failed to initialize in this environment:', err);
  }
  return null;
}

/**
 * Requests browser push notification permission and acquires FCM token
 */
export async function requestFcmPushToken(): Promise<{
  success: boolean;
  token: string | null;
  permission: NotificationPermission | 'unsupported';
  error?: string;
}> {
  if (!isPushNotificationSupported()) {
    return { success: false, token: null, permission: 'unsupported', error: 'Push notifications are not supported on this browser.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, token: null, permission };
    }

    // Try registering the service worker if not already registered
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      try {
        swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      } catch (swErr) {
        console.warn('[FCM] Service worker registration warning:', swErr);
      }
    }

    const messaging = await getFirebaseMessaging();
    let token: string | null = null;

    if (messaging) {
      try {
        const { getToken } = await import('firebase/messaging');
        token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined,
          serviceWorkerRegistration: swRegistration,
        });
      } catch (tokenErr) {
        console.warn('[FCM] getToken using VAPID key failed, using generated client FCM token:', tokenErr);
      }
    }

    // Fallback client token if VAPID is not set in sandbox
    if (!token) {
      token = 'fcm_token_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
    }

    StorageService.saveFcmToken(token);
    
    // Register token with backend server
    registerPushTokenWithServer(token).catch((err) => {
      console.warn('[FCM] Server token registration ignored:', err);
    });

    return { success: true, token, permission: 'granted' };
  } catch (err: any) {
    console.error('[FCM] Error requesting FCM token:', err);
    return { success: false, token: null, permission: getPushPermissionStatus(), error: err.message };
  }
}

/**
 * Registers acquired FCM token with our backend server
 */
export async function registerPushTokenWithServer(token: string, userId?: string) {
  try {
    const res = await fetch('/api/notifications/register-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, userId }),
    });
    return await res.json();
  } catch (err) {
    console.warn('[FCM] Failed to sync token with backend API:', err);
    return null;
  }
}

/**
 * Dispatches push notification via backend FCM route and local browser notification
 */
export async function dispatchPushNotification(payload: {
  type: NotificationType;
  title: string;
  body: string;
  data?: any;
}) {
  // 1. Show immediate local browser notification if permitted
  displayBrowserPushNotification(payload.title, payload.body, {
    data: payload.data,
    tag: `campussoko-${payload.type}`,
  });

  // 2. Dispatch to server-side FCM queue
  try {
    const token = StorageService.getFcmToken();
    await fetch('/api/notifications/send-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: payload.type,
        title: payload.title,
        body: payload.body,
        data: payload.data,
        targetToken: token,
      }),
    });
  } catch (err) {
    console.warn('[FCM] Dispatch to server failed:', err);
  }
}

/**
 * Registers real-time listener for incoming foreground FCM messages
 */
export async function setupFcmForegroundListener(
  onMessageReceived: (payload: { title: string; body: string; type: NotificationType; data?: any }) => void
) {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => {};

  try {
    const { onMessage } = await import('firebase/messaging');
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('[FCM] Foreground push received:', payload);
      const title = payload.notification?.title || payload.data?.title || 'CampusSoko Alert';
      const body = payload.notification?.body || payload.data?.body || '';
      const type = (payload.data?.type as NotificationType) || 'new_message';

      onMessageReceived({ title, body, type, data: payload.data });
    });
    return unsubscribe;
  } catch (err) {
    console.warn('[FCM] onMessage registration failed:', err);
    return () => {};
  }
}

/**
 * Shows local browser push notification if permissions are granted
 */
export function displayBrowserPushNotification(
  title: string,
  body: string,
  options?: { icon?: string; tag?: string; data?: any }
) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    const notif = new Notification(title, {
      body,
      icon: options?.icon || '/logo-icon-appgreen.png',
      badge: '/logo-icon-appgreen.png',
      tag: options?.tag || 'campussoko',
      data: options?.data,
    });

    notif.onclick = () => {
      window.focus();
      notif.close();
    };
  } catch (err) {
    console.warn('[FCM] Browser Notification construction warning:', err);
  }
}

