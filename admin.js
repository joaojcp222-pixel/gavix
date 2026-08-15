// ===========================================
// GAVIX V13 - ADMIN FIREBASE
// ===========================================

import { salvarJogo } from "./firebase.js";

const form = document.getElementById("formJogo");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const jogo = {

        nome: document.getElementById("nome").value.trim(),

        loja: document.getElementById("loja").value,

        preco: Number(document.getElementById("preco").value),

        preco_antigo: Number(document.getElementById("precoAntigo").value),

        desconto: Number(document.getElementById("desconto").value),

        plataforma: document.getElementById("plataforma").value,

        imagem: document.getElementById("imagem").value.trim(),

        link: document.getElementById("link").value.trim(),

        descricao: document.getElementById("descricao").value.trim(),

        criadoEm: new Date().toISOString()

    };

    try{

        status.style.color = "#ffd54a";
        status.textContent = "Enviando para o Firebase...";

        await salvarJogo(jogo);

        status.style.color = "#72ff91";
        status.textContent = "✅ Jogo salvo com sucesso!";

        form.reset();

    }catch(err){

        console.error(err);

        status.style.color = "#ff6b6b";
        status.textContent = "❌ Erro ao salvar no Firebase.";

    }

});