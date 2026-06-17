// =====================================
// FORÇA CONSULTORIA V2.1
// PARTE 1
// NUCLEO DO SISTEMA
// =====================================

// LOGIN

const USER = "admin";
const PASS = "admin";

const loginForm = document.getElementById("loginForm");
const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");
const logoutBtn = document.getElementById("logoutBtn");

// =====================================
// DADOS
// =====================================

let operadores =
    JSON.parse(
        localStorage.getItem("operadores")
    ) || [];

let producoes =
    JSON.parse(
        localStorage.getItem("producoes")
    ) || [];

let metas =
    JSON.parse(
        localStorage.getItem("metas")
    ) || {
        diaria: 6,
        semanal: 30
    };

// =====================================
// TABELAS DE BÃ”NUS
// =====================================

const bonusLiderAte2Pessoas = [
    18,
    39,
    62,
    88,
    115,
    142,
    169
];

const bonusAuxiliarAte2Pessoas = [
    13,
    28,
    46,
    66,
    88,
    110,
    132
];

const bonusLiderMaisDe2Pessoas = [
    18,
    39,
    62,
    87,
    114,
    141,
    168
];

const bonusAuxiliarMaisDe2Pessoas = [
    13,
    28,
    45,
    64,
    85,
    106,
    127
];

const incrementoLider = 27;
const incrementoAuxiliar = 22;

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
// LOGIN AUTOMÃTICO
// =====================================

if (
    localStorage.getItem("logged")
    === "true"
) {

    loginPage.style.display = "none";

    dashboard.classList.remove(
        "hidden"
    );

}

// =====================================
// LOGIN
// =====================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const usuario =
                document
                    .getElementById(
                        "username"
                    )
                    .value
                    .trim();

            const senha =
                document
                    .getElementById(
                        "password"
                    )
                    .value
                    .trim();

            if (
                usuario === USER &&
                senha === PASS
            ) {

                localStorage.setItem(
                    "logged",
                    "true"
                );

                location.reload();

            } else {

                alert(
                    "Usuário ou senha inválidos."
                );

            }

        }
    );

}

// =====================================
// LOGOUT
// =====================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "logged"
            );

            location.reload();

        }
    );

}

// =====================================
// MENU
// =====================================

document
    .querySelectorAll(".menu-btn")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".menu-btn"
                    )
                    .forEach(b =>
                        b.classList.remove(
                            "active"
                        )
                    );

                btn.classList.add(
                    "active"
                );

                document
                    .querySelectorAll(
                        ".page"
                    )
                    .forEach(page =>
                        page.classList.remove(
                            "active-page"
                        )
                    );

                const page =
                    document.getElementById(
                        btn.dataset.page
                    );

                if (page) {

                    page.classList.add(
                        "active-page"
                    );

                }

            }
        );

    });

// =====================================
// META DA EQUIPE
// =====================================

function obterMetaEquipe(
    operadorOuEquipe
) {

    const equipe =
        typeof operadorOuEquipe === "object"
            ? operadorOuEquipe.equipe
            : operadorOuEquipe;

    const quantidadePessoas =
        Number(equipe);

    if (
        Number.isFinite(quantidadePessoas) &&
        quantidadePessoas > 0
    ) {

        return quantidadePessoas >= 3
            ? 7
            : 6;

    }

    const equipeNormalizada =
        String(equipe || "")
            .trim()
            .toLowerCase();

    const integrantes =
        operadores.filter(
            op =>
                String(op.equipe || "")
                    .trim()
                    .toLowerCase() ===
                equipeNormalizada
        );

    return integrantes.length >= 3
        ? 7
        : 6;

}

// =====================================
// CÃLCULO DE BÃ”NUS
// =====================================

function obterBonusPorTabela(
    tabela,
    indice,
    incremento
) {

    if (indice < 0) {

        return 0;

    }

    if (indice < tabela.length) {

        return tabela[indice];

    }

    const ultimoIndice =
        tabela.length - 1;

    return tabela[ultimoIndice] +
        (indice - ultimoIndice) *
        incremento;

}

function calcularBonus(
    operador,
    parcelas,
    pessoas
) {

    const meta =
        obterMetaEquipe(
            pessoas || operador
        );

    const quantidadePessoas =
        Number(pessoas || operador.equipe);

    const maisDe2Pessoas =
        Number.isFinite(quantidadePessoas) &&
        quantidadePessoas > 2;

    const indice =
        parcelas -
        (meta + 1);

    if (
        operador.funcao ===
        "lider"
    ) {

        return obterBonusPorTabela(
            maisDe2Pessoas
                ? bonusLiderMaisDe2Pessoas
                : bonusLiderAte2Pessoas,
            indice,
            incrementoLider
        );

    }

    return obterBonusPorTabela(
        maisDe2Pessoas
            ? bonusAuxiliarMaisDe2Pessoas
            : bonusAuxiliarAte2Pessoas,
        indice,
        incrementoAuxiliar
    );

}
// =====================================
// PARTE 2
// OPERADORES E PRODUÃ‡ÃƒO
// =====================================

