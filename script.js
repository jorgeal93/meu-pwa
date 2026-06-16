// =====================================
// FORÇA CONSULTORIA V2.0
// PARTE 1 - NÚCLEO DO SISTEMA
// =====================================

// LOGIN

const loginForm = document.getElementById("loginForm");
const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");
const logoutBtn = document.getElementById("logoutBtn");

// DADOS

let operadores =
    JSON.parse(localStorage.getItem("operadores")) || [];

let producoes =
    JSON.parse(localStorage.getItem("producoes")) || [];

let metas =
    JSON.parse(localStorage.getItem("metas")) || {
        diaria: 10,
        semanal: 50,
        mensal: 200
    };

// =====================================
// SALVAR DADOS
// =====================================

function salvarDados() {

    localStorage.setItem(
        "operadores",
        JSON.stringify(operadores)
    );

    localStorage.setItem(
        "producoes",
        JSON.stringify(producoes)
    );

    localStorage.setItem(
        "metas",
        JSON.stringify(metas)
    );

}

// =====================================
// LOGIN AUTOMÁTICO
// =====================================

if (localStorage.getItem("logged") === "true") {

    loginPage.style.display = "none";

    dashboard.classList.remove("hidden");

    dashboard.style.display = "flex";

}

// =====================================
// LOGIN
// =====================================

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const usuario =
        document
            .getElementById("username")
            .value
            .trim();

    const senha =
        document
            .getElementById("password")
            .value
            .trim();

    if (
        usuario === "admin" &&
        senha === "admin"
    ) {

        localStorage.setItem(
            "logged",
            "true"
        );

        loginPage.style.display = "none";

        dashboard.classList.remove("hidden");

        dashboard.style.display = "flex";

        atualizarSistema();

    } else {

        alert("Usuário ou senha inválidos.");

    }

});

// =====================================
// LOGOUT
// =====================================

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("logged");

    location.reload();

});

// =====================================
// MENU
// =====================================

document
    .querySelectorAll(".menu-btn")
    .forEach(btn => {

        btn.addEventListener("click", () => {

            document
                .querySelectorAll(".menu-btn")
                .forEach(b =>
                    b.classList.remove("active")
                );

            btn.classList.add("active");

            document
                .querySelectorAll(".page")
                .forEach(page =>
                    page.classList.remove("active-page")
                );

            document
                .getElementById(
                    btn.dataset.page
                )
                .classList.add(
                    "active-page"
                );

        });

    });

// =====================================
// OPERADORES
// =====================================

const operadorForm =
    document.getElementById("operadorForm");

operadorForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        const nome =
            document
                .getElementById(
                    "operadorNome"
                )
                .value
                .trim();

        if (!nome) return;

        operadores.push({
            id: Date.now(),
            nome: nome
        });

        salvarDados();

        this.reset();

        atualizarSistema();

    }
);

// =====================================
// REMOVER OPERADOR
// =====================================

function removerOperador(id) {

    if (
        !confirm(
            "Deseja excluir este operador?"
        )
    ) {
        return;
    }

    operadores =
        operadores.filter(
            op => op.id !== id
        );

    producoes =
        producoes.filter(
            prod =>
                prod.operadorId !== id
        );

    salvarDados();

    atualizarSistema();

}

window.removerOperador =
    removerOperador;

// =====================================
// TABELA OPERADORES
// =====================================

function renderOperadores() {

    const tabela =
        document.getElementById(
            "operadoresTable"
        );

    tabela.innerHTML = "";

    operadores.forEach(op => {

        tabela.innerHTML += `
        <tr>

            <td>${op.nome}</td>

            <td>

                <button
                    class="btn-primary delete-btn"
                    onclick="removerOperador(${op.id})">

                    Excluir

                </button>

            </td>

        </tr>
        `;

    });

}

// =====================================
// SELECT OPERADORES
// =====================================

function renderSelectOperadores() {

    const select =
        document.getElementById(
            "operadorSelect"
        );

    const filtro =
        document.getElementById(
            "filtroOperador"
        );

    if (select) {

        select.innerHTML = "";

        operadores.forEach(op => {

            select.innerHTML += `
            <option value="${op.id}">
                ${op.nome}
            </option>
            `;

        });

    }

    if (filtro) {

        filtro.innerHTML =
            `
            <option value="">
                Todos Operadores
            </option>
            `;

        operadores.forEach(op => {

            filtro.innerHTML += `
            <option value="${op.id}">
                ${op.nome}
            </option>
            `;

        });

    }

}

