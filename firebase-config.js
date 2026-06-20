// =====================================
// GPF V3.0 - CONFIGURAÇÃO DO FIREBASE
// =====================================
// 1. Crie um projeto no Firebase Console.
// 2. Adicione um app Web.
// 3. Copie o firebaseConfig e cole aqui.
// 4. Ative Authentication > Email/Senha.
// 5. Ative Firestore Database.

const firebaseConfig = {
  apiKey: "AIzaSyCx8GNN4AQWpD0ioMUGiHDthesBmWiIeek",
  authDomain: "gestao-de-producao-florestal.firebaseapp.com",
  projectId: "gestao-de-producao-florestal",
  storageBucket: "gestao-de-producao-florestal.firebasestorage.app",
  messagingSenderId: "279804943694",
  appId: "1:279804943694:web:bd51942b4103563dfdd21f",
  measurementId: "G-4PXFTD7TZX"
};

window.GPF_FIREBASE_CONFIG = firebaseConfig;