// =====================================
// TESTE CONSULTORIA V2.1
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
let dadosMigrados = false;

producoes = producoes.map((prod, index) => {

    if (prod.id) return prod;

    dadosMigrados = true;

    return {
        ...prod,
        id: Number(new Date(prod.data || Date.now())) + index
    };

});

if (dadosMigrados) {
    localStorage.setItem(
        "producoes",
        JSON.stringify(producoes)
    );
}

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
// CÁLCULO DE BÔNUS
// =====================================

const LOCAL_PADRAO = "klabin_pr_sp";

const locaisProducao = {
    klabin_pr_sp: {
        nome: "Klabin / Valor IFC-IPC PR/SP",
        unidade: "parcelas",
        tipo: "parcelas",
        grupos: {
            ate2: {
                meta: 6,
                lider: { valores: [18, 39, 62, 88, 115, 142, 169], incremento: 27 },
                auxiliar: { valores: [13, 28, 46, 66, 88, 110, 132], incremento: 22 }
            },
            mais2: {
                meta: 7,
                lider: { valores: [18, 39, 62, 87, 114, 141, 168], incremento: 27 },
                auxiliar: { valores: [13, 28, 45, 64, 85, 106, 127], incremento: 21 }
            }
        }
    },
    klabin_ifc: {
        nome: "Klabin IFC / IPC / SC",
        unidade: "parcelas",
        tipo: "parcelas",
        grupos: {
            ate2: {
                meta: 7,
                lider: { valores: [18, 39, 62, 88, 115, 142, 169], incremento: 27 },
                auxiliar: { valores: [13, 28, 46, 66, 88, 110, 132], incremento: 22 }
            },
            mais2: {
                meta: 9,
                lider: { valores: [18, 39, 62, 87, 114, 141, 168], incremento: 27 },
                auxiliar: { valores: [13, 28, 45, 64, 85, 106, 127], incremento: 21 }
            }
        }
    },
    valor_mg: {
        nome: "Valor MG",
        unidade: "parcelas",
        tipo: "parcelas",
        grupos: {
            ate2: {
                meta: 9,
                lider: { valores: [18, 39, 62, 88, 115, 142, 169, 196, 223, 250, 277], incremento: 27 },
                auxiliar: { valores: [13, 28, 46, 66, 88, 110, 132, 154, 176, 198, 220], incremento: 22 }
            },
            mais2: {
                meta: 10,
                lider: { valores: [18, 39, 62, 87, 114, 141, 168, 195, 222, 249, 276], incremento: 27 },
                auxiliar: { valores: [13, 28, 45, 64, 85, 106, 127, 148, 169, 190, 211], incremento: 21 }
            }
        }
    },
    arauco_ms: {
        nome: "Arauco MS",
        unidade: "parcelas",
        tipo: "parcelas",
        grupos: {
            ate2: {
                meta: 11,
                lider: { valores: [13, 28, 45, 64, 84, 104, 124, 144, 164, 184], incremento: 20 },
                auxiliar: { valores: [8, 18, 30, 44, 59, 74, 89, 104, 119, 134], incremento: 15 }
            },
            mais2: {
                meta: 14,
                lider: { valores: [13, 28, 45, 64, 84, 104, 124, 144, 164, 184], incremento: 20 },
                auxiliar: { valores: [8, 18, 30, 44, 59, 74, 89, 104, 119, 134], incremento: 15 }
            }
        }
    },
    klabin_ls: {
        nome: "Klabin LS",
        unidade: "hectares",
        tipo: "hectares",
        grupos: {
            ate2: {
                meta: 40,
                lider: { faixas: [{ ate: 60, valor: 3.5 }, { ate: 80, valor: 4 }, { ate: Infinity, valor: 5.5 }] },
                auxiliar: { faixas: [{ ate: 60, valor: 2.6 }, { ate: 80, valor: 3.1 }, { ate: Infinity, valor: 3.6 }] }
            },
            mais2: {
                meta: 60,
                lider: { faixas: [{ ate: 75, valor: 3.5 }, { ate: 95, valor: 4 }, { ate: Infinity, valor: 5.5 }] },
                auxiliar: { faixas: [{ ate: 75, valor: 2.6 }, { ate: 95, valor: 3.1 }, { ate: Infinity, valor: 3.6 }] }
            }
        }
    }
};

function formatarMoeda(valor) {

    return "R$ " +
        Number(valor || 0)
            .toFixed(2)
            .replace(".", ",");

}

