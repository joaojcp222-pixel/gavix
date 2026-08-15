
let jogos = [];

// =============================
// INICIAR
// =============================

async function iniciar(){

    const ofertas = await fetch("data/ofertas.json?" + Date.now());
    jogos = await ofertas.json();

    const status = await fetch("data/status.json?" + Date.now());
    const info = await status.json();

    document.getElementById("status-gavix").textContent =
        `${info.quantidade_ofertas} jogos • Atualizado em ${info.ultima_atualizacao}`;

    preencherLojas();
    atualizarBanner();
    atualizarTop10();
    renderizar(jogos);
}

iniciar();

// =============================
// BANNER
// =============================

function atualizarBanner(){

    const destaque = [...jogos]
        .sort((a,b)=>b.desconto-a.desconto)[0];

    document.getElementById("banner-imagem").src = destaque.imagem;
    document.getElementById("banner-titulo").textContent = destaque.nome;
    document.getElementById("banner-descricao").textContent =
        `${destaque.desconto}% OFF • ${destaque.loja}`;

    document.getElementById("banner-preco").textContent =
        `R$ ${Number(destaque.preco).toFixed(2)}`;

    document.getElementById("banner-botao").href =
        `game.html?id=${jogos.indexOf(destaque)}`;
}

// =============================
// TOP 10
// =============================

function atualizarTop10(){

    const lista = document.getElementById("top10-lista");
    lista.innerHTML = "";

    [...jogos]
        .sort((a,b)=>b.desconto-a.desconto)
        .slice(0,10)
        .forEach((j,i)=>{

            const medalhas=["🥇","🥈","🥉"];

            lista.innerHTML += `
            <div class="top-item">

                <div class="top-rank">
                    ${medalhas[i] || "#" + (i+1)}
                </div>

                <img src="${j.imagem}">

                <div class="top-info">
                    <strong>${j.nome}</strong><br>
                    ${j.desconto}% OFF
                </div>

                <div class="top-price">
                    R$ ${Number(j.preco).toFixed(2)}
                </div>

            </div>
            `;
        });
}

// =============================
// LOJAS
// =============================

function preencherLojas(){

    const select = document.getElementById("filtro-loja");
    const grid = document.getElementById("lista-lojas");

    const lojas = [...new Set(jogos.map(j=>j.loja))].sort();

    lojas.forEach(loja=>{

        select.innerHTML += `<option value="${loja}">${loja}</option>`;

        grid.innerHTML += `
        <div class="store-box">
            <div style="font-size:40px">🏪</div>
            <h3>${loja}</h3>
        </div>`;
    });
}

// =============================
// CARD
// =============================

function criarCard(j){

    const id = jogos.indexOf(j);

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

            <a class="btn" href="game.html?id=${id}">
                VER OFERTA
            </a>

        </div>

    </div>`;
}

// =============================
// RENDER
// =============================

function renderizar(lista){

    const grid = document.getElementById("lista-ofertas");

    document.getElementById("contador-ofertas").textContent =
        `${lista.length} ofertas encontradas`;

    grid.innerHTML = "";

    lista.forEach(j=> grid.innerHTML += criarCard(j));
}

// =============================
// FILTROS
// =============================

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

    let lista = jogos.filter(j=>{

        const okNome =
            j.nome.toLowerCase().includes(texto);

        const okLoja =
            loja==="todas" || j.loja===loja;

        return okNome && okLoja;
    });

    if(ordem==="desconto")
        lista.sort((a,b)=>b.desconto-a.desconto);

    if(ordem==="menor-preco")
        lista.sort((a,b)=>a.preco-b.preco);

    if(ordem==="maior-preco")
        lista.sort((a,b)=>b.preco-a.preco);

    if(ordem==="nome")
        lista.sort((a,b)=>a.nome.localeCompare(b.nome));

    renderizar(lista);
}