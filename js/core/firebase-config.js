// js/core/firebase-config.js

// Importaciones CDN (NO borres esto)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TU CONFIGURACIÓN NUEVA (crm-exito)
const firebaseConfig = {
  apiKey: "AIzaSyAY2Yq3tN7_Lb01GKogqUSxuZvA_TEBSyk",
  authDomain: "crm-exito.firebaseapp.com",
  projectId: "crm-exito",
  storageBucket: "crm-exito.firebasestorage.app",
  messagingSenderId: "737591479638",
  appId: "1:737591479638:web:27b68aa687811d62b41af7"
};

// Inicializar
const app = initializeApp(firebaseConfig);

// Exportar
export const auth = getAuth(app);
export const db = getFirestore(app);
