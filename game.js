// ===========================
// GAVIX - PÁGINA DO JOGO
// ===========================

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

let jogos = [];

async function iniciar(){

    const r = await fetch("data/ofertas.json?" + Date.now());

    jogos = await r.json();

    const jogo = jogos[id];

    if(!jogo){
        document.body.innerHTML = `
        <div style="padding:40px;color:white;background:#0b0d12;height:100vh">
            <h1>Jogo não encontrado</h1>
            <a href="index.html" style="color:#4f8cff">
                Voltar ao GAVIX
            </a>
        </div>`;
        return;
    }

    renderizar(jogo);
    relacionados(jogo);

}

function renderizar(j){

    const economia =
    (j.preco_antigo - j.preco).toFixed(2);

    document.title = `GAVIX | ${j.nome}`;

    document.getElementById("game-page").innerHTML = `

    <section class="game-hero">

        <img class="game-capa" src="${j.imagem}" alt="${j.nome}">

        <div class="game-info">

            <span class="game-tag">${j.loja}</span>

            <h1>${j.nome}</h1>

            <div class="game-desconto">
                🔥 ${j.desconto}% OFF
            </div>

            <div class="game-preco-antigo">
                R$ ${Number(j.preco_antigo).toFixed(2)}
            </div>

            <div class="game-preco">
                R$ ${Number(j.preco).toFixed(2)}
            </div>

            <div class="game-economia">
                Você economiza R$ ${economia}
            </div>

            <p>
                Plataforma: <strong>${j.plataforma}</strong>
            </p>

            <a
            class="game-botao"
            href="${j.link}"
            target="_blank">

            COMPRAR AGORA →

            </a>

        </div>

    </section>

    `;

}

function relacionados(jogoAtual){

    const grid =
    document.getElementById("jogos-relacionados");

    grid.innerHTML = "";

    const lista = jogos
    .filter(j=>j.nome!==jogoAtual.nome)
    .sort(()=>Math.random()-0.5)
    .slice(0,4);

    lista.forEach(j=>{

        const indice = jogos.indexOf(j);

        grid.innerHTML += `

        <div class="card">

            <img src="${j.imagem}">

            <div class="card-content">

                <div class="desconto">
                    🔥 ${j.desconto}% OFF
                </div>

                <h3>${j.nome}</h3>

                <div class="preco">
                    R$ ${Number(j.preco).toFixed(2)}
                </div>

                <a
                class="botao"
                href="game.html?id=${indice}">

                VER JOGO

                </a>

            </div>

        </div>

        `;

    });

}

iniciar();