// ===========================================
// GAVIX V10 - SCRIPT DEFINITIVO
// ===========================================

let jogos = [];
let jogosFiltrados = [];
let destaque = [];
let indiceCarousel = 0;

async function iniciar(){

    const resposta = await fetch("data/ofertas.json?" + Date.now());
    jogos = await resposta.json();

    jogosFiltrados = [...jogos];

    preencherLojas();

    destaque = [...jogos]
        .sort((a,b)=>b.desconto-a.desconto)
        .slice(0,5);

    atualizarCarousel();
    setInterval(proximoSlide,5000);

    atualizarTop10();
    renderizar(jogosFiltrados);

}

iniciar();

// =========================
// CARROSSEL
// =========================

function atualizarCarousel(){

    const j = destaque[indiceCarousel];

    document.getElementById("carousel-img").src = j.imagem;
    document.getElementById("carousel-title").textContent = j.nome;
    document.getElementById("carousel-desc").textContent =
        `${j.desconto}% OFF • ${j.loja}`;

    document.getElementById("carousel-price").textContent =
        `R$ ${Number(j.preco).toFixed(2)}`;

    document.getElementById("carousel-btn").href =
        `game.html?id=${jogos.indexOf(j)}`;

}

function proximoSlide(){

    indiceCarousel++;

    if(indiceCarousel>=destaque.length)
        indiceCarousel=0;

    atualizarCarousel();

}

// =========================
// TOP10
// =========================

function atualizarTop10(){

    const lista = document.getElementById("top10-lista");

    lista.innerHTML="";

    [...jogos]
        .sort((a,b)=>b.desconto-a.desconto)
        .slice(0,10)
        .forEach((j,i)=>{

            lista.innerHTML += `
            <div class="top-item">

                <div class="top-rank">
                    ${i+1}
                </div>

                <img src="${j.imagem}">

                <div class="top-info">
                    <strong>${j.nome}</strong><br>
                    ${j.desconto}% OFF
                </div>

                <div class="top-price">
                    R$ ${Number(j.preco).toFixed(2)}
                </div>

            </div>`;
        });

}

// =========================
// LOJAS
// =========================

function preencherLojas(){

    const select = document.getElementById("filtro-loja");

    const lojas = [...new Set(jogos.map(j=>j.loja))].sort();

    lojas.forEach(loja=>{

        select.innerHTML += `
        <option value="${loja}">
            ${loja}
        </option>`;

    });

}

// =========================
// CARD
// =========================

function criarCard(j){

    return `
    <div class="card">

        <img src="${j.imagem}" alt="${j.nome}">

        <div class="card-body">

            <span class="discount">
                🔥 ${j.desconto}% OFF
            </span>

            <h3>${j.nome}</h3>

            <div class="old">
                R$ ${Number(j.preco_antigo).toFixed(2)}
            </div>

            <div class="price">
                R$ ${Number(j.preco).toFixed(2)}
            </div>

            <div class="store">
                🏪 ${j.loja}
            </div>

            <a class="btn"
               href="game.html?id=${jogos.indexOf(j)}">

               VER OFERTA

            </a>

        </div>

    </div>`;
}

// =========================
// GRID
// =========================

function renderizar(lista){

    document.getElementById("contador-ofertas").textContent =
        `${lista.length} ofertas`;

    const grid = document.getElementById("lista-ofertas");

    grid.innerHTML="";

    lista.forEach(j=>{

        grid.innerHTML += criarCard(j);

    });

}

// =========================
// FILTROS
// =========================

document.getElementById("campo-pesquisa")
.addEventListener("input", aplicarFiltros);

document.getElementById("campo-pesquisa-topo")
.addEventListener("input", e=>{

    document.getElementById("campo-pesquisa").value = e.target.value;

    aplicarFiltros();

});

document.getElementById("filtro-loja")
.addEventListener("change", aplicarFiltros);

document.getElementById("ordenacao")
.addEventListener("change", aplicarFiltros);

function aplicarFiltros(){

    const texto =
        document.getElementById("campo-pesquisa")
        .value.toLowerCase();

    const loja =
        document.getElementById("filtro-loja").value;

    const ordem =
        document.getElementById("ordenacao").value;

    jogosFiltrados = jogos.filter(j=>{

        const nome =
            j.nome.toLowerCase().includes(texto);

        const okLoja =
            loja==="todas" || j.loja===loja;

        return nome && okLoja;

    });

    if(ordem==="desconto")
        jogosFiltrados.sort((a,b)=>b.desconto-a.desconto);

    if(ordem==="menor-preco")
        jogosFiltrados.sort((a,b)=>a.preco-b.preco);

    if(ordem==="maior-preco")
        jogosFiltrados.sort((a,b)=>b.preco-a.preco);

    if(ordem==="nome")
        jogosFiltrados.sort((a,b)=>a.nome.localeCompare(b.nome));

    renderizar(jogosFiltrados);

}

// =========================
// CATEGORIAS
// =========================

document.querySelectorAll(".cat").forEach(botao=>{

    botao.addEventListener("click",()=>{

        document.querySelectorAll(".cat")
            .forEach(b=>b.classList.remove("active"));

        botao.classList.add("active");

        const categoria = botao.dataset.cat;

        if(categoria==="Todos"){

            jogosFiltrados=[...jogos];

        }else{

            jogosFiltrados=jogos.filter(j=>{

                const nome=j.nome.toLowerCase();

                if(categoria==="RPG")
                    return nome.includes("rpg")||nome.includes("elder");

                if(categoria==="FPS")
                    return nome.includes("call")||nome.includes("battlefield");

                if(categoria==="Corrida")
                    return nome.includes("forza")||nome.includes("need");

                if(categoria==="Terror")
                    return nome.includes("resident")||nome.includes("evil");

                return true;

            });

        }

        renderizar(jogosFiltrados);

    });

});