function obterLocalProducao(local) {

    return locaisProducao[local]
        ? local
        : LOCAL_PADRAO;

}

function obterNomeLocalProducao(local) {

    return locaisProducao[
        obterLocalProducao(local)
    ].nome;

}

function obterUnidadeLocalProducao(local) {

    return locaisProducao[
        obterLocalProducao(local)
    ].unidade;

}

function obterGrupoPessoas(pessoas) {

    return Number(pessoas) > 2
        ? "mais2"
        : "ate2";

}

function obterMetaCalculo(local, pessoas) {

    const config =
        locaisProducao[
            obterLocalProducao(local)
        ];

    return config
        .grupos[
            obterGrupoPessoas(pessoas)
        ]
        .meta;

}

function obterBonusPorTabela(tabela, indice, incremento) {

    if (indice < 0) return 0;

    if (indice < tabela.length) {
        return tabela[indice];
    }

    const ultimoIndice = tabela.length - 1;

    return tabela[ultimoIndice] +
        (indice - ultimoIndice) * incremento;

}

function calcularBonusHectares(total, meta, faixas) {

    if (total <= meta) return 0;

    let inicio = meta;
    let bonus = 0;

    faixas.forEach(faixa => {

        if (total <= inicio) return;

        const hectares =
            Math.min(total, faixa.ate) - inicio;

        if (hectares > 0) {
            bonus += hectares * faixa.valor;
        }

        inicio = faixa.ate;

    });

    return Math.round(bonus * 100) / 100;

}

function calcularBonus(operador, quantidade, pessoas, local = LOCAL_PADRAO) {

    const localKey = obterLocalProducao(local);
    const config = locaisProducao[localKey];
    const grupo = obterGrupoPessoas(pessoas);
    const funcao = operador.funcao === "lider" ? "lider" : "auxiliar";
    const regra = config.grupos[grupo][funcao];
    const meta = config.grupos[grupo].meta;
    const total = Number(quantidade || 0);

    if (config.tipo === "hectares") {
        return calcularBonusHectares(total, meta, regra.faixas);
    }

    return obterBonusPorTabela(
        regra.valores,
        total - (meta + 1),
        regra.incremento
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

const localProducaoSelect =
    document.getElementById(
        "localProducaoSelect"
    );const operadorSelect =
    document.getElementById(
        "operadorSelect"
    );

const parcelasInput =
    document.getElementById(
        "parcelasInput"
    );

const pessoasProducaoInput =
    document.getElementById(
        "pessoasProducaoInput"
    );

const dataProducaoInput =
    document.getElementById(
        "dataProducaoInput"
    );

const previewBonus =
    document.getElementById(
        "previewBonus"
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

function obterDataHojeInput() {

    const hoje = new Date();

    hoje.setMinutes(
        hoje.getMinutes() - hoje.getTimezoneOffset()
    );

    return hoje
        .toISOString()
        .slice(0, 10);

}

function criarDataProducao(dataInput) {

    if (!dataInput) return new Date();

    return new Date(`${dataInput}T12:00:00`);

}

function formatarDataInput(data) {

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return obterDataHojeInput();
    }

    dataObj.setMinutes(
        dataObj.getMinutes() - dataObj.getTimezoneOffset()
    );

    return dataObj
        .toISOString()
        .slice(0, 10);

}

function inicializarDataProducao() {

    if (
        dataProducaoInput &&
        !dataProducaoInput.value
    ) {

        dataProducaoInput.value =
            obterDataHojeInput();

    }

}
function obterOperadorPorId(id) {

    return operadores.find(
        op => op.id === Number(id)
    );

}

function obterMetaProducao(prod, operador) {

    if (prod?.meta) return prod.meta;

    return obterMetaCalculo(
        prod?.local,
        prod?.pessoas || operador?.equipe || 0
    );

}

function atualizarPreviewProducao() {

    if (!previewBonus) return;

    const operador =
        obterOperadorPorId(
            operadorSelect?.value
        );

    const parcelas =
        Number(parcelasInput?.value);

    const pessoas =
        Number(pessoasProducaoInput?.value);

    const local =
        localProducaoSelect?.value ||
        LOCAL_PADRAO;
    if (!operador || !parcelas || !pessoas) {

        previewBonus.textContent =
            "Informe parcelas e pessoas para ver a prévia do valor.";

        previewBonus.classList.remove(
            "preview-bonus-ok"
        );

        return;

    }

    const meta =
        obterMetaCalculo(
            local,
            pessoas
        );

    const bonus =
                calcularBonus(
                    operador,
                    parcelas,
                    pessoas,
                    local
                );

    previewBonus.innerHTML = `
        <strong>Prévia:</strong>
        ${obterNomeLocalProducao(local)} · Meta ${meta} · ${formatarMoeda(bonus)}
    `;

    previewBonus.classList.add(
        "preview-bonus-ok"
    );

}

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
// LANÇAMENTO PRODUÇÃO
// =====================================

if (producaoForm) {

    producaoForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const operadorId =
                Number(
                    operadorSelect?.value
                );

            const local =
                localProducaoSelect?.value ||
                LOCAL_PADRAO;const parcelas =
                Number(
                    parcelasInput?.value
                );

            const pessoas =
                Number(
                    pessoasProducaoInput?.value
                );

            const dataProducao =
                dataProducaoInput?.value ||
                obterDataHojeInput();

            const operador =
                obterOperadorPorId(
                    operadorId
                );

            if (
                !operador ||
                !parcelas ||
                !pessoas
            ) {

                return;

            }

            const meta =
                obterMetaCalculo(
                    local,
                    pessoas
                );

            const bonus =
                calcularBonus(
                    operador,
                    parcelas,
                    pessoas,
                    local
                );

            producoes.push({

                id: Date.now(),

                operadorId,

                local,
                parcelas,

                pessoas,

                meta,

                bonus,

                data:
                    criarDataProducao(
                        dataProducao
                    ).toISOString()

            });

            salvarDados();

            this.reset();

            inicializarDataProducao();

            atualizarSistema();

        }
    );

}

