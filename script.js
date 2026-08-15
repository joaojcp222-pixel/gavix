let todasAsOfertas = [];
let favoritos = JSON.parse(localStorage.getItem("gavix_favoritos") || "[]");

// ===============================
// FAVORITOS
// ===============================

function favoritado(nome){
    return favoritos.includes(nome);
}

function alternarFavorito(nome){

    if(favoritado(nome)){
        favoritos = favoritos.filter(j => j !== nome);
    }else{
        favoritos.push(nome);
    }

    localStorage.setItem(
        "gavix_favoritos",
        JSON.stringify(favoritos)
    );

    mostrarImperdiveis();
    filtrarOfertas();
}

// ===============================
// CARREGAR DADOS
// ===============================

async function carregarOfertas(){

    const r = await fetch("data/ofertas.json?" + Date.now());

    todasAsOfertas = await r.json();
mostrarBanner();

mostrarImperdiveis();

mostrarTop10();

carregarLojas();
    criarCardsDeLojas();

    filtrarOfertas();
}

async function carregarStatus(){

    const r = await fetch("data/status.json?" + Date.now());

    const status = await r.json();

    document.getElementById("status-gavix").innerHTML =
        `🟢 ${status.quantidade_ofertas} jogos • Atualizado em ${status.ultima_atualizacao}`;
}

// ===============================
// BANNER
// ===============================

let bannerIndex = 0;

function mostrarBanner(){

    const destaques = [...todasAsOfertas]
    .sort((a,b)=>b.desconto-a.desconto)
    .slice(0,5);

    atualizarBanner(destaques);

    setInterval(()=>{

        bannerIndex++;

        if(bannerIndex >= destaques.length){
            bannerIndex = 0;
        }

        atualizarBanner(destaques);

    },5000);

}

function atualizarBanner(lista){

    const jogo = lista[bannerIndex];

    document.getElementById("banner-titulo").textContent = jogo.nome;

    document.getElementById("banner-descricao").textContent =
        `${jogo.desconto}% OFF • ${jogo.loja}`;

    document.getElementById("banner-imagem").src = jogo.imagem;

    document.getElementById("banner-botao").href = jogo.link;
}

// ===============================
// IMPERDÍVEIS
// ===============================

function mostrarImperdiveis(){

    const grid = document.getElementById("lista-imperdiveis");

    grid.innerHTML = "";

    [...todasAsOfertas]
    .sort((a,b)=>b.desconto-a.desconto)
    .slice(0,4)
    .forEach(jogo=>{

        grid.innerHTML += criarCard(jogo);

    });

}

// ===============================
// CARD
// ===============================

function criarCard(jogo){

    const coracao = favoritado(jogo.nome) ? "❤️" : "🤍";

    return `
<div class="card">

<div class="favorito"
onclick="alternarFavorito('${jogo.nome.replace(/'/g,"\\\\'")}')">
${coracao}
</div>

<img src="${jogo.imagem}" alt="${jogo.nome}">

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

<a class="botao"
href="${jogo.link}"
target="_blank">

VER OFERTA →

</a>

</div>

</div>
`;

}

// ===============================
// LOJAS
// ===============================

function carregarLojas(){

    const select = document.getElementById("filtro-loja");

    select.innerHTML =
        `<option value="todas">Todas as lojas</option>`;

    const lojas = [...new Set(todasAsOfertas.map(j=>j.loja))].sort();

    lojas.forEach(loja=>{

        select.innerHTML +=
            `<option value="${loja}">${loja}</option>`;

    });

}

function criarCardsDeLojas(){

    const container = document.getElementById("lista-lojas");

    container.innerHTML = "";

    const mapa = {};

    todasAsOfertas.forEach(j=>{

        mapa[j.loja] = (mapa[j.loja] || 0) + 1;

    });

    Object.keys(mapa)
    .sort()
    .forEach(loja=>{

        container.innerHTML += `
<div class="store-card"
onclick="filtrarLoja('${loja}')">

<div class="store-icon">
🏪
</div>

<div class="store-info">

<strong>${loja}</strong>

<small>${mapa[loja]} ofertas</small>

</div>

</div>
`;

    });

}

function filtrarLoja(loja){

    document.getElementById("filtro-loja").value = loja;

    filtrarOfertas();

    location.href="#ofertas";
}

// ===============================
// FILTROS
// ===============================

function filtrarOfertas(){

    const pesquisa =
        document.getElementById("campo-pesquisa")
        .value
        .toLowerCase();

    const loja =
        document.getElementById("filtro-loja").value;

    const ordem =
        document.getElementById("ordenacao").value;

    let lista = todasAsOfertas.filter(j=>{

        const nome =
            j.nome.toLowerCase().includes(pesquisa);

        const okLoja =
            loja==="todas" || j.loja===loja;

        return nome && okLoja;

    });

    switch(ordem){

        case "desconto":
            lista.sort((a,b)=>b.desconto-a.desconto);
            break;

        case "menor-preco":
            lista.sort((a,b)=>a.preco-b.preco);
            break;

        case "maior-preco":
            lista.sort((a,b)=>b.preco-a.preco);
            break;

        case "nome":
            lista.sort((a,b)=>a.nome.localeCompare(b.nome));
            break;

    }

    document.getElementById("contador-ofertas").textContent =
        `${lista.length} ofertas encontradas`;

    const grid = document.getElementById("lista-ofertas");

    grid.innerHTML = "";

    lista.forEach(j=>{

        grid.innerHTML += criarCard(j);

    });

}

// ===============================
// CATEGORIAS
// ===============================

function selecionarPlataforma(){

    location.href="#ofertas";

}

// ===============================
// EVENTOS
// ===============================

document.getElementById("campo-pesquisa")
.addEventListener("input",filtrarOfertas);

document.getElementById("filtro-loja")
.addEventListener("change",filtrarOfertas);

document.getElementById("ordenacao")
.addEventListener("change",filtrarOfertas);

// ===============================
// INICIAR
// ===============================

carregarStatus();

carregarOfertas();
// ===============================
// TOP 10 MAIORES DESCONTOS
// ===============================

function mostrarTop10() {

    const lista = document.getElementById("top10-lista");

    if (!lista) return;

    lista.innerHTML = "";

    const jogos = [...todasAsOfertas]
        .sort((a, b) => b.desconto - a.desconto)
        .slice(0, 10);

    jogos.forEach((jogo, index) => {

        let classe = "";

        if (index === 0) classe = "rank1";
        if (index === 1) classe = "rank2";
        if (index === 2) classe = "rank3";

        lista.innerHTML += `
        <div class="top10-card">

            <div class="rank ${classe}">
                ${index + 1}
            </div>

            <img
                class="top10-img"
                src="${jogo.imagem}"
                alt="${jogo.nome}">

            <div class="top10-info">
                <h3>${jogo.nome}</h3>

                <div class="top10-desconto">
                    🔥 ${jogo.desconto}% OFF
                </div>
            </div>

            <div class="top10-preco">
                R$ ${Number(jogo.preco).toFixed(2)}
            </div>

        </div>
        `;

    });

}