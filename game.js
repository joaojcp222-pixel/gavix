// =====================================
// GAVIX V6 - PÁGINA DO JOGO
// =====================================

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

let jogos = [];

const descricoes = [
"Explore um mundo incrível repleto de ação, desafios e gráficos impressionantes.",
"Enfrente inimigos poderosos e evolua seu personagem durante uma grande aventura.",
"Corra em alta velocidade com veículos detalhados e física realista.",
"Viva uma campanha envolvente e aproveite modos online cheios de adrenalina.",
"Um dos jogos mais populares da atualidade com excelente custo-benefício."
];

async function iniciar(){

    const resposta = await fetch("data/ofertas.json?" + Date.now());

    jogos = await resposta.json();

    const jogo = jogos[id];

    if(!jogo){
        document.body.innerHTML = `
        <div style="padding:40px;color:white;background:#0b0d12;height:100vh">
            <h1>Jogo não encontrado</h1>
            <a href="index.html" style="color:#4f8cff">Voltar ao GAVIX</a>
        </div>`;
        return;
    }

    renderizarHero(jogo);
    renderizarGaleria(jogo);
    renderizarDescricao(jogo);
    renderizarRelacionados(jogo);

}

function renderizarHero(j){

    const economia = (j.preco_antigo - j.preco).toFixed(2);

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

            <p><strong>Plataforma:</strong> ${j.plataforma}</p>

            <a class="game-botao"
               href="${j.link}"
               target="_blank">
                COMPRAR AGORA →
            </a>

        </div>

    </section>
    `;

}

function renderizarGaleria(j){

    document.getElementById("galeria1").src = j.imagem;
    document.getElementById("galeria2").src = j.imagem;
    document.getElementById("galeria3").src = j.imagem;
    document.getElementById("galeria4").src = j.imagem;

}

function renderizarDescricao(j){

    const texto =
    descricoes[id % descricoes.length];

    document.getElementById("descricao-jogo").textContent =
    `${texto} Aproveite esta oferta na ${j.loja} com ${j.desconto}% de desconto.`;

}

function renderizarRelacionados(atual){

    const grid =
    document.getElementById("jogos-relacionados");

    grid.innerHTML = "";

    const lista = jogos
    .filter(j => j.nome !== atual.nome)
    .sort(() => Math.random() - 0.5)
    .slice(0,4);

    lista.forEach(j=>{

        const indice = jogos.indexOf(j);

        grid.innerHTML += `

        <div class="card">

            <img src="${j.imagem}" alt="${j.nome}">

            <div class="card-content">

                <div class="desconto">
                    🔥 ${j.desconto}% OFF
                </div>

                <h3>${j.nome}</h3>

                <div class="preco">
                    R$ ${Number(j.preco).toFixed(2)}
                </div>

                <a class="botao"
                   href="game.html?id=${indice}">
                   VER JOGO
                </a>

            </div>

        </div>

        `;

    });

}

iniciar();