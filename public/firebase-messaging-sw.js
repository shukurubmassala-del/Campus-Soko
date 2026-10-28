// Firebase Cloud Messaging Background Service Worker for CampusSoko
// Handles background push notifications when app is minimized or tab is in background

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Initialize Firebase in Service Worker
firebase.initializeApp({
  apiKey: 'AIzaSyDemoApiKeyForCampusSokoMVP',
  authDomain: 'campussoko-udsm.firebaseapp.com',
  projectId: 'campussoko-udsm',
  storageBucket: 'campussoko-udsm.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef123456',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || 'CampusSoko Update';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'New update on your campus marketplace.',
    icon: '/logo-icon-appgreen.png',
    badge: '/logo-icon-appgreen.png',
    tag: payload.data?.tag || 'campussoko-notification',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