[
    localProducaoSelect,
    operadorSelect,
    parcelasInput,
    pessoasProducaoInput,
    dataProducaoInput
].forEach(campo => {

    campo?.addEventListener(
        "input",
        atualizarPreviewProducao
    );

    campo?.addEventListener(
        "change",
        atualizarPreviewProducao
    );

});

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
                obterOperadorPorId(
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
                    ${obterNomeLocalProducao(prod.local)}
                </td><td>
                    ${prod.parcelas}
                </td>

                <td>
                    ${prod.pessoas || operador?.equipe || "-"}
                </td>

                <td>
                    ${obterMetaProducao(prod, operador)}
                </td>

                <td>
                    ${formatarMoeda(prod.bonus)}
                </td>

                <td>
                    ${data}
                </td>

                <td>
                    <div class="action-buttons">
                        <button
                            class="btn-primary"
                            onclick="editarProducao(${prod.id})">
                            Editar
                        </button>

                        <button
                            class="btn-danger"
                            onclick="removerProducao(${prod.id})">
                            Excluir
                        </button>
                    </div>
                </td>

            </tr>

            `;

        });

}

function removerProducao(id) {

    const confirmar =
        confirm(
            "Deseja excluir este lançamento?"
        );

    if (!confirmar) return;

    producoes =
        producoes.filter(
            prod => prod.id !== id
        );

    salvarDados();

    atualizarSistema();

}

window.removerProducao =
    removerProducao;
function editarProducao(id) {

    const prod =
        producoes.find(
            item => item.id === id
        );

    if (!prod) return;

    const operador =
        obterOperadorPorId(
            prod.operadorId
        );

    if (!operador) {
        alert("Operador não encontrado para este lançamento.");
        return;
    }

    const localAtual =
        obterLocalProducao(prod.local);

    const novoLocal =
        prompt(
            "Local/atividade (klabin_pr_sp, klabin_ifc, valor_mg, arauco_ms, klabin_ls):",
            localAtual
        );

    if (novoLocal === null) return;

    const local =
        obterLocalProducao(
            novoLocal.trim()
        );const novasParcelas =
        prompt(
            obterUnidadeLocalProducao(local) === "hectares"
                ? "Quantidade em hectares:"
                : "Quantidade de parcelas:",
            prod.parcelas
        );

    if (novasParcelas === null) return;

    const novasPessoas =
        prompt(
            "Quantidade de pessoas:",
            prod.pessoas || operador.equipe || ""
        );

    if (novasPessoas === null) return;

    const novaData =
        prompt(
            "Data da produção (AAAA-MM-DD):",
            formatarDataInput(prod.data)
        );

    if (novaData === null) return;

    const parcelas = Number(novasParcelas);
    const pessoas = Number(novasPessoas);

    if (
        !parcelas ||
        !pessoas ||
        !/^\d{4}-\d{2}-\d{2}$/.test(novaData)
    ) {
        alert("Informe quantidade, pessoas e data válidas.");
        return;
    }

    const meta =
        obterMetaCalculo(
            local,
            pessoas
        );

    const bonus =
        calcularBonus(
            operador,
            parcelas,
            pessoas,
            local
        );

    prod.local = local;
    prod.parcelas = parcelas;
    prod.pessoas = pessoas;
    prod.meta = meta;
    prod.bonus = bonus;
    prod.data = criarDataProducao(novaData).toISOString();

    salvarDados();
    atualizarSistema();

}
window.editarProducao =
    editarProducao;
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
            <td colspan="10">
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
                obterOperadorPorId(
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
                    ${obterNomeLocalProducao(prod.local)}
                </td><td>
                    ${prod.parcelas}
                </td>

                <td>
                    ${prod.pessoas || operador?.equipe || "-"}
                </td>

                <td>
                    ${obterMetaProducao(prod, operador)}
                </td>

                <td>
                    ${formatarMoeda(prod.bonus)}
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

                            
                            Local:
                                obterNomeLocalProducao(prod.local),Unidade:
                                obterUnidadeLocalProducao(prod.local),

                            Parcelas:
                                prod.parcelas,

                            Pessoas:
                                prod.pessoas || operador?.equipe || "",

                            Meta:
                                obterMetaProducao(prod, operador),

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
                    "Produção"
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
                "PDF será implementado na V2.2"
            );

        }
    );


// =====================================
// MANUTENÇÃO DOS DADOS
// =====================================

function recalcularProducoes() {

    if (!confirm("Deseja recalcular todos os lançamentos com a regra atual?")) {
        return;
    }

    producoes = producoes.map(prod => {

        const operador =
            obterOperadorPorId(prod.operadorId);

        if (!operador) return prod;

        const local =
            obterLocalProducao(prod.local);

        const pessoas =
            Number(prod.pessoas || operador.equipe || 0);

        const meta =
            obterMetaCalculo(
                local,
                pessoas || operador.equipe || 0
            );

        const bonus =
            calcularBonus(
                operador,
                Number(prod.parcelas || 0),
                pessoas,
                local
            );

        return {
            ...prod,
            local,pessoas: pessoas || prod.pessoas,
            meta,
            bonus
        };

    });

    salvarDados();
    atualizarSistema();

    alert("Produções recalculadas!");

}
function exportarBackup() {

    const dados = {
        versao: "2.1",
        exportadoEm: new Date().toISOString(),
        operadores,
        producoes,
        metas
    };

    const blob =
        new Blob(
            [JSON.stringify(dados, null, 2)],
            { type: "application/json" }
        );

    const link =
        document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "backup-producao.json";
    link.click();

    URL.revokeObjectURL(link.href);

}

function importarBackupArquivo(arquivo) {

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = () => {

        try {

            const dados = JSON.parse(leitor.result);

            if (!Array.isArray(dados.operadores) || !Array.isArray(dados.producoes)) {
                throw new Error("Backup inválido.");
            }

            if (!confirm("Importar este backup vai substituir os dados atuais. Deseja continuar?")) {
                return;
            }

            operadores = dados.operadores;
            producoes = dados.producoes;
            metas = dados.metas || metas;

            salvarDados();
            carregarMetas();
            atualizarSistema();

            alert("Backup importado com sucesso!");

        } catch (erro) {

            alert("Não foi possível importar o backup.");

        }

    };

    leitor.readAsText(arquivo);

}

const btnRecalcular =
    document.getElementById("btnRecalcular");

const btnExportarBackup =
    document.getElementById("btnExportarBackup");

const btnImportarBackup =
    document.getElementById("btnImportarBackup");

const inputImportarBackup =
    document.getElementById("inputImportarBackup");

btnRecalcular
    ?.addEventListener("click", recalcularProducoes);

btnExportarBackup
    ?.addEventListener("click", exportarBackup);

btnImportarBackup
    ?.addEventListener(
        "click",
        () => inputImportarBackup?.click()
    );

inputImportarBackup
    ?.addEventListener(
        "change",
        function () {
            importarBackupArquivo(this.files?.[0]);
            this.value = "";
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

    inicializarDataProducao();

    atualizarPreviewProducao();

}

// =====================================
// INICIALIZAÃ‡ÃƒO
// =====================================

carregarTema();

carregarMetas();

atualizarSistema();
































