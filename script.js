let todasAsOfertas = [];

async function carregarOfertas() {
    try {
        const resposta = await fetch(
            "data/ofertas.json?nocache=" + Date.now()
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar as ofertas.");
        }

        todasAsOfertas = await resposta.json();

        filtrarOfertas();

    } catch (erro) {
        console.error(
            "Erro ao carregar ofertas:",
            erro
        );

        const lista =
            document.getElementById("lista-ofertas");

        if (lista) {
            lista.innerHTML = `
                <div class="card">
                    <div class="card-content">
                        <h3>Não foi possível carregar as ofertas.</h3>
                        <p>Tente atualizar a página.</p>
                    </div>
                </div>
            `;
        }
    }
}


function mostrarOfertas(ofertas) {

    const lista =
        document.getElementById("lista-ofertas");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";


    if (ofertas.length === 0) {

        lista.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <h3>Nenhuma oferta encontrada.</h3>
                    <p>Tente pesquisar outro jogo.</p>
                </div>
            </div>
        `;

        return;
    }


    ofertas.forEach(function(oferta) {

        const card =
            document.createElement("div");

        card.classList.add("card");


        const simbolo =
            oferta.moeda === "USD"
                ? "US$"
                : "R$";


        const precoAntigo =
            Number(oferta.preco_antigo) || 0;


        const precoAtual =
            Number(oferta.preco) || 0;


        const economia =
            Math.max(
                0,
                precoAntigo - precoAtual
            );


        const desconto =
            Number(oferta.desconto) || 0;


        card.innerHTML = `

            <img
                src="${oferta.imagem || ""}"
                alt="${oferta.nome || "Jogo"}"
                loading="lazy"
            >


            <div class="card-content">

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

                    🏪 ${oferta.loja || "Loja"}

                </div>


                <div class="plataforma">

                    🎮 ${oferta.plataforma || "PC"}

                </div>


                <a
                    class="botao"
                    href="${oferta.link || "#"}"
                    target="_blank"
                    rel="noopener noreferrer"
                >

                    VER OFERTA

                </a>

            </div>

        `;


        lista.appendChild(card);

    });

}


function filtrarOfertas() {

    const campoPesquisa =
        document.getElementById(
            "campo-pesquisa"
        );


    const filtroPlataforma =
        document.getElementById(
            "filtro-plataforma"
        );


    const ordenacao =
        document.getElementById(
            "ordenacao"
        );


    const pesquisa =
        campoPesquisa
            ? campoPesquisa.value.toLowerCase().trim()
            : "";


    const plataforma =
        filtroPlataforma
            ? filtroPlataforma.value
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


                return (
                    correspondeNome &&
                    correspondePlataforma
                );

            }
        );


    if (tipoOrdenacao === "desconto") {

        resultados.sort(
            function(a, b) {

                return (
                    Number(b.desconto || 0) -
                    Number(a.desconto || 0)
                );

            }
        );

    }


    if (tipoOrdenacao === "menor-preco") {

        resultados.sort(
            function(a, b) {

                return (
                    Number(a.preco || 0) -
                    Number(b.preco || 0)
                );

            }
        );

    }


    if (tipoOrdenacao === "maior-preco") {

        resultados.sort(
            function(a, b) {

                return (
                    Number(b.preco || 0) -
                    Number(a.preco || 0)
                );

            }
        );

    }


    if (tipoOrdenacao === "nome") {

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


    mostrarOfertas(resultados);

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
   STATUS DO GAVIX
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
            "Erro ao carregar status do Gavix:",
            erro
        );

    }

}


/* =========================
   INICIALIZAÇÃO
========================= */


carregarOfertas();

carregarStatusGavix();