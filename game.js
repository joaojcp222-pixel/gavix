const id = Number(new URLSearchParams(location.search).get("id"));
let jogos = [];

async function carregar(){

    const r = await fetch("data/ofertas.json?" + Date.now());
    jogos = await r.json();

    const jogo = jogos[id];

    if(!jogo){
        document.body.innerHTML = "<h1>Jogo não encontrado</h1>";
        return;
    }

    document.title = "GAVIX | " + jogo.nome;

    const hero = document.getElementById("game-page");

    hero.innerHTML = `
    <section class="game-hero">

        <div class="game-cover">
            <img src="${jogo.imagem}" alt="${jogo.nome}">
        </div>

        <div class="game-content">

            <span class="game-badge">${jogo.loja}</span>

            <h1>${jogo.nome}</h1>

            <div style="color:#6dff92;font-weight:700;">
                🔥 ${jogo.desconto}% OFF
            </div>

            <div class="game-price-old">
                R$ ${Number(jogo.preco_antigo).toFixed(2)}
            </div>

            <div class="game-price">
                R$ ${Number(jogo.preco).toFixed(2)}
            </div>

            <div class="game-save">
                Economize R$ ${(jogo.preco_antigo-jogo.preco).toFixed(2)}
            </div>

            <a class="buy-btn"
               href="${jogo.link}"
               target="_blank">

               COMPRAR AGORA →

            </a>

        </div>

    </section>`;

    ["g1","g2","g3","g4"].forEach(i=>{
        document.getElementById(i).src = jogo.imagem;
    });

    document.getElementById("spec-plataforma").textContent = jogo.plataforma;
    document.getElementById("spec-loja").textContent = jogo.loja;
    document.getElementById("spec-desconto").textContent = jogo.desconto + "%";
    document.getElementById("spec-preco").textContent = "R$ " + Number(jogo.preco).toFixed(2);

    const tags = document.getElementById("tags");
    tags.innerHTML = "";
    ["Ação","RPG","Mundo Aberto"].forEach(t=>{
        tags.innerHTML += `<div class="tag-item">${t}</div>`;
    });

    document.getElementById("descricao").textContent =
        `Explore um universo cheio de ação e aproveite esta oferta da ${jogo.loja}.`;

    const rel = document.getElementById("rel-grid");
    rel.innerHTML = "";

    jogos
      .filter(x=>x.nome!==jogo.nome)
      .slice(0,4)
      .forEach(j=>{

        rel.innerHTML += `
        <div class="card">

            <img src="${j.imagem}">

            <div class="card-body">

                <span class="discount">🔥 ${j.desconto}% OFF</span>

                <h3>${j.nome}</h3>

                <div class="price">
                    R$ ${Number(j.preco).toFixed(2)}
                </div>

                <a class="btn" href="game.html?id=${jogos.indexOf(j)}">
                    VER JOGO
                </a>

            </div>

        </div>`;
      });

}

carregar();