let todasAsOfertas = [];


/* =========================
   CARREGAR OFERTAS
========================= */

async function carregarOfertas() {

    try {

        const resposta = await fetch(
            "data/ofertas.json?nocache=" + Date.now()
        );

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível carregar as ofertas."
            );
        }

        todasAsOfertas = await resposta.json();

        carregarLojas();

        criarCardsDeLojas();

        mostrarImperdiveis();

        filtrarOfertas();

    } catch (erro) {

        console.error(
            "Erro ao carregar ofertas:",
            erro
        );

        const lista =
            document.getElementById(
                "lista-ofertas"
            );

        if (lista) {

            lista.innerHTML = `
                <div class="card">
                    <div class="card-content">

                        <h3>
                            Não foi possível carregar as ofertas.
                        </h3>

                        <p>
                            Tente atualizar a página.
                        </p>

                    </div>
                </div>
            `;

        }

    }

}


/* =========================
   OFERTAS IMPERDÍVEIS
========================= */

function mostrarImperdiveis() {

    const container =
        document.getElementById(
            "lista-imperdiveis"
        );

    if (!container) {
        return;
    }


    /*
     * Pega as ofertas que possuem
     * maior porcentagem de desconto.
     */

    const melhores =
        [...todasAsOfertas]
            .sort(
                function(a, b) {

                    return (
                        Number(
                            b.desconto || 0
                        ) -
                        Number(
                            a.desconto || 0
                        )
                    );

                }
            )
            .slice(0, 4);


    container.innerHTML = "";


    if (melhores.length === 0) {

        container.innerHTML = `
            <div class="card">

                <div class="card-content">

                    <h3>
                        Nenhuma oferta disponível.
                    </h3>

                </div>

            </div>
        `;

        return;

    }


    melhores.forEach(
        function(oferta) {

            const card =
                criarCardOferta(
                    oferta,
                    true
                );

            container.appendChild(
                card
            );

        }
    );

}


/* =========================
   CRIAR CARD
========================= */

function criarCardOferta(
    oferta,
    destaque = false
) {

    const card =
        document.createElement(
            "div"
        );


    card.classList.add(
        "card"
    );


    if (destaque) {

        card.classList.add(
            "card-destaque"
        );

    }


    const simbolo =
        oferta.moeda === "USD"
            ? "US$"
            : "R$";


    const precoAntigo =
        Number(
            oferta.preco_antigo
        ) || 0;


    const precoAtual =
        Number(
            oferta.preco
        ) || 0;


    const economia =
        Math.max(
            0,
            precoAntigo -
            precoAtual
        );


    const desconto =
        Number(
            oferta.desconto
        ) || 0;


    const linkOferta =
        oferta.linkAfiliado ||
        oferta.link ||
        "#";


    const nomeCodificado =
        encodeURIComponent(
            oferta.nome || ""
        );


    const paginaJogo =
        "jogo.html?nome=" +
        nomeCodificado;


    card.innerHTML = `

        <img
            src="${oferta.imagem || ""}"
            alt="${oferta.nome || "Jogo"}"
            loading="lazy"
        >


        <div class="card-content">

            ${
                destaque
                    ? `
                        <span class="badge-imperdivel">
                            🔥 IMPERDÍVEL
                        </span>
                    `
                    : ""
            }


            <h3>
                ${oferta.nome || "Jogo sem nome"}
            </h3>


            <div class="desconto">

                🔥 ${desconto}% OFF

            </div>


            <div class="preco-antigo">

                ${simbolo}
                ${precoAntigo.toFixed(2)}

            </div>


            <div class="preco">

                ${simbolo}
                ${precoAtual.toFixed(2)}

            </div>


            <div class="economia">

                💰 Economize
                ${simbolo}
                ${economia.toFixed(2)}

            </div>


            <div class="loja">

                🏪
                ${oferta.loja || "Loja"}

            </div>


            <div class="plataforma">

                🎮
                ${oferta.plataforma || "PC"}

            </div>


            <a
                class="botao"
                href="${linkOferta}"
                target="_blank"
                rel="noopener noreferrer"
            >

                VER OFERTA →

            </a>

        </div>

    `;


    card.style.cursor =
        "pointer";


    card.addEventListener(
        "click",
        function(event) {

            if (
                event.target.closest(
                    ".botao"
                )
            ) {

                return;

            }


            window.location.href =
                paginaJogo;

        }
    );


    return card;

}


