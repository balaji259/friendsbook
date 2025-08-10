importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyCYwxxcABau-T4Te4rya6noQ7P61FO_STk",
  authDomain: "friendsbook-ab9e8.firebaseapp.com",
  projectId: "friendsbook-ab9e8",
  messagingSenderId: "704597068080",
  appId: "1:704597068080:web:7bc30a3905dc7f1bd8a0f5"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message', payload);
  self.registration.showNotification(
    payload.notification.title,
    { body: payload.notification.body }
  );
});


self.addEventListener('push', function(event) {
  const payload = event.data ? event.data.json() : {};
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
      body: payload.notification?.body || '',
      icon: '/firebase-logo.png',
      badge: '/firebase-logo.png'
  };

  event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
  );
});