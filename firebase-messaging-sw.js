importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBGM19XQWBU3QLQD8hOE2AFJxYg5AdaRNI",
  authDomain: "vtelyu-3207b.firebaseapp.com",
  projectId: "vtelyu-3207b",
  storageBucket: "vtelyu-3207b.firebasestorage.app",
  messagingSenderId: "10248841919",
  appId: "1:10248841919:web:83a6084fbba24bf5a2b40a",
  measurementId: "G-GVTFYYQBRY"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received", payload);
});