// =====================================
// PRODUÇÃO
// =====================================

const producaoForm =
    document.getElementById(
        "producaoForm"
    );

producaoForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        const operadorId =
            Number(
                document.getElementById(
                    "operadorSelect"
                ).value
            );

        const parcelas =
            Number(
                document.getElementById(
                    "parcelasInput"
                ).value
            );

        if (!parcelas) return;

        producoes.push({

            operadorId,

            parcelas,

            data:
                new Date()
                .toISOString()

        });

        salvarDados();

        this.reset();

        atualizarSistema();

    }
);

// =====================================
// TABELA PRODUÇÃO
// =====================================

function renderProducoes() {

    const tabela =
        document.getElementById(
            "producaoTable"
        );

    if (!tabela) return;

    tabela.innerHTML = "";

    producoes
        .slice()
        .reverse()
        .forEach(prod => {

            const operador =
                operadores.find(
                    op =>
                        op.id ===
                        prod.operadorId
                );

            const data =
                new Date(
                    prod.data
                ).toLocaleDateString(
                    "pt-BR"
                );

            tabela.innerHTML += `
            <tr>

                <td>
                    ${operador
                        ? operador.nome
                        : "-"
                    }
                </td>

                <td>
                    ${prod.parcelas}
                </td>

                <td>
                    ${data}
                </td>

            </tr>
            `;

        });

}

// =====================================
// SISTEMA
// =====================================

function atualizarSistema() {

    renderOperadores();

    renderSelectOperadores();

    renderProducoes();

}

// =====================================
// INICIALIZAÇÃO
// =====================================

atualizarSistema();
// =====================================
// PARTE 2 - DASHBOARD E METAS
// =====================================

let chart;

// =====================================
// PRODUÇÃO HOJE
// =====================================

function calcularProducaoHoje() {

    const hoje = new Date().toDateString();

    return producoes
        .filter(prod =>
            new Date(prod.data).toDateString() === hoje
        )
        .reduce((total, prod) =>
            total + prod.parcelas, 0);

}

// =====================================
// PRODUÇÃO SEMANA
// =====================================

function calcularProducaoSemana() {

    const hoje = new Date();

    const inicioSemana = new Date(hoje);

    inicioSemana.setDate(
        hoje.getDate() - hoje.getDay()
    );

    return producoes
        .filter(prod => {

            const dataProd =
                new Date(prod.data);

            return dataProd >= inicioSemana;

        })
        .reduce((total, prod) =>
            total + prod.parcelas, 0);

}

// =====================================
// PRODUÇÃO MÊS
// =====================================

function calcularProducaoMes() {

    const hoje = new Date();

    return producoes
        .filter(prod => {

            const dataProd =
                new Date(prod.data);

            return (
                dataProd.getMonth() ===
                hoje.getMonth()
            ) &&
            (
                dataProd.getFullYear() ===
                hoje.getFullYear()
            );

        })
        .reduce((total, prod) =>
            total + prod.parcelas, 0);

}

// =====================================
// CARDS DASHBOARD
// =====================================

function atualizarDashboard() {

    const totalOperadores =
        operadores.length;

    const producaoHoje =
        calcularProducaoHoje();

    const producaoSemana =
        calcularProducaoSemana();

    const producaoMes =
        calcularProducaoMes();

    const elTotal =
        document.getElementById(
            "totalOperadores"
        );

    const elHoje =
        document.getElementById(
            "producaoHoje"
        );

    const elSemana =
        document.getElementById(
            "producaoSemana"
        );

    const elMes =
        document.getElementById(
            "producaoMes"
        );

    if (elTotal)
        elTotal.textContent =
            totalOperadores;

    if (elHoje)
        elHoje.textContent =
            producaoHoje;

    if (elSemana)
        elSemana.textContent =
            producaoSemana;

    if (elMes)
        elMes.textContent =
            producaoMes;

}

// =====================================
// METAS
// =====================================

