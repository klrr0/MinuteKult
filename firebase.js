import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWePvjZFFXf7J1WE_aU6QqVo7IVdsvkLs",
  authDomain: "minutekult.firebaseapp.com",
  projectId: "minutekult",
  storageBucket: "minutekult.firebasestorage.app",
  messagingSenderId: "1035080964563",
  appId: "1:1035080964563:web:aba8318cff31309ee8b726"
};

const app = initializeApp(firebaseConfig);

export { app };