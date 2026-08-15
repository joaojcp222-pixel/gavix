// ===============================
// GAVIX - GAME PAGE
// ===============================

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

let jogos = [];

async function carregar(){

    const r = await fetch("data/ofertas.json?" + Date.now());

    jogos = await r.json();

    const jogo = jogos[id];

    if(!jogo){
        document.getElementById("game-page").innerHTML =
        "<h1>Jogo não encontrado.</h1>";
        return;
    }

    renderizarJogo(jogo);

    renderizarRelacionados(id);

}

function renderizarJogo(jogo){

    const economia =
    (jogo.preco_antigo - jogo.preco).toFixed(2);

    document.title = `GAVIX | ${jogo.nome}`;

    document.getElementById("game-page").innerHTML = `

    <section class="game-hero">

        <img
        class="game-capa"
        src="${jogo.imagem}">

        <div class="game-info">

            <span class="game-tag">
                ${jogo.loja}
            </span>

            <h1>${jogo.nome}</h1>

            <div class="game-desconto">
                🔥 ${jogo.desconto}% OFF
            </div>

            <div class="game-preco-antigo">
                R$ ${Number(jogo.preco_antigo).toFixed(2)}
            </div>

            <div class="game-preco">
                R$ ${Number(jogo.preco).toFixed(2)}
            </div>

            <div class="game-economia">
                Você economiza R$ ${economia}
            </div>

            <a
            class="game-botao"
           href="game.html?id=${todasAsOfertas.indexOf(jogo)}"
            target="_blank">

            COMPRAR AGORA →

            </a>

        </div>

    </section>

    `;

}

function renderizarRelacionados(idAtual){

    const grid =
    document.getElementById("jogos-relacionados");

    grid.innerHTML = "";

    const relacionados =
    jogos
    .filter((_,i)=>i!==idAtual)
    .sort(()=>Math.random()-0.5)
    .slice(0,4);

    relacionados.forEach((jogo,index)=>{

        const realId =
        jogos.indexOf(jogo);

        grid.innerHTML += `

        <div class="card">

            <img src="${jogo.imagem}">

            <div class="card-content">

                <div class="desconto">
                    🔥 ${jogo.desconto}% OFF
                </div>

                <h3>${jogo.nome}</h3>

                <div class="preco">
                    R$ ${Number(jogo.preco).toFixed(2)}
                </div>

                <a
                class="botao"
                href="game.html?id=${realId}">

                VER JOGO

                </a>

            </div>

        </div>

        `;

    });

}

carregar();