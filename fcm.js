import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {getMessaging, getToken, deleteToken, onMessage} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging.js";

// Firebase configuration di project setting -> General 
const firebaseConfig = { 
  apiKey: "AIzaSyBGM19XQWBU3QLQD8hOE2AFJxYg5AdaRNI",
  authDomain: "vtelyu-3207b.firebaseapp.com",
  databaseURL: "https://vtelyu-3207b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vtelyu-3207b",
  storageBucket: "vtelyu-3207b.firebasestorage.app",
  messagingSenderId: "10248841919",
  appId: "1:10248841919:web:83a6084fbba24bf5a2b40a",
  measurementId: "G-GVTFYYQBRY"
};

const app = initializeApp(firebaseConfig);
// Commented part = code attempt used for mobile app
// let messaging = null;
// if ('Notification' in window) {
//     messaging = getMessaging(app);
// } else {
//     console.log("Android WebView detected. Skipping Firebase Web SDK initialization.");
// }
const messaging = getMessaging(app);

window.enableFCM = async function () {
  // if (!('Notification' in window)) {
  //   console.log("Running in Android WebView. Skipping Web Push.");
  //   alert("Notifications are automatically handled by the Android App!");
  //   return; // Stop running here so it never hits the crash below!
  // }
  console.log("Button clicked, requesting permission...");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {alert("Notification permission gagal");
    return;
  }
  console.log("Browser returned:", permission);
  if ('serviceWorker' in navigator) {
    try {await navigator.serviceWorker.register('./firebase-messaging-sw.js');
    } catch (err) {console.error("Service Worker registration failed:", err);
      return;
    }
  }
  const registration = await navigator.serviceWorker.ready;
  try {const token = await getToken(messaging, {
      vapidKey: "BE2c88nev-lHX6l_wrW2CoI86EEgX2Ybez9QdaD7ptpUi0Jx4SbBSbu4bQe_PX-B8g1eIrsbhSt7UIMa7coZsnE", // VAPID key from Firebase project settings -> Cloud Messaging
      serviceWorkerRegistration: registration
    });
    if (!token) {alert("Failed to get FCM token");
      return;
    }
    localStorage.setItem("fcmToken", token);
    localStorage.setItem("notificationsEnabled", "true");
    await fetch("https://vtelyu.nazrielariel2005.workers.dev/register-token", {method: "POST", body: token}); // 
    console.log("FCM TOKEN:", token);
    console.log("Token Sent to Cloudflare");
    return token;
  } catch (error) {
    console.error("Error generating or sending token:", error);
    alert("An error occurred while enabling notifications. Check console.");
  }
};

window.disableFCM = async function () {
  const token = localStorage.getItem("fcmToken");
  if (!token) {localStorage.setItem("notificationsEnabled", "false");
    return;
  }
  try {await fetch("https://vtelyu.nazrielariel2005.workers.dev/unregister-token", {
      method: "POST",
      body: token
    });
    if ('serviceWorker' in navigator) {const registration = await navigator.serviceWorker.getRegistration('./');
      if (registration) {const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {await existingSub.unsubscribe();
          console.log("Browser push subscription safely removed.");
        }
      }
    }
    try {await deleteToken(messaging);
    } catch (fbError) {
      console.log("Note: Firebase background token deletion skipped (expected on subfolder hosting).");
    }

    localStorage.removeItem("fcmToken");
    localStorage.setItem("notificationsEnabled", "false");
    console.log("Notifications successfully disabled!");
  } catch (error) {
    console.error("Error disabling FCM:", error);
    localStorage.setItem("notificationsEnabled", "false");
  }
};

onMessage(messaging, (payload) => {
  console.log("Foreground Message:", payload);
});