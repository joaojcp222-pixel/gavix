let todasAsOfertas = [];

/* =========================
   CARREGAR OFERTAS
========================= */

async function carregarOfertas(){

    const resposta = await fetch(
        "data/ofertas.json?nocache=" + Date.now()
    );

    todasAsOfertas = await resposta.json();

    mostrarBanner();

    mostrarImperdiveis();

    carregarLojas();

    criarCardsDeLojas();

    filtrarOfertas();
}

/* =========================
   BANNER PREMIUM
========================= */

let bannerAtual = 0;

function mostrarBanner(){

    const melhores = [...todasAsOfertas]
    .sort((a,b)=>b.desconto-a.desconto)
    .slice(0,5);

    atualizarBanner(melhores);

    setInterval(()=>{

        bannerAtual++;

        if(bannerAtual>=melhores.length){
            bannerAtual=0;
        }

        atualizarBanner(melhores);

    },5000);

}

function atualizarBanner(lista){

    const jogo = lista[bannerAtual];

    document.getElementById("banner-titulo").textContent = jogo.nome;

    document.getElementById("banner-descricao").textContent =
    `${jogo.desconto}% OFF • ${jogo.loja}`;

    document.getElementById("banner-imagem").src = jogo.imagem;

    document.getElementById("banner-botao").href = jogo.link;

}

/* =========================
   OFERTAS IMPERDÍVEIS
========================= */

function mostrarImperdiveis(){

    const lista =
    document.getElementById("lista-imperdiveis");

    lista.innerHTML = "";

    const jogos = [...todasAsOfertas]
    .sort((a,b)=>b.desconto-a.desconto)
    .slice(0,4);

    jogos.forEach(jogo=>{

        lista.innerHTML += criarCard(jogo);

    });

}

/* =========================
   CARD
========================= */

function criarCard(jogo){

return `
<div class="card">

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

<a
class="botao"
href="${jogo.link}"
target="_blank">

VER OFERTA →

</a>

</div>

</div>
`;

}

/* =========================
   LOJAS
========================= */

function carregarLojas(){

const select =
document.getElementById("filtro-loja");

select.innerHTML =
'<option value="todas">Todas lojas</option>';

const lojas = [
...new Set(
todasAsOfertas.map(x=>x.loja)
)
].sort();

lojas.forEach(loja=>{

select.innerHTML +=
`<option value="${loja}">${loja}</option>`;

});

}/* =========================
   CARDS DAS LOJAS
========================= */

function criarCardsDeLojas(){

const container =
document.getElementById("lista-lojas");

container.innerHTML="";

const mapa={};

todasAsOfertas.forEach(j=>{

if(!mapa[j.loja]){
mapa[j.loja]=0;
}

mapa[j.loja]++;

});

Object.keys(mapa)
.sort()
.forEach(loja=>{

container.innerHTML+=`

<button
class="store-card"
onclick="filtrarLoja('${loja}')">

<div class="store-icon">🏪</div>

<div class="store-info">

<strong>${loja}</strong>

<small>${mapa[loja]} ofertas</small>

</div>

</button>

`;

});

}

function filtrarLoja(loja){

document.getElementById("filtro-loja").value=loja;

filtrarOfertas();

window.location.href="#ofertas";

}

/* =========================
   FILTROS
========================= */

function filtrarOfertas(){

const pesquisa =
document.getElementById("campo-pesquisa")
.value.toLowerCase();

const plataforma =
document.getElementById("filtro-plataforma")
.value;

const loja =
document.getElementById("filtro-loja")
.value;

const ordem =
document.getElementById("ordenacao")
.value;

let lista =
todasAsOfertas.filter(j=>{

const okNome =
j.nome.toLowerCase().includes(pesquisa);

const okPlat =
plataforma==="todas" ||
j.plataforma===plataforma;

const okLoja =
loja==="todas" ||
j.loja===loja;

return okNome && okPlat && okLoja;

});

if(ordem==="desconto"){
lista.sort((a,b)=>b.desconto-a.desconto);
}

if(ordem==="menor-preco"){
lista.sort((a,b)=>a.preco-b.preco);
}

if(ordem==="maior-preco"){
lista.sort((a,b)=>b.preco-a.preco);
}

if(ordem==="nome"){
lista.sort((a,b)=>a.nome.localeCompare(b.nome));
}

document.getElementById("contador-ofertas")
.textContent=`${lista.length} ofertas encontradas`;

const grid =
document.getElementById("lista-ofertas");

grid.innerHTML="";

lista.forEach(j=>{

grid.innerHTML+=criarCard(j);

});

}

/* =========================
   CATEGORIAS
========================= */

function selecionarPlataforma(p){

document.getElementById("filtro-plataforma").value=p;

filtrarOfertas();

window.location.href="#ofertas";

}

/* =========================
   STATUS
========================= */

async function carregarStatus(){

const r = await fetch(
"data/status.json?"+Date.now()
);

const status = await r.json();

document.getElementById("status-gavix")
.innerHTML=`
🟢 ${status.quantidade_ofertas} jogos • Atualizado em ${status.ultima_atualizacao}
`;

}

/* =========================
   EVENTOS
========================= */

document.getElementById("campo-pesquisa")
.addEventListener("input",filtrarOfertas);

document.getElementById("filtro-plataforma")
.addEventListener("change",filtrarOfertas);

document.getElementById("filtro-loja")
.addEventListener("change",filtrarOfertas);

document.getElementById("ordenacao")
.addEventListener("change",filtrarOfertas);

/* =========================
   INICIAR
========================= */

carregarStatus();
carregarOfertas();