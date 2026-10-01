const formTarefa = document.getElementById("form-tarefa");
const inputTarefa = document.getElementById("input-tarefa");
const prioridade = document.getElementById("prioridade");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const erroTarefa = document.getElementById("erro-tarefa");
const estadoVazio = document.getElementById("estado-vazio");

const btnTema = document.getElementById("btn-tema");

const filtros = document.querySelectorAll(".filtro");
const ordenar = document.getElementById("ordenar");

const formContato = document.getElementById("form-contato");
const mensagemContato = document.getElementById("mensagem-contato");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let filtroAtual = "todas";


formTarefa.addEventListener("submit", adicionarTarefa);

btnTema.addEventListener("click", alternarTema);

ordenar.addEventListener("change", renderizarTarefas);

formContato.addEventListener("submit", enviarContato);


filtros.forEach(botao => {
    botao.addEventListener("click", () => {
        filtroAtual = botao.dataset.filtro;

        filtros.forEach(filtro => {
            filtro.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        renderizarTarefas();
    });
});


function adicionarTarefa(evento) {
    evento.preventDefault();

    const texto = inputTarefa.value.trim();

    if (texto === "") {
        erroTarefa.textContent =
            "Digite uma tarefa antes de adicionar.";

        return;
    }

    erroTarefa.textContent = "";

    const novaTarefa = {
        id: Date.now(),
        texto: texto,
        prioridade: prioridade.value,
        concluida: false
    };

    tarefas.push(novaTarefa);

    salvarTarefas();

    inputTarefa.value = "";
    prioridade.value = "media";

    renderizarTarefas();
}


function renderizarTarefas() {
    lista.innerHTML = "";

    let tarefasExibidas = [...tarefas];

    if (filtroAtual === "pendentes") {
        tarefasExibidas = tarefasExibidas.filter(
            tarefa => !tarefa.concluida
        );
    }

    if (filtroAtual === "concluidas") {
        tarefasExibidas = tarefasExibidas.filter(
            tarefa => tarefa.concluida
        );
    }

    if (ordenar.value === "prioridade") {
        const valoresPrioridade = {
            alta: 3,
            media: 2,
            baixa: 1
        };

        tarefasExibidas.sort((a, b) => {
            return (
                valoresPrioridade[b.prioridade] -
                valoresPrioridade[a.prioridade]
            );
        });
    } else {
        tarefasExibidas.sort((a, b) => b.id - a.id);
    }


    tarefasExibidas.forEach(tarefa => {
        const item = document.createElement("li");

        item.classList.add("tarefa-item");

        if (tarefa.concluida) {
            item.classList.add("concluida");
        }


        const texto = document.createElement("span");

        texto.classList.add("tarefa-texto");
        texto.textContent = tarefa.texto;
        texto.title =
            "Clique para concluir. Duplo clique para editar.";


        let tempoClique;

        texto.addEventListener("click", () => {
            clearTimeout(tempoClique);

            tempoClique = setTimeout(() => {
                alternarTarefa(tarefa.id);
            }, 250);
        });


        texto.addEventListener("dblclick", () => {
            clearTimeout(tempoClique);

            editarTarefa(tarefa.id);
        });


        const prioridadeTarefa =
            document.createElement("span");

        prioridadeTarefa.classList.add(
            "prioridade",
            tarefa.prioridade
        );

        prioridadeTarefa.textContent =
            tarefa.prioridade;


        const botaoRemover =
            document.createElement("button");

        botaoRemover.type = "button";

        botaoRemover.classList.add("btn-remover");

        botaoRemover.textContent = "×";

        botaoRemover.setAttribute(
            "aria-label",
            `Remover tarefa ${tarefa.texto}`
        );


        botaoRemover.addEventListener(
            "click",
            evento => {
                evento.stopPropagation();

                removerTarefa(tarefa.id);
            }
        );


        item.appendChild(texto);
        item.appendChild(prioridadeTarefa);
        item.appendChild(botaoRemover);

        lista.appendChild(item);
    });


    atualizarContador();

    atualizarEstadoVazio(tarefasExibidas.length);
}


function alternarTarefa(id) {
    const tarefa = tarefas.find(
        tarefa => tarefa.id === id
    );

    if (!tarefa) {
        return;
    }

    tarefa.concluida = !tarefa.concluida;

    salvarTarefas();

    renderizarTarefas();
}


function removerTarefa(id) {
    tarefas = tarefas.filter(
        tarefa => tarefa.id !== id
    );

    salvarTarefas();

    renderizarTarefas();
}


function editarTarefa(id) {
    const tarefa = tarefas.find(
        tarefa => tarefa.id === id
    );

    if (!tarefa) {
        return;
    }

    const novoTexto = prompt(
        "Edite a tarefa:",
        tarefa.texto
    );

    if (novoTexto === null) {
        return;
    }

    const textoEditado = novoTexto.trim();

    if (textoEditado === "") {
        erroTarefa.textContent =
            "O texto da tarefa não pode ficar vazio.";

        return;
    }

    erroTarefa.textContent = "";

    tarefa.texto = textoEditado;

    salvarTarefas();

    renderizarTarefas();
}


function atualizarContador() {
    const pendentes = tarefas.filter(
        tarefa => !tarefa.concluida
    ).length;

    if (pendentes === 1) {
        contador.textContent =
            "1 tarefa pendente";
    } else {
        contador.textContent =
            `${pendentes} tarefas pendentes`;
    }
}


function atualizarEstadoVazio(quantidadeExibida) {
    if (quantidadeExibida === 0) {
        estadoVazio.style.display = "block";

        if (tarefas.length === 0) {
            estadoVazio.textContent =
                "Nenhuma tarefa cadastrada.";
        } else {
            estadoVazio.textContent =
                "Nenhuma tarefa encontrada neste filtro.";
        }
    } else {
        estadoVazio.style.display = "none";
    }
}


function salvarTarefas() {
    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefas)
    );
}


function alternarTema() {
    document.body.classList.toggle("dark");

    if (
        document.body.classList.contains("dark")
    ) {
        localStorage.setItem(
            "tema",
            "escuro"
        );
    } else {
        localStorage.setItem(
            "tema",
            "claro"
        );
    }

    atualizarBotaoTema();
}


function carregarTema() {
    const temaSalvo =
        localStorage.getItem("tema");

    if (temaSalvo === "escuro") {
        document.body.classList.add("dark");
    }

    atualizarBotaoTema();
}


function atualizarBotaoTema() {
    if (
        document.body.classList.contains("dark")
    ) {
        btnTema.textContent = "☀️";
        btnTema.setAttribute(
            "aria-label",
            "Ativar tema claro"
        );
        btnTema.title = "Ativar tema claro";
    } else {
        btnTema.textContent = "🌙";
        btnTema.setAttribute(
            "aria-label",
            "Ativar tema escuro"
        );
        btnTema.title = "Ativar tema escuro";
    }
}


function enviarContato(evento) {
    evento.preventDefault();

    mensagemContato.textContent =
        "Mensagem enviada com sucesso!";

    formContato.reset();
}


carregarTema();

renderizarTarefas();