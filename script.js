let todasAsOfertas = [];
let favoritos = JSON.parse(localStorage.getItem("gavix_favoritos") || "[]");

// FAVORITOS
function favoritado(nome){
    return favoritos.includes(nome);
}

function alternarFavorito(nome){
    if(favoritado(nome)){
        favoritos = favoritos.filter(x => x !== nome);
    }else{
        favoritos.push(nome);
    }

    localStorage.setItem("gavix_favoritos", JSON.stringify(favoritos));

    mostrarImperdiveis();
    mostrarTop10();
    filtrarOfertas();
}

// CARREGAR
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

    const s = await r.json();

    document.getElementById("status-gavix").innerHTML =
    `🟢 ${s.quantidade_ofertas} jogos • Atualizado em ${s.ultima_atualizacao}`;

}

// BANNER
let banner = 0;

function mostrarBanner(){

    const lista = [...todasAsOfertas]
    .sort((a,b)=>b.desconto-a.desconto)
    .slice(0,5);

    atualizarBanner(lista);

    setInterval(()=>{

        banner++;

        if(banner >= lista.length){
            banner = 0;
        }

        atualizarBanner(lista);

    },5000);

}

function atualizarBanner(lista){

    const jogo = lista[banner];

    document.getElementById("banner-titulo").textContent = jogo.nome;

    document.getElementById("banner-descricao").textContent =
    `${jogo.desconto}% OFF • ${jogo.loja}`;

    document.getElementById("banner-imagem").src = jogo.imagem;

    document.getElementById("banner-botao").href =
    `game.html?id=${todasAsOfertas.indexOf(jogo)}`;

}

// CARD
function criarCard(j){

    const fav = favoritado(j.nome) ? "❤️" : "🤍";

    const id = todasAsOfertas.indexOf(j);

    return `

    <div class="card">

        <div
        class="favorito"
        onclick="alternarFavorito('${j.nome.replace(/'/g,"\\'")}')">

        ${fav}

        </div>

        <img src="${j.imagem}" alt="${j.nome}">

        <div class="card-content">

            <div class="desconto">
            🔥 ${j.desconto}% OFF
            </div>

            <h3>${j.nome}</h3>

            <div class="preco-antigo">
            R$ ${Number(j.preco_antigo).toFixed(2)}
            </div>

            <div class="preco">
            R$ ${Number(j.preco).toFixed(2)}
            </div>

            <div class="economia">
            Economize R$ ${(j.preco_antigo-j.preco).toFixed(2)}
            </div>

            <div class="loja">
            🏪 ${j.loja}
            </div>

            <div class="plataforma">
            🎮 ${j.plataforma}
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

// IMPERDÍVEIS
function mostrarImperdiveis(){

    const grid =
    document.getElementById("lista-imperdiveis");

    grid.innerHTML = "";

    [...todasAsOfertas]
    .sort((a,b)=>b.desconto-a.desconto)
    .slice(0,4)
    .forEach(j=>{

        grid.innerHTML += criarCard(j);

    });

}

// TOP 10
function mostrarTop10(){

    const lista =
    document.getElementById("top10-lista");

    if(!lista) return;

    lista.innerHTML = "";

    [...todasAsOfertas]
    .sort((a,b)=>b.desconto-a.desconto)
    .slice(0,10)
    .forEach((j,i)=>{

        let classe="";

        if(i===0) classe="rank1";
        if(i===1) classe="rank2";
        if(i===2) classe="rank3";

        lista.innerHTML += `

        <div class="top10-card">

            <div class="rank ${classe}">
            ${i+1}
            </div>

            <img
            class="top10-img"
            src="${j.imagem}">

            <div class="top10-info">

                <h3>${j.nome}</h3>

                <div class="top10-desconto">
                🔥 ${j.desconto}% OFF
                </div>

            </div>

            <div class="top10-preco">
            R$ ${Number(j.preco).toFixed(2)}
            </div>

        </div>

        `;

    });

}

// LOJAS
function carregarLojas(){

    const select =
    document.getElementById("filtro-loja");

    select.innerHTML =
    '<option value="todas">Todas as lojas</option>';

    [...new Set(todasAsOfertas.map(x=>x.loja))]
    .sort()
    .forEach(loja=>{

        select.innerHTML +=
        `<option value="${loja}">${loja}</option>`;

    });

}

function criarCardsDeLojas(){

    const container =
    document.getElementById("lista-lojas");

    if(!container) return;

    container.innerHTML = "";

    const mapa={};

    todasAsOfertas.forEach(j=>{

        mapa[j.loja]=(mapa[j.loja]||0)+1;

    });

    Object.keys(mapa)
    .sort()
    .forEach(loja=>{

        container.innerHTML += `

        <div
        class="store-card"
        onclick="filtrarLoja('${loja}')">

            <div class="store-icon">🏪</div>

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

// FILTROS
function filtrarOfertas(){

    const pesquisa =
    document.getElementById("campo-pesquisa")
    .value.toLowerCase();

    const loja =
    document.getElementById("filtro-loja").value;

    const ordem =
    document.getElementById("ordenacao").value;

    let lista =
    todasAsOfertas.filter(j=>{

        const nome =
        j.nome.toLowerCase().includes(pesquisa);

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

    document.getElementById("contador-ofertas").textContent =
    `${lista.length} ofertas encontradas`;

    const grid =
    document.getElementById("lista-ofertas");

    grid.innerHTML="";

    lista.forEach(j=>{

        grid.innerHTML += criarCard(j);

    });

}

// EVENTOS
document.getElementById("campo-pesquisa")
.addEventListener("input",filtrarOfertas);

document.getElementById("filtro-loja")
.addEventListener("change",filtrarOfertas);

document.getElementById("ordenacao")
.addEventListener("change",filtrarOfertas);

// INICIAR
carregarStatus();
carregarOfertas();