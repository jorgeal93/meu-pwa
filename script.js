// =====================================
// GPF - GESTAO DE PRODUCAO FLORESTAL V2.1
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
const appModal = document.getElementById("appModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalActions = document.getElementById("modalActions");
const modalClose = document.getElementById("modalClose");

let modalResolver = null;

function escapeHtml(valor) {

    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

function fecharModal(valor = null) {

    if (!appModal) return;

    appModal.classList.add("hidden");
    modalBody.replaceChildren();
    modalActions.replaceChildren();

    if (modalResolver) {
        const resolver = modalResolver;
        modalResolver = null;
        resolver(valor);
    }

}

function abrirModalBase(titulo) {

    if (!appModal || !modalTitle || !modalBody || !modalActions) {
        return false;
    }

    modalTitle.textContent = titulo;
    modalBody.replaceChildren();
    modalActions.replaceChildren();
    appModal.classList.remove("hidden");

    return true;

}

function criarBotaoModal(texto, classe, acao) {

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = classe;
    botao.textContent = texto;
    botao.addEventListener("click", acao);
    return botao;

}

function appAlert(mensagem, titulo = "Aviso") {

    return new Promise(resolve => {

        if (!abrirModalBase(titulo)) {
            console.warn(mensagem);
            resolve();
            return;
        }

        modalResolver = resolve;

        const texto = document.createElement("p");
        texto.textContent = mensagem;
        modalBody.appendChild(texto);

        modalActions.appendChild(
            criarBotaoModal(
                "Entendi",
                "btn-primary",
                () => fecharModal()
            )
        );

    });

}

function appConfirm(mensagem, titulo = "Confirmar") {

    return new Promise(resolve => {

        if (!abrirModalBase(titulo)) {
            console.warn(mensagem);
            resolve(false);
            return;
        }

        modalResolver = resolve;

        const texto = document.createElement("p");
        texto.textContent = mensagem;
        modalBody.appendChild(texto);

        modalActions.append(
            criarBotaoModal(
                "Cancelar",
                "btn-secondary",
                () => fecharModal(false)
            ),
            criarBotaoModal(
                "Confirmar",
                "btn-primary",
                () => fecharModal(true)
            )
        );

    });

}

function criarCampoModal(campo, valores) {

    const wrapper = document.createElement("div");
    wrapper.className = "form-field";

    const label = document.createElement("label");
    label.htmlFor = campo.id;
    label.textContent = campo.label;
    wrapper.appendChild(label);

    let input;

    if (campo.type === "select") {

        input = document.createElement("select");

        campo.options.forEach(opcao => {
            const option = document.createElement("option");
            option.value = opcao.value;
            option.textContent = opcao.label;
            input.appendChild(option);
        });

    } else {

        input = document.createElement("input");
        input.type = campo.type || "text";

        if (campo.min !== undefined) input.min = campo.min;
        if (campo.step !== undefined) input.step = campo.step;

    }

    input.id = campo.id;
    input.name = campo.name;
    input.required = campo.required !== false;
    input.value = valores[campo.name] ?? "";
    wrapper.appendChild(input);

    return wrapper;

}

function appFormModal({ titulo, campos, valores = {}, textoSalvar = "Salvar" }) {

    return new Promise(resolve => {

        if (!abrirModalBase(titulo)) {
            resolve(null);
            return;
        }

        modalResolver = resolve;

        const form = document.createElement("form");
        form.className = "modal-form";

        campos.forEach(campo => {
            form.appendChild(
                criarCampoModal(campo, valores)
            );
        });

        form.addEventListener("submit", event => {
            event.preventDefault();

            const resultado = {};

            campos.forEach(campo => {
                resultado[campo.name] =
                    form.elements[campo.name]?.value?.trim() || "";
            });

            fecharModal(resultado);
        });

        modalBody.appendChild(form);

        modalActions.append(
            criarBotaoModal(
                "Cancelar",
                "btn-secondary",
                () => fecharModal(null)
            ),
            criarBotaoModal(
                textoSalvar,
                "btn-primary",
                () => form.requestSubmit()
            )
        );

    });

}

modalClose?.addEventListener("click", () => fecharModal(null));
appModal?.addEventListener("click", event => {
    if (event.target === appModal) fecharModal(null);
});
document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        appModal &&
        !appModal.classList.contains("hidden")
    ) {
        fecharModal(null);
    }
});

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
// TABELAS DE BONUS
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

    localStorage.setItem(
        "gpfUltimaAlteracao",
        new Date().toISOString()
    );

}

