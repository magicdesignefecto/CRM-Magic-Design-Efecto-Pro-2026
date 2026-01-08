// js/core/firebase-config.js

// Usamos las versiones Web (CDN) compatibles con módulos
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tu configuración (La que copiaste)
const firebaseConfig = {
  apiKey: "AIzaSyCD0BTuegpTrLdQQ_y-RujEJ-QNRSAddpE",
  authDomain: "magic-crm-f8b74.firebaseapp.com",
  projectId: "magic-crm-f8b74",
  storageBucket: "magic-crm-f8b74.firebasestorage.app",
  messagingSenderId: "268002769612",
  appId: "1:268002769612:web:4a6d2f998d487af8792069"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportamos las herramientas para usarlas en los servicios
export const auth = getAuth(app);
export const db = getFirestore(app);