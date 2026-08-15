let jogos = [];
let favoritos = JSON.parse(localStorage.getItem("gavix_favoritos") || "[]");

// =======================
// CARREGAR DADOS
// =======================

async function iniciar(){

    const ofertas = await fetch("data/ofertas.json?" + Date.now());
    jogos = await ofertas.json();

    const status = await fetch("data/status.json?" + Date.now());
    const info = await status.json();

    document.getElementById("status-gavix").textContent =
        `🟢 ${info.quantidade_ofertas} jogos • Atualizado em ${info.ultima_atualizacao}`;

    preencherLojas();
    atualizarBanner();
    atualizarTop10();
    renderizar(jogos);

}

iniciar();

// =======================
// FAVORITOS
// =======================

function favorito(nome){
    return favoritos.includes(nome);
}

function alternarFavorito(nome){

    if(favorito(nome)){
        favoritos = favoritos.filter(x=>x!==nome);
    }else{
        favoritos.push(nome);
    }

    localStorage.setItem(
        "gavix_favoritos",
        JSON.stringify(favoritos)
    );

    renderizar(jogos);

}

// =======================
// BANNER
// =======================

function atualizarBanner(){

    const destaque = [...jogos]
        .sort((a,b)=>b.desconto-a.desconto)[0];

    document.getElementById("banner-imagem").src = destaque.imagem;

    document.getElementById("banner-titulo").textContent = destaque.nome;

    document.getElementById("banner-descricao").textContent =
        `${destaque.desconto}% OFF • ${destaque.loja}`;

    document.getElementById("banner-botao").href =
        `game.html?id=${jogos.indexOf(destaque)}`;

}

// =======================
// TOP 10
// =======================

function atualizarTop10(){

    const lista = document.getElementById("top10-lista");

    lista.innerHTML = "";

    [...jogos]
        .sort((a,b)=>b.desconto-a.desconto)
        .slice(0,10)
        .forEach((jogo,i)=>{

            let medalha = "";

            if(i===0) medalha="🥇";
            else if(i===1) medalha="🥈";
            else if(i===2) medalha="🥉";
            else medalha=`#${i+1}`;

            lista.innerHTML += `
            <div class="top10-card">

                <div class="rank">${medalha}</div>

                <img
                    class="top10-img"
                    src="${jogo.imagem}">

                <div class="top10-info">

                    <h3>${jogo.nome}</h3>

                    <div class="top10-desconto">
                        ${jogo.desconto}% OFF
                    </div>

                </div>

                <div class="top10-preco">
                    R$ ${Number(jogo.preco).toFixed(2)}
                </div>

            </div>
            `;

        });

}

// =======================
// LOJAS
// =======================

function preencherLojas(){

    const select = document.getElementById("filtro-loja");

    const lojas = [...new Set(jogos.map(j=>j.loja))].sort();

    lojas.forEach(loja=>{

        select.innerHTML +=
            `<option value="${loja}">${loja}</option>`;

    });

}

// =======================
// CARD
// =======================

function card(jogo){

    const id = jogos.indexOf(jogo);

    const coracao = favorito(jogo.nome) ? "❤️" : "🤍";

    return `
    <div class="card">

        <div
            class="favorito"
            onclick="alternarFavorito('${jogo.nome.replace(/'/g,"\\'")}')">

            ${coracao}

        </div>

        <img src="${jogo.imagem}">

        <div class="card-content">

            <div class="desconto">
                🔥 ${jogo.desconto}% OFF
            </div>

            <h3>${jogo.nome}</h3>

            <div class="preco-antigo">
                R$ ${Number(jogo.preco_antigo).toFixed(2)}
            </div>

            <div class="preco">
                R$ ${Number(jogo.preco).toFixed(2)}
            </div>

            <div class="economia">
                Economize R$ ${(jogo.preco_antigo-jogo.preco).toFixed(2)}
            </div>

            <div class="loja">
                🏪 ${jogo.loja}
            </div>

            <div class="plataforma">
                🎮 ${jogo.plataforma}
            </div>

            <a
                class="botao"
                href="game.html?id=${id}">

                VER OFERTA →

            </a>

        </div>

    </div>
    `;

}

// =======================
// RENDER
// =======================

function renderizar(lista){

    const grid = document.getElementById("lista-ofertas");

    document.getElementById("contador-ofertas").textContent =
        `${lista.length} ofertas`;

    grid.innerHTML = "";

    lista.forEach(j=>{

        grid.innerHTML += card(j);

    });

}

// =======================
// FILTROS
// =======================

document.getElementById("campo-pesquisa")
.addEventListener("input", aplicarFiltros);

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

        const nome =
            j.nome.toLowerCase().includes(texto);

        const okLoja =
            loja==="todas" || j.loja===loja;

        return nome && okLoja;

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