// =====================================
// LOGIN AUTOMATICO
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
        async function (e) {

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

                await appAlert(
                    "Usuário ou senha inválidos.",
                    "Acesso negado"
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
                auxiliar: { valores: [8, 18, 30, 44, 59, 74, 67, 85, 115, 134], incremento: 19 }
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
// OPERADORES E PRODUCAO
// =====================================

// FORMULARIOS

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
    ); const operadorSelect =
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

const dataOperadorInput =
    document.getElementById(
        "operadorData"
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
        async function (e) {

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

            const dataOperador =
                dataOperadorInput?.value ||
                obterDataHojeInput();

            if (
                !nome ||
                !funcao ||
                !equipe ||
                !/^\d{4}-\d{2}-\d{2}$/.test(dataOperador)
            ) {

                return;

            }

            operadores.push({

                id: Date.now(),

                nome,

                funcao,

                equipe,

                dataCadastro:
                    criarDataProducao(
                        dataOperador
                    ).toISOString()

            });

            salvarDados();

            this.reset();

            inicializarDataOperador();

            atualizarSistema();

        }
    );

}

// =====================================
// REMOVER OPERADOR
// =====================================

async function removerOperador(id) {

    const confirmar =
        await appConfirm(
            "Deseja excluir este operador? As produções dele também serão removidas.",
            "Excluir operador"
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
// EDITAR OPERADOR
// =====================================

async function editarOperador(id) {

    const operador =
        operadores.find(
            op => op.id === id
        );

    if (!operador) return;

    const dados =
        await appFormModal({
            titulo: "Editar operador",
            textoSalvar: "Salvar operador",
            valores: {
                nome: operador.nome,
                funcao: operador.funcao,
                equipe: operador.equipe,
                data: formatarDataInput(
                    operador.dataCadastro
                )
            },
            campos: [
                {
                    name: "nome",
                    id: "modalOperadorNome",
                    label: "Nome",
                    type: "text"
                },
                {
                    name: "funcao",
                    id: "modalOperadorFuncao",
                    label: "Função",
                    type: "select",
                    options: [
                        { value: "lider", label: "Lider" },
                        { value: "auxiliar", label: "Auxiliar" }
                    ]
                },
                {
                    name: "equipe",
                    id: "modalOperadorEquipe",
                    label: "Pessoas",
                    type: "number",
                    min: "1",
                    step: "1"
                },
                {
                    name: "data",
                    id: "modalOperadorData",
                    label: "Data",
                    type: "date"
                }
            ]
        });

    if (!dados) return;

    const nome =
        dados.nome.trim();

    const funcao =
        dados.funcao.trim().toLowerCase();

    const equipe =
        Number(dados.equipe);

    if (
        !nome ||
        !["lider", "auxiliar"].includes(funcao) ||
        !equipe ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dados.data)
    ) {
        await appAlert(
            "Informe nome, função, pessoas e data válidos.",
            "Dados inválidos"
        );
        return;
    }

    operador.nome = nome;
    operador.funcao = funcao;
    operador.equipe = String(equipe);
    operador.dataCadastro = criarDataProducao(dados.data).toISOString();

    salvarDados();
    atualizarSistema();

}

window.editarOperador =
    editarOperador;

function formatarFuncaoOperador(funcao) {

    if (funcao === "lider") {
        return "Lider";
    }

    if (funcao === "auxiliar") {
        return "Auxiliar";
    }

    return funcao || "-";

}

function criarCelulaTexto(texto) {

    const td = document.createElement("td");
    td.textContent = texto ?? "-";
    return td;

}

function criarCelulaElemento(elemento) {

    const td = document.createElement("td");
    td.appendChild(elemento);
    return td;

}

function criarBadgeFuncao(funcao) {

    const span = document.createElement("span");

    if (funcao === "lider") {
        span.className = "badge-lider";
        span.textContent = "Lider";
        return span;
    }

    if (funcao === "auxiliar") {
        span.className = "badge-auxiliar";
        span.textContent = "Auxiliar";
        return span;
    }

    span.textContent = funcao || "-";
    return span;

}

function criarBotaoAcao(texto, classe, acao) {

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = classe;
    botao.textContent = texto;
    botao.addEventListener("click", acao);
    return botao;

}

function criarCelulaAcoes(acoes) {

    const td = document.createElement("td");
    const wrapper = document.createElement("div");
    wrapper.className = "action-buttons";

    acoes.forEach(acao => {
        wrapper.appendChild(
            criarBotaoAcao(
                acao.texto,
                acao.classe,
                acao.evento
            )
        );
    });

    td.appendChild(wrapper);
    return td;

}

function criarLinhaMensagem(colunas, mensagem) {

    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = colunas;
    td.textContent = mensagem;
    tr.appendChild(td);
    return tr;

}

// =====================================
// RENDER OPERADORES
// =====================================

function renderOperadores() {

    const tabela =
        document.getElementById(
            "operadoresTable"
        );

    if (!tabela) return;

    tabela.replaceChildren();

    operadores.forEach(op => {

        const tr = document.createElement("tr");
        const data = formatarDataTabela(op.dataCadastro);

        tr.append(
            criarCelulaTexto(op.nome),
            criarCelulaElemento(criarBadgeFuncao(op.funcao)),
            criarCelulaTexto(op.equipe),
            criarCelulaTexto(data),
            criarCelulaAcoes([
                {
                    texto: "Editar",
                    classe: "btn-primary",
                    evento: () => editarOperador(op.id)
                },
                {
                    texto: "Excluir",
                    classe: "btn-danger",
                    evento: () => removerOperador(op.id)
                }
            ])
        );

        tabela.appendChild(tr);

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

function formatarDataTabela(data) {

    if (!data) return "-";

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return "-";
    }

    return dataObj.toLocaleDateString(
        "pt-BR"
    );

}

function inicializarDataOperador() {

    if (
        dataOperadorInput &&
        !dataOperadorInput.value
    ) {

        dataOperadorInput.value =
            obterDataHojeInput();

    }

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

    const destaque = document.createElement("strong");
    destaque.textContent = "Prévia:";

    previewBonus.replaceChildren(
        destaque,
        document.createTextNode(
            ` ${obterNomeLocalProducao(local)} · Meta ${meta} · ${formatarMoeda(bonus)}`
        )
    );

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

        select.replaceChildren();

        operadores.forEach(op => {

            const option = document.createElement("option");
            option.value = op.id;
            option.textContent = `${op.nome} (${op.funcao})`;
            select.appendChild(option);

        });

    }

    if (filtro) {

        filtro.replaceChildren();

        const todos = document.createElement("option");
        todos.value = "";
        todos.textContent = "Todos Operadores";
        filtro.appendChild(todos);

        operadores.forEach(op => {

            const option = document.createElement("option");
            option.value = op.id;
            option.textContent = op.nome;
            filtro.appendChild(option);

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
                LOCAL_PADRAO; const parcelas =
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

    tabela.replaceChildren();

    producoes
        .slice()
        .reverse()
        .forEach(prod => {

            const operador =
                obterOperadorPorId(
                    prod.operadorId
                );

            const data =
                formatarDataTabela(
                    prod.data
                );

            const tr = document.createElement("tr");

            tr.append(
                criarCelulaTexto(operador ? operador.nome : "-"),
                criarCelulaTexto(obterNomeLocalProducao(prod.local)),
                criarCelulaTexto(prod.parcelas),
                criarCelulaTexto(prod.pessoas || operador?.equipe || "-"),
                criarCelulaTexto(obterMetaProducao(prod, operador)),
                criarCelulaTexto(formatarMoeda(prod.bonus)),
                criarCelulaTexto(data),
                criarCelulaAcoes([
                    {
                        texto: "Editar",
                        classe: "btn-primary",
                        evento: () => editarProducao(prod.id)
                    },
                    {
                        texto: "Excluir",
                        classe: "btn-danger",
                        evento: () => removerProducao(prod.id)
                    }
                ])
            );

            tabela.appendChild(tr);

        });

}

async function removerProducao(id) {

    const confirmar =
        await appConfirm(
            "Deseja excluir este lançamento?",
            "Excluir produção"
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
async function editarProducao(id) {

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
        await appAlert(
            "Operador não encontrado para este lançamento.",
            "Não foi possível editar"
        );
        return;
    }

    const localAtual =
        obterLocalProducao(prod.local);

    const dados =
        await appFormModal({
            titulo: "Editar produção",
            textoSalvar: "Salvar produção",
            valores: {
                local: localAtual,
                quantidade: prod.parcelas,
                pessoas: prod.pessoas || operador.equipe || "",
                data: formatarDataInput(prod.data)
            },
            campos: [
                {
                    name: "local",
                    id: "modalProducaoLocal",
                    label: "Local/Atividade",
                    type: "select",
                    options: Object.entries(locaisProducao)
                        .map(([value, config]) => ({
                            value,
                            label: config.nome
                        }))
                },
                {
                    name: "quantidade",
                    id: "modalProducaoQuantidade",
                    label: "Quantidade",
                    type: "number",
                    min: "0.01",
                    step: "0.01"
                },
                {
                    name: "pessoas",
                    id: "modalProducaoPessoas",
                    label: "Pessoas",
                    type: "number",
                    min: "1",
                    step: "1"
                },
                {
                    name: "data",
                    id: "modalProducaoData",
                    label: "Data",
                    type: "date"
                }
            ]
        });

    if (!dados) return;

    const local =
        obterLocalProducao(dados.local);

    const parcelas = Number(dados.quantidade);
    const pessoas = Number(dados.pessoas);

    if (
        !parcelas ||
        !pessoas ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dados.data)
    ) {
        await appAlert(
            "Informe quantidade, pessoas e data válidas.",
            "Dados inválidos"
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

    prod.local = local;
    prod.parcelas = parcelas;
    prod.pessoas = pessoas;
    prod.meta = meta;
    prod.bonus = bonus;
    prod.data = criarDataProducao(dados.data).toISOString();

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
// PRODUCAO HOJE
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
// PRODUCAO SEMANA
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
        async function (e) {

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

            await appAlert(
                "Metas salvas!",
                "Configuração atualizada"
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
// GRAFICO
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
// HISTORICO
// =====================================

function renderHistorico(
    lista = producoes
) {

    const tabela =
        document.getElementById(
            "historicoTable"
        );

    if (!tabela) return;

    tabela.replaceChildren();

    if (lista.length === 0) {

        tabela.appendChild(
            criarLinhaMensagem(
                9,
                "Nenhum registro encontrado"
            )
        );

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
                formatarDataTabela(
                    prod.data
                );

            const tr = document.createElement("tr");

            tr.append(
                criarCelulaTexto(operador?.equipe || "-"),
                criarCelulaTexto(operador?.nome || "-"),
                criarCelulaTexto(formatarFuncaoOperador(operador?.funcao)),
                criarCelulaTexto(obterNomeLocalProducao(prod.local)),
                criarCelulaTexto(prod.parcelas),
                criarCelulaTexto(prod.pessoas || operador?.equipe || "-"),
                criarCelulaTexto(obterMetaProducao(prod, operador)),
                criarCelulaTexto(formatarMoeda(prod.bonus)),
                criarCelulaTexto(data)
            );

            tabela.appendChild(tr);

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
    document.getElementById("toggleDarkMode");

const iconeTema =
    document.getElementById("iconeTema");

const textoTema =
    document.getElementById("textoTema");

function atualizarBotaoTema() {

    if (!toggleDarkMode) return;

    const dark =
        document.body.classList.contains("dark-theme");

    if (iconeTema && textoTema) {

        iconeTema.textContent =
            dark ? "☀️" : "🌙";

        textoTema.textContent =
            dark ? "Ativar modo claro" : "Ativar modo escuro";

    } else {

        toggleDarkMode.textContent =
            dark ? "☀️ Ativar modo claro" : "🌙 Ativar modo escuro";

    }

}

function carregarTema() {

    const tema =
        localStorage.getItem("tema");

    if (tema === "dark" || tema === "escuro") {

        document.body.classList.add("dark-theme");

    } else {

        document.body.classList.remove("dark-theme");

    }

    atualizarBotaoTema();

}

function alternarTema() {

    document.body.classList.toggle("dark-theme");

    const dark =
        document.body.classList.contains("dark-theme");

    localStorage.setItem(
        "tema",
        dark ? "dark" : "light"
    );

    atualizarBotaoTema();

}

toggleDarkMode
    ?.addEventListener("click", alternarTema);

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
                                obterNomeLocalProducao(prod.local), Unidade:
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
// EXPORTAR PDF
// =====================================

const btnPdf =
    document.getElementById(
        "btnPdf"
    );

function obterDadosRelatorioProducao() {

    return producoes
        .slice()
        .sort(
            (a, b) =>
                new Date(a.data) -
                new Date(b.data)
        )
        .map(prod => {

            const operador =
                obterOperadorPorId(
                    prod.operadorId
                );

            return {
                data:
                    formatarDataTabela(
                        prod.data
                    ),
                equipe:
                    operador?.equipe || "-",
                operador:
                    operador?.nome || "-",
                funcao:
                    formatarFuncaoOperador(
                        operador?.funcao
                    ),
                local:
                    obterNomeLocalProducao(
                        prod.local
                    ),
                producao:
                    String(
                        prod.parcelas ?? "-"
                    ),
                pessoas:
                    String(
                        prod.pessoas ||
                        operador?.equipe ||
                        "-"
                    ),
                meta:
                    String(
                        obterMetaProducao(
                            prod,
                            operador
                        )
                    ),
                bonus:
                    formatarMoeda(
                        prod.bonus
                    )
            };

        });

}

function somarProducaoRelatorio() {

    return producoes.reduce(
        (total, prod) =>
            total + Number(prod.parcelas || 0),
        0
    );

}

function somarExtraRelatorio() {

    return producoes.reduce(
        (total, prod) =>
            total + Number(prod.bonus || 0),
        0
    );

}

function textoPdf(doc, texto, x, y, largura) {

    const linhas =
        doc.splitTextToSize(
            String(texto ?? "-"),
            largura
        );

    doc.text(linhas, x, y);

    return linhas.length;

}

function desenharCabecalhoTabelaPdf(doc, colunas, margem, y) {

    doc.setFillColor(21, 63, 43);
    doc.setTextColor(255, 255, 255);
    doc.setDrawColor(217, 228, 220);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    let x = margem;

    colunas.forEach(coluna => {

        doc.rect(
            x,
            y,
            coluna.largura,
            8,
            "FD"
        );

        doc.text(
            coluna.titulo,
            x + 2,
            y + 5.2
        );

        x += coluna.largura;

    });

    return y + 8;

}

function normalizarTextoPdf(valor) {

    return String(valor ?? "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[–—]/g, "-")
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/\s+/g, " ")
        .trim() || "-";

}

function desenharTituloPdf(doc, margem, y) {

    doc.setTextColor(20, 37, 27);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(
        "GPF | Relatorio de Producao Florestal",
        margem,
        y
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(97, 112, 100);
    doc.text(
        `Gerado em ${new Date().toLocaleString("pt-BR")}`,
        margem,
        y + 7
    );

    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 37, 27);
    doc.text(
        `Lancamentos: ${producoes.length}`,
        margem,
        y + 16
    );
    doc.text(
        `Producao total: ${somarProducaoRelatorio()}`,
        margem + 48,
        y + 16
    );
    doc.text(
        `Valor extra total: ${formatarMoeda(somarExtraRelatorio())}`,
        margem + 104,
        y + 16
    );

}

function adicionarRodapePdf(doc, margem) {

    const larguraPagina =
        doc.internal.pageSize.getWidth();
    const alturaPagina =
        doc.internal.pageSize.getHeight();
    const totalPaginas =
        doc.internal.getNumberOfPages();

    for (let pagina = 1; pagina <= totalPaginas; pagina += 1) {

        doc.setPage(pagina);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(97, 112, 100);
        doc.text(
            `Pagina ${pagina} de ${totalPaginas}`,
            larguraPagina - margem,
            alturaPagina - 6,
            { align: "right" }
        );

    }

}

function gerarPdfFallbackSimples(doc, linhas, margem) {

    const larguraPagina =
        doc.internal.pageSize.getWidth();
    const alturaPagina =
        doc.internal.pageSize.getHeight();
    const limiteInferior =
        alturaPagina - 18;
    const larguraCard =
        larguraPagina - margem * 2;

    let y = 44;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(21, 63, 43);
    doc.rect(margem, y, larguraCard, 8, "F");
    doc.text("Lancamentos", margem + 3, y + 5.5);
    y += 10;

    linhas.forEach((linha, indice) => {

        if (y + 18 > limiteInferior) {
            doc.addPage();
            y = 14;
        }

        doc.setFillColor(
            indice % 2 === 0 ? 247 : 255,
            indice % 2 === 0 ? 250 : 255,
            indice % 2 === 0 ? 246 : 255
        );
        doc.setDrawColor(217, 228, 220);
        doc.rect(margem, y, larguraCard, 17, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.8);
        doc.setTextColor(20, 37, 27);
        doc.text(
            normalizarTextoPdf(
                `${linha.data} | ${linha.operador} | ${linha.local}`
            ),
            margem + 3,
            y + 5.3
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.4);
        doc.text(
            normalizarTextoPdf(
                `Funcao: ${linha.funcao} | Producao: ${linha.producao} | Pessoas: ${linha.pessoas} | Meta: ${linha.meta} | Extra: ${linha.bonus}`
            ),
            margem + 3,
            y + 12
        );

        y += 19;

    });

}

async function gerarPdfRelatorio() {

    if (producoes.length === 0) {

        await appAlert(
            "Não existem lançamentos para gerar o PDF.",
            "Relatório vazio"
        );

        return;

    }

    const JsPdf =
        window.jspdf?.jsPDF;

    if (!JsPdf) {

        await appAlert(
            "A biblioteca de PDF não carregou. Verifique a internet e atualize a página.",
            "PDF indisponível"
        );

        return;

    }

    const doc =
        new JsPdf({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

    const margem = 10;
    const linhas =
        obterDadosRelatorioProducao();

    doc.setProperties({
        title: "Relatorio de Producao - GPF"
    });

    desenharTituloPdf(doc, margem, 14);

    const cabecalho = [
        "Data",
        "Equipe",
        "Operador",
        "Funcao",
        "Local",
        "Producao",
        "Pessoas",
        "Meta",
        "Extra"
    ];

    const corpo =
        linhas.map(linha => [
            linha.data,
            linha.equipe,
            linha.operador,
            linha.funcao,
            linha.local,
            linha.producao,
            linha.pessoas,
            linha.meta,
            linha.bonus
        ].map(normalizarTextoPdf));

    if (typeof doc.autoTable === "function") {

        doc.autoTable({
            startY: 42,
            head: [cabecalho],
            body: corpo,
            theme: "grid",
            margin: {
                left: margem,
                right: margem,
                bottom: 14
            },
            tableWidth: "wrap",
            styles: {
                font: "helvetica",
                fontSize: 7.1,
                cellPadding: 1.6,
                overflow: "linebreak",
                valign: "middle",
                textColor: [20, 37, 27],
                lineColor: [217, 228, 220],
                lineWidth: 0.15
            },
            headStyles: {
                fillColor: [21, 63, 43],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                halign: "left"
            },
            alternateRowStyles: {
                fillColor: [247, 250, 246]
            },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 16 },
                2: { cellWidth: 36 },
                3: { cellWidth: 20 },
                4: { cellWidth: 58 },
                5: { cellWidth: 24, halign: "right" },
                6: { cellWidth: 20, halign: "right" },
                7: { cellWidth: 16, halign: "right" },
                8: { cellWidth: 28, halign: "right" }
            }
        });

    } else {

        gerarPdfFallbackSimples(
            doc,
            linhas,
            margem
        );

    }

    adicionarRodapePdf(doc, margem);

    doc.save("Relatorio_Producao_GPF.pdf");

}

btnPdf
    ?.addEventListener(
        "click",
        gerarPdfRelatorio
    );

// =====================================
// MANUTENÇÃO DOS DADOS
// =====================================

async function recalcularProducoes() {

    if (
        !await appConfirm(
            "Deseja recalcular todos os lançamentos com a regra atual?",
            "Recalcular produções"
        )
    ) {
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
            local, pessoas: pessoas || prod.pessoas,
            meta,
            bonus
        };

    });

    salvarDados();
    atualizarSistema();

    await appAlert(
        "Produções recalculadas!",
        "Tudo certo"
    );

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

    localStorage.setItem(
        "gpfUltimoBackup",
        new Date().toISOString()
    );

    atualizarStatusBackup();

}

function importarBackupArquivo(arquivo) {

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = async () => {

        try {

            const dados = JSON.parse(leitor.result);

            if (!Array.isArray(dados.operadores) || !Array.isArray(dados.producoes)) {
                throw new Error("Backup inválido.");
            }

            if (
                !await appConfirm(
                    "Importar este backup vai substituir os dados atuais. Deseja continuar?",
                    "Importar backup"
                )
            ) {
                return;
            }

            operadores = dados.operadores;
            producoes = dados.producoes;
            metas = dados.metas || metas;

            salvarDados();
            carregarMetas();
            atualizarSistema();

            await appAlert(
                "Backup importado com sucesso!",
                "Dados restaurados"
            );

        } catch (erro) {

            await appAlert(
                "Não foi possível importar o backup.",
                "Erro no backup"
            );

        }

    };

    leitor.readAsText(arquivo);

}

function formatarDataHora(dataIso) {

    if (!dataIso) return "";

    const data = new Date(dataIso);

    if (Number.isNaN(data.getTime())) return "";

    return data.toLocaleString(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );

}

function atualizarStatusBackup() {

    const status =
        document.getElementById("backupStatus");

    if (!status) return;

    const ultimoBackup =
        localStorage.getItem("gpfUltimoBackup");

    const ultimaAlteracao =
        localStorage.getItem("gpfUltimaAlteracao");

    if (!ultimoBackup) {
        status.textContent =
            "Nenhum backup exportado ainda. Exporte um backup para proteger seus dados.";
        return;
    }

    const backupData = new Date(ultimoBackup);
    const alteracaoData = new Date(ultimaAlteracao || ultimoBackup);

    if (alteracaoData > backupData) {
        status.textContent =
            `Último backup: ${formatarDataHora(ultimoBackup)}. Existem alterações depois dele.`;
        return;
    }

    status.textContent =
        `Último backup: ${formatarDataHora(ultimoBackup)}. Dados protegidos.`;

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

    inicializarDataOperador();

    inicializarDataProducao();

    atualizarPreviewProducao();

    atualizarStatusBackup();

}

// =====================================
// INICIALIZACAO
// =====================================

carregarTema();

carregarMetas();

atualizarSistema();