// FORMULÃRIOS

const operadorForm =
    document.getElementById(
        "operadorForm"
    );

const producaoForm =
    document.getElementById(
        "producaoForm"
    );

// =====================================
// CADASTRAR OPERADOR
// =====================================

if (operadorForm) {

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

            const funcao =
                document
                    .getElementById(
                        "operadorFuncao"
                    )
                    .value;

            const equipe =
                document
                    .getElementById(
                        "operadorEquipe"
                    )
                    .value
                    .trim();

            if (
                !nome ||
                !funcao ||
                !equipe
            ) {

                return;

            }

            operadores.push({

                id: Date.now(),

                nome,

                funcao,

                equipe

            });

            salvarDados();

            this.reset();

            atualizarSistema();

        }
    );

}

// =====================================
// REMOVER OPERADOR
// =====================================

function removerOperador(id) {

    const confirmar =
        confirm(
            "Deseja excluir este operador?"
        );

    if (!confirmar) {

        return;

    }

    operadores =
        operadores.filter(
            op =>
                op.id !== id
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
// RENDER OPERADORES
// =====================================

function renderOperadores() {

    const tabela =
        document.getElementById(
            "operadoresTable"
        );

    if (!tabela) return;

    tabela.innerHTML = "";

    operadores.forEach(op => {

        tabela.innerHTML += `

        <tr>

            <td>${op.nome}</td>

            <td>${op.funcao}</td>

            <td>${op.equipe}</td>

            <td>${obterMetaEquipe(op)}</td>

            <td>

                <button
                    class="btn-primary"
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
                (${op.funcao})

            </option>

            `;

        });

    }

    if (filtro) {

        filtro.innerHTML = `

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
// LANÃ‡AMENTO PRODUÃ‡ÃƒO
// =====================================

if (producaoForm) {

    producaoForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const operadorId =
                Number(
                    document
                        .getElementById(
                            "operadorSelect"
                        )
                        .value
                );

            const parcelas =
                Number(
                    document
                        .getElementById(
                            "parcelasInput"
                        )
                        .value
                );

            const pessoas =
                Number(
                    document
                        .getElementById(
                            "pessoasProducaoInput"
                        )
                        .value
                );

            const operador =
                operadores.find(
                    op =>
                        op.id ===
                        operadorId
                );

            if (
                !operador ||
                !parcelas ||
                !pessoas
            ) {

                return;

            }

            const bonus =
                calcularBonus(
                    operador,
                    parcelas,
                    pessoas
                );

            producoes.push({

                operadorId,

                parcelas,

                pessoas,

                bonus,

                data:
                    new Date()
                        .toISOString()

            });

            salvarDados();

            this.reset();

            atualizarSistema();

        }
    );

}

// =====================================
// TABELA PRODUÃ‡ÃƒO
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
                    ${prod.pessoas || operador?.equipe || "-"}
                </td>

                <td>
                    R$ ${Number(
                    prod.bonus || 0
                ).toFixed(2)}
                </td>

                <td>
                    ${data}
                </td>

            </tr>

            `;

        });

}
// =====================================
// PARTE 3
// DASHBOARD E METAS
// =====================================

let chart;

// =====================================
// PRODUÃ‡ÃƒO HOJE
// =====================================

function calcularProducaoHoje() {

    const hoje =
        new Date().toDateString();

    return producoes
        .filter(prod =>
            new Date(prod.data)
                .toDateString() === hoje
        )
        .reduce(
            (total, prod) =>
                total + prod.parcelas,
            0
        );

}

// =====================================
// PRODUÃ‡ÃƒO SEMANA
// =====================================

function calcularProducaoSemana() {

    const hoje = new Date();

    const inicioSemana =
        new Date(hoje);

    inicioSemana.setDate(
        hoje.getDate() -
        hoje.getDay()
    );

    return producoes
        .filter(prod => {

            const data =
                new Date(prod.data);

            return (
                data >= inicioSemana
            );

        })
        .reduce(
            (total, prod) =>
                total + prod.parcelas,
            0
        );

}

// =====================================
// EXTRA HOJE
// =====================================

