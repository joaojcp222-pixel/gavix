// =======================================
// GAVIX V8 - GAME PAGE
// =======================================

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

let jogos = [];

const descricoes = [
"Explore um universo repleto de ação, gráficos impressionantes e dezenas de horas de conteúdo.",
"Enfrente desafios intensos em uma campanha envolvente com excelente jogabilidade.",
"Um dos títulos mais populares dos últimos anos, ideal para quem procura aventura e desempenho.",
"Descubra um mundo aberto rico em detalhes, missões e personagens inesquecíveis.",
"Combates, exploração e uma experiência premium com ótimo custo-benefício."
];

const trailers = [
"https://www.youtube.com/embed/E3Huy2cdih0",
"https://www.youtube.com/embed/1Heta7s3GJI",
"https://www.youtube.com/embed/4WnO93TQkE0",
"https://www.youtube.com/embed/QkkoHAzjnUs",
"https://www.youtube.com/embed/F63h3v9QV7w"
];

const tagsLista = [
["Ação","RPG","Mundo Aberto"],
["FPS","Multiplayer","Online"],
["Corrida","Simulação","Esportes"],
["Terror","Sobrevivência","Co-op"],
["Aventura","História","Single Player"]
];

async function iniciar(){

    const resposta = await fetch("data/ofertas.json?" + Date.now());

    jogos = await resposta.json();

    const jogo = jogos[id];

    if(!jogo){
        document.body.innerHTML =
        "<h1 style='padding:40px'>Jogo não encontrado.</h1>";
        return;
    }

    hero(jogo);
    galeria(jogo);
    info(jogo);
    descricao(jogo);
    score(jogo);
    tags(jogo);
    trailer(jogo);
    relacionados(jogo);

}

function hero(j){

    const economia = (j.preco_antigo-j.preco).toFixed(2);

    document.title = "GAVIX | " + j.nome;

    game_page.innerHTML = `

    <section class="game-hero">

        <div class="game-cover">
            <img src="${j.imagem}">
        </div>

        <div class="game-content">

            <span class="game-badge">${j.loja}</span>

            <h1>${j.nome}</h1>

            <div style="color:#6dff92;font-size:20px;font-weight:700">
                🔥 ${j.desconto}% OFF
            </div>

            <div class="game-price-old">
                R$ ${Number(j.preco_antigo).toFixed(2)}
            </div>

            <div class="game-price">
                R$ ${Number(j.preco).toFixed(2)}
            </div>

            <div class="game-save">
                Economize R$ ${economia}
            </div>

            <a
            class="buy-btn"
            href="${j.link}"
            target="_blank">

            COMPRAR AGORA →

            </a>

        </div>

    </section>

    `;

}

function galeria(j){

    g1.src=j.imagem;
    g2.src=j.imagem;
    g3.src=j.imagem;
    g4.src=j.imagem;

}

function info(j){

    spec_plataforma.textContent=j.plataforma;
    spec_loja.textContent=j.loja;
    spec_desconto.textContent=j.desconto+"%";
    spec_preco.textContent="R$ "+Number(j.preco).toFixed(2);

}

function descricao(j){

    descricao.textContent =
    descricoes[id%descricoes.length] +
    " Aproveite esta promoção disponível na " +
    j.loja + ".";

}

function score(){

    const nota = 88 + (id%11);

    score.textContent = nota;

    if(nota>=95)
        avaliacao.textContent="Extremamente Positivo";
    else if(nota>=90)
        avaliacao.textContent="Muito Positivo";
    else
        avaliacao.textContent="Positivo";

}

function tags(){

    tags.innerHTML="";

    tagsLista[id%tagsLista.length].forEach(t=>{

        tags.innerHTML += `
        <div class="tag-item">${t}</div>
        `;

    });

}

function trailer(){

    trailer_frame.src =
    trailers[id%trailers.length];

}

function relacionados(atual){

    rel_grid.innerHTML="";

    jogos
    .filter(j=>j.nome!==atual.nome)
    .sort(()=>Math.random()-0.5)
    .slice(0,4)
    .forEach(j=>{

        rel_grid.innerHTML += `

        <div class="card">

            <img src="${j.imagem}">

            <div class="card-body">

                <span class="discount">
                    ${j.desconto}% OFF
                </span>

                <h3>${j.nome}</h3>

                <div class="price">
                    R$ ${Number(j.preco).toFixed(2)}
                </div>

                <a
                class="btn"
                href="game.html?id=${jogos.indexOf(j)}">

                VER JOGO

                </a>

            </div>

        </div>

        `;

    });

}

iniciar();