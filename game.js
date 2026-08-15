import { buscarJogos } from "./firebase.js";

// ======================================
// GAVIX V13.2 - GAME PAGE
// ======================================

const gameId = new URLSearchParams(window.location.search).get("id");

async function iniciar(){

    const jogos = await buscarJogos();

    const jogo = jogos.find(j => j.id === gameId);

    if(!jogo){

        document.body.innerHTML = `
        <div style="padding:40px;color:white;background:#0b1220;height:100vh;">
            <h1>Jogo não encontrado</h1>
            <a href="index.html" style="color:#6da8ff;">Voltar</a>
        </div>`;

        return;
    }

    document.title = "GAVIX | " + jogo.nome;

    renderHero(jogo);
    renderInfo(jogo);
    renderRelacionados(jogos, jogo);

}

function renderHero(jogo){

    const hero = document.getElementById("game-page");

    hero.innerHTML = `
    <section class="game-hero">

        <div class="game-cover">
            <img src="${jogo.imagem}" alt="${jogo.nome}">
        </div>

        <div class="game-content">

            <span class="game-badge">${jogo.loja}</span>

            <h1>${jogo.nome}</h1>

            <div style="color:#72ff91;font-weight:700;font-size:18px;">
                🔥 ${jogo.desconto}% OFF
            </div>

            <div class="game-price-old">
                R$ ${Number(jogo.preco_antigo).toFixed(2)}
            </div>

            <div class="game-price">
                R$ ${Number(jogo.preco).toFixed(2)}
            </div>

            <div class="game-save">
                Você economiza R$ ${(Number(jogo.preco_antigo)-Number(jogo.preco)).toFixed(2)}
            </div>

            <p style="margin:18px 0;color:#d6e2ff;">
                ${jogo.descricao || "Oferta disponível na " + jogo.loja}
            </p>

            <a class="buy-btn"
               href="${jogo.link}"
               target="_blank">

               COMPRAR AGORA →

            </a>

        </div>

    </section>`;
}

function renderInfo(jogo){

    document.getElementById("spec-plataforma").textContent = jogo.plataforma;
    document.getElementById("spec-loja").textContent = jogo.loja;
    document.getElementById("spec-desconto").textContent = jogo.desconto + "%";
    document.getElementById("spec-preco").textContent = "R$ " + Number(jogo.preco).toFixed(2);

    document.getElementById("descricao").textContent =
        jogo.descricao || "Sem descrição disponível.";

    ["g1","g2","g3","g4"].forEach(id=>{
        const img = document.getElementById(id);
        if(img) img.src = jogo.imagem;
    });

    const trailer = document.getElementById("trailer-frame");
    if(trailer){
        trailer.src = "https://www.youtube.com/embed/E3Huy2cdih0";
    }

    const tags = document.getElementById("tags");
    if(tags){
        tags.innerHTML = `
            <div class="tag-item">PC</div>
            <div class="tag-item">${jogo.loja}</div>
            <div class="tag-item">${jogo.desconto}% OFF</div>
        `;
    }

}

function renderRelacionados(jogos, atual){

    const grid = document.getElementById("rel-grid");

    if(!grid) return;

    grid.innerHTML = "";

    jogos
      .filter(j => j.id !== atual.id)
      .slice(0,4)
      .forEach(j=>{

        grid.innerHTML += `
        <div class="card">

            <img src="${j.imagem}" alt="${j.nome}">

            <div class="card-body">

                <span class="discount">
                    🔥 ${j.desconto}% OFF
                </span>

                <h3>${j.nome}</h3>

                <div class="price">
                    R$ ${Number(j.preco).toFixed(2)}
                </div>

                <a class="btn"
                   href="game.html?id=${j.id}">

                   VER JOGO

                </a>

            </div>

        </div>`;

      });

}

iniciar();