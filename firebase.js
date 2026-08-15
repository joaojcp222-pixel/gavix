// =======================================
// GAVIX V13 - FIREBASE
// =======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// CONFIGURAÇÃO DO GAVIX

const firebaseConfig = {
  apiKey: "AIzaSyCLzySzl60i0kCjEwhN7mkvvWMrn9saekw",
  authDomain: "gavix-242c4.firebaseapp.com",
  projectId: "gavix-242c4",
  storageBucket: "gavix-242c4.firebasestorage.app",
  messagingSenderId: "700020636007",
  appId: "1:700020636007:web:63fdfb79f360dea41897c2"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Banco de dados
export const db = getFirestore(app);

// ============================
// BUSCAR JOGOS
// ============================

export async function buscarJogos(){

  const q = query(
    collection(db,"jogos"),
    orderBy("desconto","desc")
  );

  const snapshot = await getDocs(q);

  const lista = [];

  snapshot.forEach(doc=>{

    lista.push({
      id: doc.id,
      ...doc.data()
    });

  });

  return lista;

}

// ============================
// ADICIONAR JOGO
// ============================

export async function salvarJogo(jogo){

  await addDoc(
    collection(db,"jogos"),
    jogo
  );

}