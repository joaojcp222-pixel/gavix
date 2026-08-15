// =======================================
// GAVIX V8 - GAME PAGE DEFINITIVO
// =======================================

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

const categorias = [
  ["Ação","RPG","Mundo Aberto"],
  ["FPS","Multiplayer","Online"],
  ["Corrida","Simulação","Esportes"],
  ["Terror","Sobrevivência","Co-op"],
  ["Aventura","História","Single Player"]
];

async function carregar(){

  const resposta = await fetch("data/ofertas.json?" + Date.now());
  jogos = await resposta.json();

  const jogo = jogos[id];

  if(!jogo){
    document.body.innerHTML = `
      <div style="padding:40px">
        <h1>Jogo não encontrado</h1>
        <a href="index.html">Voltar</a>
      </div>`;
    return;
  }

  document.title = "GAVIX | " + jogo.nome;

  renderHero(jogo);
  renderTrailer();
  renderGaleria(jogo);
  renderInfo(jogo);
  renderDescricao(jogo);
  renderScore();
  renderTags();
  renderRelacionados(jogo);
}

function renderHero(j){

  const economia = (j.preco_antigo - j.preco).toFixed(2);

  document.getElementById("game-page").innerHTML = `
    <section class="game-hero">

      <div class="game-cover">
        <img src="${j.imagem}" alt="${j.nome}">
      </div>

      <div class="game-content">

        <span class="game-badge">${j.loja}</span>

        <h1>${j.nome}</h1>

        <div style="color:#72ff91;font-weight:700;font-size:18px;">
          🔥 ${j.desconto}% OFF
        </div>

        <div class="game-price-old">
          R$ ${Number(j.preco_antigo).toFixed(2)}
        </div>

        <div class="game-price">
          R$ ${Number(j.preco).toFixed(2)}
        </div>

        <div class="game-save">
          Você economiza R$ ${economia}
        </div>

        <a class="buy-btn"
           href="${j.link}"
           target="_blank">
          COMPRAR AGORA →
        </a>

      </div>

    </section>
  `;
}

function renderTrailer(){
  document.getElementById("trailer-frame").src =
    trailers[id % trailers.length];
}

function renderGaleria(j){

  ["g1","g2","g3","g4"].forEach(el=>{
    document.getElementById(el).src = j.imagem;
  });

}

function renderInfo(j){

  document.getElementById("spec-plataforma").textContent = j.plataforma;
  document.getElementById("spec-loja").textContent = j.loja;
  document.getElementById("spec-desconto").textContent = j.desconto + "%";
  document.getElementById("spec-preco").textContent =
    "R$ " + Number(j.preco).toFixed(2);

}

function renderDescricao(j){

  document.getElementById("descricao").textContent =
    descricoes[id % descricoes.length] +
    " Aproveite esta promoção disponível na " + j.loja + ".";

}

function renderScore(){

  const nota = 88 + (id % 11);

  document.getElementById("score").textContent = nota;

  document.getElementById("avaliacao").textContent =
    nota >= 95 ? "Extremamente Positivo" :
    nota >= 90 ? "Muito Positivo" : "Positivo";

}

function renderTags(){

  const box = document.getElementById("tags");

  box.innerHTML = "";

  categorias[id % categorias.length].forEach(tag=>{

    box.innerHTML += `
      <div class="tag-item">${tag}</div>
    `;

  });

}

function renderRelacionados(atual){

  const grid = document.getElementById("rel-grid");

  grid.innerHTML = "";

  jogos
    .filter(j=>j.nome!==atual.nome)
    .sort(()=>Math.random()-0.5)
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
             href="game.html?id=${jogos.indexOf(j)}">
             VER JOGO
          </a>

        </div>

      </div>`;
    });

}

carregar();