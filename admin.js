// ===========================================
// GAVIX ADMIN + IMPORTADOR FIREBASE
// ===========================================

import { salvarJogo } from "./firebase.js";

const form = document.getElementById("formJogo");
const status = document.getElementById("status");

// -------------------------
// SALVAR 1 JOGO
// -------------------------
form.addEventListener("submit", async (e)=>{

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

        status.style.color="#ffd54a";
        status.textContent="Enviando...";

        await salvarJogo(jogo);

        status.style.color="#72ff91";
        status.textContent="✅ Jogo salvo!";

        form.reset();

    }catch(err){

        console.error(err);

        status.style.color="#ff6b6b";
        status.textContent="Erro ao salvar.";

    }

});

// -------------------------
// IMPORTAR 179 JOGOS
// -------------------------

const botao = document.createElement("button");

botao.textContent="🚀 Importar ofertas.json";

botao.style.marginTop="20px";
botao.style.width="100%";

document.querySelector(".panel").appendChild(botao);

botao.addEventListener("click", async ()=>{

    try{

        botao.disabled=true;

        status.style.color="#ffd54a";
        status.textContent="Lendo ofertas.json...";

        const r = await fetch("./data/ofertas.json");
        const ofertas = await r.json();

        status.textContent=`Importando ${ofertas.length} jogos...`;

        let enviados=0;

        for(const jogo of ofertas){

            await salvarJogo({
                ...jogo,
                criadoEm:new Date().toISOString()
            });

            enviados++;

            status.textContent=
            `Importando ${enviados}/${ofertas.length}`;

        }

        status.style.color="#72ff91";
        status.textContent=
        `✅ ${enviados} jogos enviados ao Firebase!`;

    }catch(err){

        console.error(err);

        status.style.color="#ff6b6b";
        status.textContent="Erro ao importar.";

    }

    botao.disabled=false;

});