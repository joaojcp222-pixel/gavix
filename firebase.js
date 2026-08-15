import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLzySzl60i0kCjEwhN7mkvvWMrn9saekw",
  authDomain: "gavix-242c4.firebaseapp.com",
  projectId: "gavix-242c4",
  storageBucket: "gavix-242c4.firebasestorage.app",
  messagingSenderId: "700020636007",
  appId: "1:700020636007:web:63fdfb79f360dea41897c2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CACHE = "gavix_v15_cache";

// BUSCAR JOGOS
export async function buscarJogos(){

  try{

    const snap = await getDocs(collection(db,"jogos"));

    const jogos = [];

    snap.forEach(doc=>{

      jogos.push({
        id:doc.id,
        ...doc.data()
      });

    });

    jogos.sort((a,b)=>b.desconto-a.desconto);

    localStorage.setItem(CACHE,JSON.stringify(jogos));

    return jogos;

  }catch(e){

    console.log("Firebase indisponível, usando cache.");

    const cache = localStorage.getItem(CACHE);

    if(cache) return JSON.parse(cache);

    return [];

  }

}

// SALVAR JOGO
export async function salvarJogo(jogo){

  await addDoc(collection(db,"jogos"),jogo);

}