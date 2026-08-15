import { buscarJogos } from "./firebase.js";

// ===========================
// GAVIX V15
// ===========================

const listaOfertas = document.getElementById("lista-ofertas");
const contador = document.getElementById("contador-ofertas");
const status = document.getElementById("status-gavix");

const pesquisa = document.getElementById("campo-pesquisa");
const pesquisaTopo = document.getElementById("campo-pesquisa-topo");
const filtroLoja = document.getElementById("filtro-loja");
const ordenacao = document.getElementById("ordenacao");

const cImg = document.getElementById("carousel-img");
const cTitulo = document.getElementById("carousel-title");
const cDesc = document.getElementById("carousel-desc");
const cPreco = document.getElementById("carousel-price");
const cBotao = document.getElementById("carousel-btn");

const top10 = document.getElementById("top10-lista");

let jogos = [];
let exibidos = [];
let slide = 0;

// ===========================
// INICIAR
// ===========================

async function iniciar(){

    status.textContent = "Carregando jogos...";

    jogos = await buscarJogos();

    if(jogos.length === 0){

        status.textContent = "Nenhum jogo encontrado";
        return;

    }

    exibidos = [...jogos];

    status.textContent = `${jogos.length} jogos carregados`;

    montarLojas();

    render();

    atualizarTop10();

    atualizarCarousel();

    setInterval(()=>{

        slide++;

        if(slide >= Math.min(5,jogos.length))
            slide = 0;

        atualizarCarousel();

    },5000);

}

// ===========================
// LOJAS
// ===========================

function montarLojas(){

    const lojas = [...new Set(jogos.map(j=>j.loja))].sort();

    filtroLoja.innerHTML =
    `<option value="todas">Todas as lojas</option>`;

    lojas.forEach(loja=>{

        filtroLoja.innerHTML +=
        `<option value="${loja}">${loja}</option>`;

    });

}

// ===========================
// CARROSSEL
// ===========================

function atualizarCarousel(){

    const destaques =
    [...jogos]
    .sort((a,b)=>b.desconto-a.desconto)
    .slice(0,5);

    const j = destaques[slide];

    if(!j) return;

    cImg.src = j.imagem;
    cTitulo.textContent = j.nome;
    cDesc.textContent = `${j.desconto}% OFF • ${j.loja}`;
    cPreco.textContent = `R$ ${Number(j.preco).toFixed(2)}`;

    cBotao.href = `game.html?id=${j.id}`;

}

// ===========================
// TOP 10
// ===========================

function atualizarTop10(){

    top10.innerHTML = "";

    [...jogos]
    .sort((a,b)=>b.desconto-a.desconto)
    .slice(0,10)
    .forEach((j,i)=>{

        top10.innerHTML += `
        <div class="top-item">

            <div class="top-rank">${i+1}</div>

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

// ===========================
// CARDS
// ===========================

function card(j){

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
               href="game.html?id=${j.id}">

               VER OFERTA

            </a>

        </div>

    </div>`;

}

// ===========================
// RENDER
// ===========================

function render(){

    const texto = pesquisa.value.toLowerCase();

    const loja = filtroLoja.value;

    exibidos = jogos.filter(j=>{

        const okNome =
        j.nome.toLowerCase().includes(texto);

        const okLoja =
        loja==="todas" || j.loja===loja;

        return okNome && okLoja;

    });

    switch(ordenacao.value){

        case "menor-preco":
            exibidos.sort((a,b)=>a.preco-b.preco);
            break;

        case "maior-preco":
            exibidos.sort((a,b)=>b.preco-a.preco);
            break;

        case "nome":
            exibidos.sort((a,b)=>a.nome.localeCompare(b.nome));
            break;

        default:
            exibidos.sort((a,b)=>b.desconto-a.desconto);

    }

    contador.textContent =
    `${exibidos.length} ofertas`;

    listaOfertas.innerHTML = "";

    exibidos.forEach(j=>{

        listaOfertas.innerHTML += card(j);

    });

}

// ===========================
// EVENTOS
// ===========================

pesquisa.addEventListener("input",render);

pesquisaTopo.addEventListener("input",e=>{

    pesquisa.value = e.target.value;

    render();

});

filtroLoja.addEventListener("change",render);

ordenacao.addEventListener("change",render);

// ===========================

iniciar();