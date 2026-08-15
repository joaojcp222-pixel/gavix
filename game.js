// =====================================
// GAVIX V8 - GAME PAGE (CORRIGIDO)
// =====================================

const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));

let jogos = [];

const descricoes = [
  "Explore um universo repleto de ação, gráficos impressionantes e dezenas de horas de conteúdo.",
  "Enfrente desafios intensos em uma campanha envolvente com excelente jogabilidade.",
  "Um dos títulos mais populares dos últimos anos, ideal para quem procura aventura e desempenho.",
  "Descubra um mundo aberto rico em detalhes, missões e personagens inesquecíveis.",
  "Combates, exploração e uma experiência premium com ótimo custo-benefício."
];

const tagsLista = [
  ["Ação","RPG","Mundo Aberto"],
  ["FPS","Multiplayer","Online"],
  ["Corrida","Simulação","Esportes"],
  ["Terror","Sobrevivência","Co-op"],
  ["Aventura","História","Single Player"]
];

async function iniciar(){

  const r = await fetch("data/ofertas.json?" + Date.now());
  jogos = await r.json();

  const jogo = jogos[id];

  if(!jogo){
    document.body.innerHTML = "<h1 style='padding:40px'>Jogo não encontrado</h1>";
    return;
  }

  hero(jogo);
  galeria(jogo);
  info(jogo);
  descricao(jogo);
  tags(jogo);
  score();
  relacionados(jogo);

}

function hero(j){

  const economia = (j.preco_antigo - j.preco).toFixed(2);

  document.title = "GAVIX | " + j.nome;

  document.getElementById("game-page").innerHTML = `
    <section class="game-hero">

      <div class="game-cover">
        <img src="${j.imagem}" alt="${j.nome}">
      </div>

      <div class="game-content">

        <span class="game-badge">${j.loja}</span>

        <h1>${j.nome}</h1>

        <div style="color:#6dff92;font-size:20px;font-weight:700;">
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

        <a class="buy-btn" href="${j.link}" target="_blank">
          COMPRAR AGORA →
        </a>

      </div>

    </section>
  `;

}

function galeria(j){

  document.getElementById("g1").src = j.imagem;
  document.getElementById("g2").src = j.imagem;
  document.getElementById("g3").src = j.imagem;
  document.getElementById("g4").src = j.imagem;

}

function info(j){

  document.getElementById("spec-plataforma").textContent = j.plataforma;
  document.getElementById("spec-loja").textContent = j.loja;
  document.getElementById("spec-desconto").textContent = j.desconto + "%";
  document.getElementById("spec-preco").textContent = "R$ " + Number(j.preco).toFixed(2);

}

function descricao(j){

  document.getElementById("descricao").textContent =
    descricoes[id % descricoes.length] +
    " Aproveite esta promoção disponível na " +
    j.loja + ".";

}

function tags(){

  const el = document.getElementById("tags");
  el.innerHTML = "";

  tagsLista[id % tagsLista.length].forEach(tag=>{

    el.innerHTML += `<div class="tag-item">${tag}</div>`;

  });

}

function score(){

  const nota = 88 + (id % 11);

  document.getElementById("score").textContent = nota;

  document.getElementById("avaliacao").textContent =
    nota >= 95 ? "Extremamente Positivo" :
    nota >= 90 ? "Muito Positivo" : "Positivo";

}

function relacionados(atual){

  const grid = document.getElementById("rel-grid");
  grid.innerHTML = "";

  jogos
    .filter(j=>j.nome!==atual.nome)
    .sort(()=>Math.random()-0.5)
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

            <a class="btn" href="game.html?id=${jogos.indexOf(j)}">
              VER JOGO
            </a>

          </div>

        </div>
      `;

    });

}

iniciar();