/* =========================
   FILTRO DE LOJAS
========================= */

function carregarLojas() {

    const filtroLoja =
        document.getElementById(
            "filtro-loja"
        );

    if (!filtroLoja) {
        return;
    }


    filtroLoja.innerHTML = `
        <option value="todas">
            Todas as lojas
        </option>
    `;


    const lojas = [
        ...new Set(
            todasAsOfertas
                .map(
                    oferta =>
                        oferta.loja
                )
                .filter(
                    loja =>
                        loja &&
                        loja.trim() !== ""
                )
        )
    ];


    lojas.sort(
        function(a, b) {

            return a.localeCompare(
                b,
                "pt-BR"
            );

        }
    );


    lojas.forEach(
        function(loja) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                loja;

            option.textContent =
                loja;

            filtroLoja.appendChild(
                option
            );

        }
    );

}


/* =========================
   CARDS DAS LOJAS
========================= */

function criarCardsDeLojas() {

    const container =
        document.getElementById(
            "lista-lojas"
        );

    if (!container) {
        return;
    }


    const mapaLojas = {};


    todasAsOfertas.forEach(
        function(oferta) {

            const loja =
                oferta.loja;

            if (!loja) {
                return;
            }


            if (!mapaLojas[loja]) {

                mapaLojas[loja] =
                    0;

            }


            mapaLojas[loja]++;

        }
    );


    const lojas =
        Object.keys(
            mapaLojas
        ).sort(
            function(a, b) {

                return a.localeCompare(
                    b,
                    "pt-BR"
                );

            }
        );


    container.innerHTML = "";


    lojas.forEach(
        function(loja) {

            const card =
                document.createElement(
                    "button"
                );


            card.type =
                "button";


            card.classList.add(
                "store-card"
            );


            card.innerHTML = `

                <span class="store-icon">
                    🏪
                </span>

                <span class="store-info">

                    <strong>
                        ${loja}
                    </strong>

                    <small>
                        ${mapaLojas[loja]}
                        ${
                            mapaLojas[loja] === 1
                                ? " oferta"
                                : " ofertas"
                        }
                    </small>

                </span>

                <span class="store-arrow">
                    →
                </span>

            `;


            card.addEventListener(
                "click",
                function() {

                    const filtroLoja =
                        document.getElementById(
                            "filtro-loja"
                        );


                    if (filtroLoja) {

                        filtroLoja.value =
                            loja;

                    }


                    filtrarOfertas();


                    const ofertas =
                        document.getElementById(
                            "ofertas"
                        );


                    if (ofertas) {

                        ofertas.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


/* =========================
   MOSTRAR OFERTAS
========================= */

function mostrarOfertas(
    ofertas
) {

    const lista =
        document.getElementById(
            "lista-ofertas"
        );

    if (!lista) {
        return;
    }


    lista.innerHTML = "";


    if (ofertas.length === 0) {

        lista.innerHTML = `
            <div class="card">

                <div class="card-content">

                    <h3>
                        Nenhuma oferta encontrada.
                    </h3>

                    <p>
                        Tente mudar os filtros.
                    </p>

                </div>

            </div>
        `;


        atualizarContador(
            0
        );


        return;

    }


    atualizarContador(
        ofertas.length
    );


    ofertas.forEach(
        function(oferta) {

            const card =
                criarCardOferta(
                    oferta,
                    false
                );


            lista.appendChild(
                card
            );

        }
    );

}


/* =========================
   CONTADOR
========================= */

function atualizarContador(
    quantidade
) {

    const contador =
        document.getElementById(
            "contador-ofertas"
        );


    if (!contador) {
        return;
    }


    contador.textContent =
        "🔥 " +
        quantidade +
        (
            quantidade === 1
                ? " oferta encontrada"
                : " ofertas encontradas"
        );

}


/* =========================
   FILTRAR OFERTAS
========================= */

function filtrarOfertas() {

    const campoPesquisa =
        document.getElementById(
            "campo-pesquisa"
        );


    const filtroPlataforma =
        document.getElementById(
            "filtro-plataforma"
        );


    const filtroLoja =
        document.getElementById(
            "filtro-loja"
        );


    const ordenacao =
        document.getElementById(
            "ordenacao"
        );


    const pesquisa =
        campoPesquisa
            ? campoPesquisa.value
                .toLowerCase()
                .trim()
            : "";


    const plataforma =
        filtroPlataforma
            ? filtroPlataforma.value
            : "todas";


    const loja =
        filtroLoja
            ? filtroLoja.value
            : "todas";


    const tipoOrdenacao =
        ordenacao
            ? ordenacao.value
            : "padrao";


    let resultados =
        todasAsOfertas.filter(
            function(oferta) {

                const nome =
                    String(
                        oferta.nome || ""
                    ).toLowerCase();


                const correspondeNome =
                    nome.includes(
                        pesquisa
                    );


                const correspondePlataforma =
                    plataforma === "todas" ||
                    !oferta.plataforma ||
                    oferta.plataforma === plataforma;


                const correspondeLoja =
                    loja === "todas" ||
                    oferta.loja === loja;


                return (
                    correspondeNome &&
                    correspondePlataforma &&
                    correspondeLoja
                );

            }
        );


    if (
        tipoOrdenacao ===
        "desconto"
    ) {

        resultados.sort(
            function(a, b) {

                return (
                    Number(
                        b.desconto || 0
                    ) -
                    Number(
                        a.desconto || 0
                    )
                );

            }
        );

    }


    if (
        tipoOrdenacao ===
        "menor-preco"
    ) {

        resultados.sort(
            function(a, b) {

                return (
                    Number(
                        a.preco || 0
                    ) -
                    Number(
                        b.preco || 0
                    )
                );

            }
        );

    }


    if (
        tipoOrdenacao ===
        "maior-preco"
    ) {

        resultados.sort(
            function(a, b) {

                return (
                    Number(
                        b.preco || 0
                    ) -
                    Number(
                        a.preco || 0
                    )
                );

            }
        );

    }


    if (
        tipoOrdenacao ===
        "nome"
    ) {

        resultados.sort(
            function(a, b) {

                return String(
                    a.nome || ""
                ).localeCompare(
                    String(
                        b.nome || ""
                    ),
                    "pt-BR"
                );

            }
        );

    }


    mostrarOfertas(
        resultados
    );

}


/* =========================
   CATEGORIAS
========================= */

function selecionarPlataforma(
    plataforma
) {

    const filtro =
        document.getElementById(
            "filtro-plataforma"
        );


    if (!filtro) {
        return;
    }


    filtro.value =
        plataforma;


    filtrarOfertas();


    const ofertas =
        document.getElementById(
            "ofertas"
        );


    if (ofertas) {

        ofertas.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================
   STATUS
========================= */

async function carregarStatusGavix() {

    try {

        const resposta =
            await fetch(
                "data/status.json?nocache=" +
                Date.now()
            );


        if (!resposta.ok) {

            throw new Error(
                "Status não encontrado."
            );

        }


        const status =
            await resposta.json();


        const elemento =
            document.getElementById(
                "status-gavix"
            );


        if (elemento) {

            elemento.innerHTML =
                "🔄 Última atualização: " +
                status.ultima_atualizacao +
                " • " +
                status.quantidade_ofertas +
                " ofertas encontradas";

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar status:",
            erro
        );

    }

}


/* =========================
   EVENTOS
========================= */

const campoPesquisa =
    document.getElementById(
        "campo-pesquisa"
    );


if (campoPesquisa) {

    campoPesquisa.addEventListener(
        "input",
        filtrarOfertas
    );

}


const filtroPlataforma =
    document.getElementById(
        "filtro-plataforma"
    );


if (filtroPlataforma) {

    filtroPlataforma.addEventListener(
        "change",
        filtrarOfertas
    );

}


const filtroLoja =
    document.getElementById(
        "filtro-loja"
    );


if (filtroLoja) {

    filtroLoja.addEventListener(
        "change",
        filtrarOfertas
    );

}


const ordenacao =
    document.getElementById(
        "ordenacao"
    );


if (ordenacao) {

    ordenacao.addEventListener(
        "change",
        filtrarOfertas
    );

}


/* =========================
   INICIALIZAÇÃO
========================= */

carregarOfertas();

carregarStatusGavix();