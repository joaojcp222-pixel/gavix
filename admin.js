// ======================================
// GAVIX ADMIN V9
// ======================================

let jogos = [];

// Carregar ofertas
async function carregar(){

    const resposta = await fetch("data/ofertas.json?" + Date.now());

    jogos = await resposta.json();

    renderizar(jogos);

}

carregar();

// ---------------------------
// TABELA
// ---------------------------

function renderizar(lista){

    const tabela = document.getElementById("tabela");

    tabela.innerHTML = "";

    lista.forEach(j=>{

        tabela.innerHTML += `
        <tr>
            <td>${j.nome}</td>
            <td>${j.loja}</td>
            <td>R$ ${Number(j.preco).toFixed(2)}</td>
            <td>${j.desconto}%</td>
        </tr>`;
    });

}

// ---------------------------
// PESQUISA
// ---------------------------

document.getElementById("pesquisa")
.addEventListener("input", e=>{

    const texto = e.target.value.toLowerCase();

    const filtrado = jogos.filter(j=>
        j.nome.toLowerCase().includes(texto)
    );

    renderizar(filtrado);

});

// ---------------------------
// NOVO JOGO
// ---------------------------

document.getElementById("formJogo")
.addEventListener("submit", e=>{

    e.preventDefault();

    const jogo = {

        nome: nome.value,

        loja: loja.value,

        plataforma: plataforma.value,

        desconto: Number(desconto.value),

        preco_antigo: Number(antigo.value),

        preco: Number(preco.value),

        imagem: imagem.value,

        link: link.value

    };

    jogos.unshift(jogo);

    renderizar(jogos);

    gerarJSON();

    formJogo.reset();

    alert("Jogo adicionado com sucesso!");

});

// ---------------------------
// GERAR JSON
// ---------------------------

function gerarJSON(){

    const texto = JSON.stringify(jogos,null,4);

    const blob = new Blob(
        [texto],
        {type:"application/json"}
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "ofertas.json";

    a.click();

    URL.revokeObjectURL(url);

}