function calcularExtraHoje() {

    const hoje =
        new Date().toDateString();

    return producoes
        .filter(prod =>
            new Date(prod.data)
                .toDateString() === hoje
        )
        .reduce(
            (total, prod) =>
                total +
                Number(prod.bonus || 0),
            0
        );

}

// =====================================
// EXTRA SEMANA
// =====================================

function calcularExtraSemana() {

    const hoje = new Date();

    const inicioSemana =
        new Date(hoje);

    inicioSemana.setDate(
        hoje.getDate() -
        hoje.getDay()
    );

    return producoes
        .filter(prod => {

            const data =
                new Date(prod.data);

            return (
                data >= inicioSemana
            );

        })
        .reduce(
            (total, prod) =>
                total +
                Number(prod.bonus || 0),
            0
        );

}

// =====================================
// DASHBOARD
// =====================================

function atualizarDashboard() {

    const totalOperadores =
        operadores.length;

    const hoje =
        calcularProducaoHoje();

    const semana =
        calcularProducaoSemana();

    const extraHoje =
        calcularExtraHoje();

    const extraSemana =
        calcularExtraSemana();

    const totalEl =
        document.getElementById(
            "totalOperadores"
        );

    const hojeEl =
        document.getElementById(
            "producaoHoje"
        );

    const semanaEl =
        document.getElementById(
            "producaoSemana"
        );

    const extraHojeEl =
        document.getElementById(
            "valorExtraHoje"
        );

    const extraSemanaEl =
        document.getElementById(
            "valorExtraSemana"
        );

    if (totalEl)
        totalEl.textContent =
            totalOperadores;

    if (hojeEl)
        hojeEl.textContent =
            hoje;

    if (semanaEl)
        semanaEl.textContent =
            semana;

    if (extraHojeEl)
        extraHojeEl.textContent =
            "R$ " +
            extraHoje.toFixed(2);

    if (extraSemanaEl)
        extraSemanaEl.textContent =
            "R$ " +
            extraSemana.toFixed(2);

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

    if (diaria)
        diaria.value =
            metas.diaria;

    if (semanal)
        semanal.value =
            metas.semanal;

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
                        )
                        .value
                );

            metas.semanal =
                Number(
                    document
                        .getElementById(
                            "metaSemanal"
                        )
                        .value
                );

            salvarDados();

            atualizarMetas();

            alert(
                "Metas salvas!"
            );

        }
    );

}

// =====================================
// METAS
// =====================================

function atualizarMetas() {

    const hoje =
        calcularProducaoHoje();

    const semana =
        calcularProducaoSemana();

    const percDiaria =
        metas.diaria > 0
            ? (hoje / metas.diaria) * 100
            : 0;

    const percSemanal =
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

    const textoDiaria =
        document.getElementById(
            "percentualMetaDiaria"
        );

    const textoSemanal =
        document.getElementById(
            "percentualMetaSemanal"
        );

    if (barraDiaria)
        barraDiaria.style.width =
            Math.min(
                percDiaria,
                100
            ) + "%";

    if (barraSemanal)
        barraSemanal.style.width =
            Math.min(
                percSemanal,
                100
            ) + "%";

    if (textoDiaria)
        textoDiaria.textContent =
            percDiaria.toFixed(0)
            + "%";

    if (textoSemanal)
        textoSemanal.textContent =
            percSemanal.toFixed(0)
            + "%";

}

// =====================================
// GRÃFICO
// =====================================

