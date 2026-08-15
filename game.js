// ===========================================
// GAVIX V12 - GAME PAGE + ANALYTICS
// ===========================================

const id = Number(new URLSearchParams(location.search).get("id"));
let jogos = [];

const descricoes = [
  "Explore um universo cheio de ação, gráficos impressionantes e dezenas de horas de conteúdo.",
  "Enfrente desafios intensos em uma campanha envolvente com excelente jogabilidade.",
  "Um dos títulos mais populares dos últimos anos, ideal para quem procura aventura e desempenho.",
  "Descubra um mundo aberto rico em detalhes, missões e personagens inesquecíveis.",
  "Combates, exploração e uma experiência premium com ótimo custo-benefício."
];

const trailers = [
  "https://www.youtube.com/embed/E3Huy2cdih0",
  "https://www.youtube.com/embed/1Heta7s3GJI",
  "https://www.youtube.com/embed/QkkoHAzjnUs",
  "https://www.youtube.com/embed/F63h3v9QV7w",
  "https://www.youtube.com/embed/4WnO93TQkE0"
];

async function iniciar(){

    const r = await fetch("data/ofertas.json?" + Date.now());
    jogos = await r.json();

    const jogo = jogos[id];

    if(!jogo){
        document.body.innerHTML = "<h1>Jogo não encontrado</h1>";
        return;
    }

    document.title = "GAVIX | " + jogo.nome;

    hero(jogo);
    trailer();
    galeria(jogo);
    info(jogo);
    descricao(jogo);
    relacionados(jogo);

}

function hero(j){

    document.getElementById("game-page").innerHTML = `
    <section class="game-hero">

        <div class="game-cover">
            <img src="${j.imagem}">
        </div>

        <div class="game-content">

            <span class="game-badge">${j.loja}</span>

            <h1>${j.nome}</h1>

            <div style="color:#72ff91;font-weight:700;">
                🔥 ${j.desconto}% OFF
            </div>

            <div class="game-price-old">
                R$ ${Number(j.preco_antigo).toFixed(2)}
            </div>

            <div class="game-price">
                R$ ${Number(j.preco).toFixed(2)}
            </div>

            <div class="game-save">
                Você economiza R$ ${(j.preco_antigo-j.preco).toFixed(2)}
            </div>

            <button class="buy-btn" id="comprar-btn">
                COMPRAR AGORA →
            </button>

        </div>

    </section>`;

    document.getElementById("comprar-btn")
    .addEventListener("click",()=>{

        registrarClique();

        window.open(j.link,"_blank");

    });

}

function trailer(){

    document.getElementById("trailer-frame").src =
        trailers[id % trailers.length];

}

function galeria(j){

    ["g1","g2","g3","g4"].forEach(i=>{

        document.getElementById(i).src = j.imagem;

    });

}

function info(j){

    document.getElementById("spec-plataforma").textContent = j.plataforma;
    document.getElementById("spec-loja").textContent = j.loja;
    document.getElementById("spec-desconto").textContent = j.desconto + "%";
    document.getElementById("spec-preco").textContent =
        "R$ " + Number(j.preco).toFixed(2);

}

function descricao(j){

    document.getElementById("descricao").textContent =
        descricoes[id % descricoes.length] +
        " Aproveite esta promoção disponível na " + j.loja + ".";

}

function relacionados(atual){

    const grid = document.getElementById("rel-grid");
    grid.innerHTML = "";

    jogos
    .filter(j=>j.nome!==atual.nome)
    .slice(0,4)
    .forEach(j=>{

        grid.innerHTML += `
        <div class="card">

            <img src="${j.imagem}">

            <div class="card-body">

                <span class="discount">
                    🔥 ${j.desconto}% OFF
                </span>

                <h3>${j.nome}</h3>

                <div class="price">
                    R$ ${Number(j.preco).toFixed(2)}
                </div>

                <a class="btn"
                   href="game.html?id=${jogos.indexOf(j)}">

                   VER JOGO

                </a>

            </div>

        </div>`;

    });

}

iniciar();