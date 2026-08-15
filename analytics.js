// ===============================
// GAVIX ANALYTICS
// ===============================

const STORAGE = "gavix_stats";

function carregarStats(){

    const dados = localStorage.getItem(STORAGE);

    if(dados) return JSON.parse(dados);

    return {
        visitas:0,
        cliques:0,
        compras:0
    };

}

function salvarStats(stats){

    localStorage.setItem(
        STORAGE,
        JSON.stringify(stats)
    );

}

function registrarVisita(){

    const stats = carregarStats();

    stats.visitas++;

    salvarStats(stats);

}

function registrarClique(){

    const stats = carregarStats();

    stats.cliques++;

    salvarStats(stats);

}

registrarVisita();