function atualizarGrafico() {

    if (typeof Chart === "undefined") return;

    const canvas =
        document.getElementById(
            "producaoChart"
        );

    if (!canvas) return;

    const labels = [];
    const valores = [];

    operadores.forEach(op => {

        labels.push(
            op.nome
        );

        const total =
            producoes
                .filter(
                    prod =>
                        prod.operadorId ===
                        op.id
                )
                .reduce(
                    (soma, prod) =>
                        soma +
                        prod.parcelas,
                    0
                );

        valores.push(total);

    });

    if (chart) {

        chart.destroy();

    }

    chart = new Chart(
        canvas,
        {
            type: "bar",

            data: {

                labels,

                datasets: [

                    {
                        label:
                            "Parcelas Produzidas",

                        data:
                            valores

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio:
                    false

            }

        }
    );

}
// =====================================
// PARTE 4
// HISTÃ“RICO
// =====================================

function renderHistorico(
    lista = producoes
) {

    const tabela =
        document.getElementById(
            "historicoTable"
        );

    if (!tabela) return;

    tabela.innerHTML = "";

    if (lista.length === 0) {

        tabela.innerHTML = `
        <tr>
            <td colspan="7">
                Nenhum registro encontrado
            </td>
        </tr>
        `;

        return;

    }

    lista
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
                    ${operador?.equipe || "-"}
                </td>

                <td>
                    ${operador?.nome || "-"}
                </td>

                <td>
                    ${operador?.funcao || "-"}
                </td>

                <td>
                    ${prod.parcelas}
                </td>

                <td>
                    ${prod.pessoas || operador?.equipe || "-"}
                </td>

                <td>
                    R$ ${Number(
                prod.bonus || 0
            ).toFixed(2)}
                </td>

                <td>
                    ${data}
                </td>

            </tr>

            `;

        });

}

// =====================================
// FILTROS
// =====================================

function filtrarHistorico() {

    let resultado =
        [...producoes];

    const operadorId =
        document.getElementById(
            "filtroOperador"
        )?.value;

    const dataInicial =
        document.getElementById(
            "filtroDataInicial"
        )?.value;

    const dataFinal =
        document.getElementById(
            "filtroDataFinal"
        )?.value;

    if (operadorId) {

        resultado =
            resultado.filter(
                p =>
                    p.operadorId ===
                    Number(
                        operadorId
                    )
            );

    }

    if (dataInicial) {

        resultado =
            resultado.filter(
                p =>
                    new Date(
                        p.data
                    ) >=
                    new Date(
                        dataInicial
                    )
            );

    }

    if (dataFinal) {

        const fim =
            new Date(
                dataFinal
            );

        fim.setHours(
            23,
            59,
            59,
            999
        );

        resultado =
            resultado.filter(
                p =>
                    new Date(
                        p.data
                    ) <= fim
            );

    }

    renderHistorico(
        resultado
    );

}

document
    .getElementById(
        "btnFiltrar"
    )
    ?.addEventListener(
        "click",
        filtrarHistorico
    );

// =====================================
// DARK MODE
// =====================================

const toggleDarkMode =
    document.getElementById(
        "toggleDarkMode"
    );

function atualizarBotaoTema() {

    if (!toggleDarkMode) return;

    const dark =
        document.body
            .classList.contains(
                "dark-theme"
            );

    toggleDarkMode.textContent =
        dark
            ? "Desativar"
            : "Ativar";

}

function carregarTema() {

    const tema =
        localStorage.getItem(
            "tema"
        );

    if (
        tema === "dark"
    ) {

        document.body
            .classList.add(
                "dark-theme"
            );

    }

    atualizarBotaoTema();

}

function alternarTema() {

    document.body
        .classList.toggle(
            "dark-theme"
        );

    const dark =
        document.body
            .classList.contains(
                "dark-theme"
            );

    localStorage.setItem(
        "tema",
        dark
            ? "dark"
            : "light"
    );

    atualizarBotaoTema();

}

toggleDarkMode
    ?.addEventListener(
        "click",
        alternarTema
    );

// =====================================
// EXPORTAR EXCEL
// =====================================

const btnExcel =
    document.getElementById(
        "btnExcel"
    );

if (btnExcel) {

    btnExcel.addEventListener(
        "click",
        () => {

            const dados =
                producoes.map(
                    prod => {

                        const operador =
                            operadores.find(
                                op =>
                                    op.id ===
                                    prod.operadorId
                            );

                        return {

                            Data:
                                new Date(
                                    prod.data
                                ).toLocaleDateString(
                                    "pt-BR"
                                ),

                            Equipe:
                                operador?.equipe || "",

                            Operador:
                                operador?.nome || "",

                            Funcao:
                                operador?.funcao || "",

                            Parcelas:
                                prod.parcelas,

                            Pessoas:
                                prod.pessoas || operador?.equipe || "",

                            Bonus:
                                prod.bonus || 0

                        };

                    });

            const ws =
                XLSX.utils
                    .json_to_sheet(
                        dados
                    );

            const wb =
                XLSX.utils
                    .book_new();

            XLSX.utils
                .book_append_sheet(
                    wb,
                    ws,
                    "ProduÃ§Ã£o"
                );

            XLSX.writeFile(
                wb,
                "Relatorio_Producao.xlsx"
            );

        }
    );

}

// =====================================
// PDF FUTURO
// =====================================

document
    .getElementById(
        "btnPDF"
    )
    ?.addEventListener(
        "click",
        () => {

            alert(
                "PDF serÃ¡ implementado na V2.2"
            );

        }
    );

// =====================================
// ATUALIZA SISTEMA
// =====================================

function atualizarSistema() {

    renderOperadores();

    renderSelectOperadores();

    renderProducoes();

    renderHistorico();

    atualizarDashboard();

    atualizarMetas();

    atualizarGrafico();

}

// =====================================
// INICIALIZAÃ‡ÃƒO
// =====================================

carregarTema();

carregarMetas();

atualizarSistema();