function atualizarMetas() {

    const hoje =
        calcularProducaoHoje();

    const semana =
        calcularProducaoSemana();

    const percentualDiario =
        metas.diaria > 0
        ? (hoje / metas.diaria) * 100
        : 0;

    const percentualSemanal =
        metas.semanal > 0
        ? (semana / metas.semanal) * 100
        : 0;

    const barraDiaria =
        document.getElementById(
            "barraMetaDiaria"
        );

    const barraSemanal =
        document.getElementById(
            "barraMetaSemanal"
        );

    const textoDiario =
        document.getElementById(
            "percentualMetaDiaria"
        );

    const textoSemanal =
        document.getElementById(
            "percentualMetaSemanal"
        );

    if (barraDiaria) {

        barraDiaria.style.width =
            Math.min(
                percentualDiario,
                100
            ) + "%";

    }

    if (barraSemanal) {

        barraSemanal.style.width =
            Math.min(
                percentualSemanal,
                100
            ) + "%";

    }

    if (textoDiario) {

        textoDiario.textContent =
            percentualDiario
            .toFixed(0) + "%";

    }

    if (textoSemanal) {

        textoSemanal.textContent =
            percentualSemanal
            .toFixed(0) + "%";

    }

}

// =====================================
// SALVAR METAS
// =====================================

const metaForm =
    document.getElementById(
        "metaForm"
    );

if (metaForm) {

    metaForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            metas.diaria =
                Number(
                    document
                        .getElementById(
                            "metaDiaria"
                        ).value
                );

            metas.semanal =
                Number(
                    document
                        .getElementById(
                            "metaSemanal"
                        ).value
                );

            metas.mensal =
                Number(
                    document
                        .getElementById(
                            "metaMensal"
                        ).value
                );

            salvarDados();

            atualizarMetas();

            alert(
                "Metas salvas com sucesso!"
            );

        }
    );

}

// =====================================
// CARREGAR METAS
// =====================================

function carregarMetas() {

    const diaria =
        document.getElementById(
            "metaDiaria"
        );

    const semanal =
        document.getElementById(
            "metaSemanal"
        );

    const mensal =
        document.getElementById(
            "metaMensal"
        );

    if (diaria)
        diaria.value =
            metas.diaria || 10;

    if (semanal)
        semanal.value =
            metas.semanal || 50;

    if (mensal)
        mensal.value =
            metas.mensal || 200;

}

// =====================================
// GRÁFICO
// =====================================

