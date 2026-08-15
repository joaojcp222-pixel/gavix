// ==========================================
// GAVIX V13 - FIREBASE
// ==========================================

import { buscarJogos } from "./firebase.js";

let jogos = [];
let jogosFiltrados = [];
let destaques = [];
let slide = 0;

async function iniciar(){

    jogos = await buscarJogos();

    jogosFiltrados = [...jogos];

    preencherLojas();

    destaques = [...jogos]
        .sort((a,b)=>b.desconto-a.desconto)
        .slice(0,5);

    atualizarCarousel();

    setInterval(proximoSlide,5000);

    atualizarTop10();

    renderizar(jogosFiltrados);

}

iniciar();

function atualizarCarousel(){

    if(destaques.length===0) return;

    const j = destaques[slide];

    carouselImg.src = j.imagem;

    carouselTitle.textContent = j.nome;

    carouselDesc.textContent =
        `${j.desconto}% OFF • ${j.loja}`;

    carouselPrice.textContent =
        `R$ ${Number(j.preco).toFixed(2)}`;

    carouselBtn.href =
        `game.html?id=${jogos.indexOf(j)}`;

}

function proximoSlide(){

    slide++;

    if(slide>=destaques.length)
        slide=0;

    atualizarCarousel();

}

function atualizarTop10(){

    top10Lista.innerHTML="";

    [...jogos]
    .sort((a,b)=>b.desconto-a.desconto)
    .slice(0,10)
    .forEach((j,i)=>{

        top10Lista.innerHTML += `
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

function preencherLojas(){

    filtroLoja.innerHTML =
    `<option value="todas">
        Todas as lojas
     </option>`;

    [...new Set(jogos.map(j=>j.loja))]
    .sort()
    .forEach(loja=>{

        filtroLoja.innerHTML += `
        <option value="${loja}">
            ${loja}
        </option>`;

    });

}

function card(j){

    return `
    <div class="card">

        <img src="${j.imagem}">

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

function renderizar(lista){

    contadorOfertas.textContent =
        `${lista.length} ofertas`;

    listaOfertas.innerHTML="";

    lista.forEach(j=>{

        listaOfertas.innerHTML += card(j);

    });

}

campoPesquisa.oninput = aplicar;

campoPesquisaTopo.oninput = e=>{

    campoPesquisa.value = e.target.value;

    aplicar();

};

filtroLoja.onchange = aplicar;

ordenacao.onchange = aplicar;

function aplicar(){

    const txt =
        campoPesquisa.value.toLowerCase();

    const loja =
        filtroLoja.value;

    jogosFiltrados = jogos.filter(j=>{

        const okNome =
        j.nome.toLowerCase().includes(txt);

        const okLoja =
        loja==="todas" || j.loja===loja;

        return okNome && okLoja;

    });

    switch(ordenacao.value){

        case "desconto":
            jogosFiltrados.sort((a,b)=>b.desconto-a.desconto);
            break;

        case "menor-preco":
            jogosFiltrados.sort((a,b)=>a.preco-b.preco);
            break;

        case "maior-preco":
            jogosFiltrados.sort((a,b)=>b.preco-a.preco);
            break;

        case "nome":
            jogosFiltrados.sort((a,b)=>
                a.nome.localeCompare(b.nome));
            break;

    }

    renderizar(jogosFiltrados);

}