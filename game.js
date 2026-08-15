// =======================================
// GAVIX V7 - PÁGINA DO JOGO
// =======================================

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

let jogos = [];

const descricoes = [
"Explore um universo cheio de ação, gráficos incríveis e uma campanha envolvente. Ideal para quem procura dezenas de horas de diversão.",
"Viva batalhas intensas, evolução de personagem e um mundo rico em detalhes. Uma excelente escolha para fãs de aventura.",
"Entre em corridas, combates e desafios com jogabilidade moderna e ótima otimização para PC.",
"Uma experiência imersiva com trilha sonora marcante, personagens memoráveis e excelente custo-benefício.",
"Um dos títulos mais populares dos últimos anos, perfeito para aproveitar com um grande desconto."
];

async function iniciar(){

    const resposta = await fetch("data/ofertas.json?" + Date.now());
    jogos = await resposta.json();

    const jogo = jogos[id];

    if(!jogo){
        document.body.innerHTML = `
        <div style="padding:40px;color:white">
            <h1>Jogo não encontrado</h1>
            <a href="index.html" style="color:#4f8cff">Voltar ao Gavix</a>
        </div>`;
        return;
    }

    renderizarHero(jogo);
    renderizarGaleria(jogo);
    renderizarInfo(jogo);
    renderizarDescricao(jogo);
    renderizarRelacionados(jogo);

}

function renderizarHero(j){

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

            <div style="color:#72ff91;font-size:20px;font-weight:700;">
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

function renderizarGaleria(j){

    g1.src = j.imagem;
    g2.src = j.imagem;
    g3.src = j.imagem;
    g4.src = j.imagem;

}

function renderizarInfo(j){

    spec_plataforma.textContent = j.plataforma;
    spec_loja.textContent = j.loja;
    spec_desconto.textContent = j.desconto + "%";
    spec_preco.textContent = "R$ " + Number(j.preco).toFixed(2);

}

function renderizarDescricao(j){

    const texto = descricoes[id % descricoes.length];

    descricao.textContent =
    `${texto} Disponível na ${j.loja} com ${j.desconto}% de desconto. Aproveite esta oferta enquanto ela estiver ativa.`;

}

function renderizarRelacionados(atual){

    rel_grid.innerHTML = "";

    const lista = jogos
    .filter(x => x.nome !== atual.nome)
    .sort(() => Math.random() - 0.5)
    .slice(0,4);

    lista.forEach(j=>{

        const indice = jogos.indexOf(j);

        rel_grid.innerHTML += `

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
                   href="game.html?id=${indice}">

                   VER JOGO

                </a>

            </div>

        </div>

        `;

    });

}

iniciar();