function atualizarGrafico() {

    const canvas =
        document.getElementById(
            "producaoChart"
        );

    if (!canvas) return;

    const labels = [];
    const valores = [];

    operadores.forEach(op => {

        labels.push(op.nome);

        const total =
            producoes
                .filter(
                    prod =>
                    prod.operadorId === op.id
                )
                .reduce(
                    (soma, prod) =>
                    soma + prod.parcelas,
                    0
                );

        valores.push(total);

    });

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [

                {
                    label:
                        "Parcelas Produzidas",

                    data: valores

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

// =====================================
// ATUALIZA SISTEMA
// =====================================

const atualizarSistemaOriginal =
    atualizarSistema;

atualizarSistema = function () {

    atualizarSistemaOriginal();

    atualizarDashboard();

    atualizarMetas();

    atualizarGrafico();

};

// =====================================
// INICIALIZAÇÃO
// =====================================

carregarMetas();

atualizarDashboard();

atualizarMetas();

atualizarGrafico();
// =====================================
// PARTE 3 - HISTÓRICO PROFISSIONAL
// =====================================

// ELEMENTOS

const historicoTable =
    document.getElementById(
        "historicoTable"
    );

const filtroDataInicial =
    document.getElementById(
        "filtroDataInicial"
    );

const filtroDataFinal =
    document.getElementById(
        "filtroDataFinal"
    );

const filtroOperador =
    document.getElementById(
        "filtroOperador"
    );

const btnFiltrar =
    document.getElementById(
        "btnFiltrar"
    );

// =====================================
// HISTÓRICO COMPLETO
// =====================================

function renderHistorico(
    listaProducoes = producoes
) {

    if (!historicoTable) return;

    historicoTable.innerHTML = "";

    if (listaProducoes.length === 0) {

        historicoTable.innerHTML = `
        <tr>
            <td colspan="3">
                Nenhum registro encontrado
            </td>
        </tr>
        `;

        return;
    }

    listaProducoes
        .slice()
        .reverse()
        .forEach(prod => {

            const operador =
                operadores.find(
                    op =>
                        op.id ===
                        prod.operadorId
                );

            const data =
                new Date(
                    prod.data
                ).toLocaleDateString(
                    "pt-BR"
                );

            historicoTable.innerHTML += `
            <tr>

                <td>
                    ${
                        operador
                        ? operador.nome
                        : "-"
                    }
                </td>

                <td>
                    ${prod.parcelas}
                </td>

                <td>
                    ${data}
                </td>

            </tr>
            `;

        });

}

// =====================================
// FILTRAR HISTÓRICO
// =====================================

function filtrarHistorico() {

    let resultado =
        [...producoes];

    const operadorSelecionado =
        filtroOperador.value;

    const dataInicial =
        filtroDataInicial.value;

    const dataFinal =
        filtroDataFinal.value;

    // FILTRO OPERADOR

    if (operadorSelecionado !== "") {

        resultado =
            resultado.filter(
                prod =>
                    prod.operadorId ===
                    Number(
                        operadorSelecionado
                    )
            );

    }

    // FILTRO DATA INICIAL

    if (dataInicial) {

        resultado =
            resultado.filter(prod => {

                const dataProd =
                    new Date(prod.data);

                const inicio =
                    new Date(dataInicial);

                return dataProd >= inicio;

            });

    }

    // FILTRO DATA FINAL

    if (dataFinal) {

        resultado =
            resultado.filter(prod => {

                const dataProd =
                    new Date(prod.data);

                const fim =
                    new Date(dataFinal);

                fim.setHours(
                    23,
                    59,
                    59,
                    999
                );

                return dataProd <= fim;

            });

    }

    renderHistorico(resultado);

}

// =====================================
// BOTÃO FILTRAR
// =====================================

if (btnFiltrar) {

    btnFiltrar.addEventListener(
        "click",
        filtrarHistorico
    );

}

// =====================================
// FILTRO AUTOMÁTICO
// =====================================

if (filtroOperador) {

    filtroOperador.addEventListener(
        "change",
        filtrarHistorico
    );

}

if (filtroDataInicial) {

    filtroDataInicial.addEventListener(
        "change",
        filtrarHistorico
    );

}

if (filtroDataFinal) {

    filtroDataFinal.addEventListener(
        "change",
        filtrarHistorico
    );

}

// =====================================
// ESTATÍSTICAS HISTÓRICO
// =====================================

function totalHistorico() {

    return producoes.reduce(
        (soma, item) =>
            soma + item.parcelas,
        0
    );

}

function totalHojeHistorico() {

    const hoje =
        new Date().toDateString();

    return producoes
        .filter(
            prod =>
                new Date(
                    prod.data
                ).toDateString() === hoje
        )
        .reduce(
            (soma, item) =>
                soma + item.parcelas,
            0
        );

}

// =====================================
// ATUALIZA SISTEMA
// =====================================

const atualizarSistemaParte2 =
    atualizarSistema;

atualizarSistema = function () {

    atualizarSistemaParte2();

    renderHistorico();

};

// =====================================
// INICIALIZAÇÃO
// =====================================

renderHistorico();
// =====================================
// PARTE 4 - DARK MODE
// =====================================

// ELEMENTOS

const toggleDarkMode =
    document.getElementById(
        "toggleDarkMode"
    );

// =====================================
// CARREGAR TEMA
// =====================================

function carregarTema() {

    const tema =
        localStorage.getItem(
            "tema"
        );

    if (tema === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        atualizarBotaoTema();

    }

}

// =====================================
// SALVAR TEMA
// =====================================

function salvarTema(modo) {

    localStorage.setItem(
        "tema",
        modo
    );

}

// =====================================
// TEXTO BOTÃO
// =====================================

function atualizarBotaoTema() {

    if (!toggleDarkMode) return;

    const darkAtivo =
        document.body.classList.contains(
            "dark-mode"
        );

    toggleDarkMode.textContent =
        darkAtivo
            ? "☀️ Modo Claro"
            : "🌙 Modo Escuro";

}

// =====================================
// ALTERNAR TEMA
// =====================================

function alternarTema() {

    document.body.classList.toggle(
        "dark-mode"
    );

    const darkAtivo =
        document.body.classList.contains(
            "dark-mode"
        );

    salvarTema(
        darkAtivo
            ? "dark"
            : "light"
    );

    atualizarBotaoTema();

}

// =====================================
// EVENTO BOTÃO
// =====================================

if (toggleDarkMode) {

    toggleDarkMode.addEventListener(
        "click",
        alternarTema
    );

}

// =====================================
// INICIALIZAÇÃO
// =====================================

carregarTema();

atualizarBotaoTema();