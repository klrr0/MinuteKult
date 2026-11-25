import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDWePvjZFFXf7J1WE_aU6QqVo7IVdsvkLs",
    authDomain: "minutekult.firebaseapp.com",
    projectId: "minutekult",
    storageBucket: "minutekult.firebasestorage.app",
    messagingSenderId: "1035080964563",
    appId: "1:1035080964563:web:aba8318cff31309ee8b726"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const pseudoInput = document.getElementById("pseudo");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

document.getElementById("register-btn").onclick = async () => {

    const pseudo = pseudoInput.value.trim();
    const password = passwordInput.value.trim();

    if (!pseudo || !password) {
        message.textContent = "Remplis tous les champs.";
        return;
    }

    const q = query(
        collection(db, "users"),
        where("pseudo", "==", pseudo)
    );

    const result = await getDocs(q);

    if (!result.empty) {
        message.textContent = "Pseudo déjà utilisé.";
        return;
    }

await addDoc(collection(db, "users"), {
    pseudo,
    password,
    score: 0,
    quizzesCompleted: 0,
    bestScore: 0
});
    localStorage.removeItem("guest");
    message.textContent = "Compte créé avec succès ✅";
};

document.getElementById("login-btn").onclick = async () => {

    const pseudo = pseudoInput.value.trim();
    const password = passwordInput.value.trim();

    const q = query(
        collection(db, "users"),
        where("pseudo", "==", pseudo),
        where("password", "==", password)
    );

    const result = await getDocs(q);

    if (result.empty) {
    message.textContent = "Identifiants incorrects.";
    return;
}

const userDoc = result.docs[0];

localStorage.setItem("pseudo", pseudo);
localStorage.setItem("userId", userDoc.id);

// Désactive le mode invité
localStorage.removeItem("guest");

message.textContent = "Connexion réussie ✅";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
};

document.getElementById("guest-btn").onclick = () => {

    localStorage.setItem("pseudo", "Invité");
    localStorage.setItem("guest", "true");

    window.location.href = "index.html";
};