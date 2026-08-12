let todasAsOfertas = [];


async function carregarOfertas() {

    try {

        const resposta =
            await fetch("data/ofertas.json");


        todasAsOfertas =
            await resposta.json();


        filtrarOfertas();


    } catch (erro) {

        console.error(
            "Erro ao carregar ofertas:",
            erro
        );

    }

}


function mostrarOfertas(ofertas) {

    const lista =
        document.getElementById(
            "lista-ofertas"
        );


    lista.innerHTML = "";


    if (ofertas.length === 0) {

        lista.innerHTML = `

            <div class="card">

                <div class="card-content">

                    <h3>
                        Nenhuma oferta encontrada.
                    </h3>

                    <p>
                        Tente pesquisar outro jogo.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    ofertas.forEach(function(oferta) {

        const card =
            document.createElement("div");


        card.classList.add("card");


        card.innerHTML = `

            <img
                src="${oferta.imagem}"
                alt="${oferta.nome}"
            >


            <div class="card-content">

                <h3>
                    ${oferta.nome}
                </h3>


                                <div class="desconto">

                    ${oferta.desconto}% OFF

                </div>

<div class="preco-antigo">
    ${oferta.moeda === "USD" ? "US$" : "R$"} ${oferta.preco_antigo.toFixed(2)}
</div>

<div class="preco">
    ${oferta.moeda === "USD" ? "US$" : "R$"} ${oferta.preco.toFixed(2)}
</div>
                <div class="loja">

                    ${oferta.loja}

                </div>


                <div class="plataforma">

                    ${oferta.plataforma || "PC"}

                </div>


                <a
                    class="botao"
                    href="${oferta.link}"
                    target="_blank"
                >

                    VER OFERTA

                </a>

            </div>

        `;


        lista.appendChild(card);

    });

}


function filtrarOfertas() {

    const pesquisa =
        document
            .getElementById(
                "campo-pesquisa"
            )
            .value
            .toLowerCase();


    const plataforma =
        document
            .getElementById(
                "filtro-plataforma"
            )
            .value;


    const ordenacao =
        document
            .getElementById(
                "ordenacao"
            )
            .value;


    let resultados =
        todasAsOfertas.filter(
            function(oferta) {


                const nome =
                    oferta.nome.toLowerCase();


                const correspondeNome =
                    nome.includes(
                        pesquisa
                    );


                const correspondePlataforma =
                    plataforma === "todas" ||
                    oferta.plataforma === plataforma;


                return (
                    correspondeNome &&
                    correspondePlataforma
                );

            }
        );


    if (ordenacao === "desconto") {

        resultados.sort(
            function(a, b) {

                return b.desconto - a.desconto;

            }
        );

    }


    if (ordenacao === "menor-preco") {

        resultados.sort(
            function(a, b) {

                return a.preco - b.preco;

            }
        );

    }


    if (ordenacao === "maior-preco") {

        resultados.sort(
            function(a, b) {

                return b.preco - a.preco;

            }
        );

    }


    if (ordenacao === "nome") {

        resultados.sort(
            function(a, b) {

                return a.nome.localeCompare(
                    b.nome
                );

            }
        );

    }


    mostrarOfertas(resultados);

}


document
    .getElementById(
        "campo-pesquisa"
    )
    .addEventListener(
        "input",
        filtrarOfertas
    );


document
    .getElementById(
        "filtro-plataforma"
    )
    .addEventListener(
        "change",
        filtrarOfertas
    );


document
    .getElementById(
        "ordenacao"
    )
    .addEventListener(
        "change",
        filtrarOfertas
    );


carregarOfertas();