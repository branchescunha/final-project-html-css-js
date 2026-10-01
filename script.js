const formTarefa = document.getElementById("form-tarefa");
const inputTarefa = document.getElementById("input-tarefa");
const prioridade = document.getElementById("prioridade");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const erroTarefa = document.getElementById("erro-tarefa");
const estadoVazio = document.getElementById("estado-vazio");

let tarefas = [];

formTarefa.addEventListener("submit", adicionarTarefa);

function adicionarTarefa(evento) {
    evento.preventDefault();

    const texto = inputTarefa.value.trim();

    if (texto === "") {
        erroTarefa.textContent = "Digite uma tarefa antes de adicionar.";
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

    inputTarefa.value = "";
    prioridade.value = "media";

    renderizarTarefas();
}

function renderizarTarefas() {
    lista.innerHTML = "";

    tarefas.forEach(tarefa => {
        const item = document.createElement("li");
        item.classList.add("tarefa-item");

        if (tarefa.concluida) {
            item.classList.add("concluida");
        }

        const texto = document.createElement("span");
        texto.classList.add("tarefa-texto");
        texto.textContent = tarefa.texto;

        texto.addEventListener("click", () => {
            alternarTarefa(tarefa.id);
        });

        const prioridadeTarefa = document.createElement("span");
        prioridadeTarefa.classList.add(
            "prioridade",
            tarefa.prioridade
        );

        prioridadeTarefa.textContent = tarefa.prioridade;

        const botaoRemover = document.createElement("button");
        botaoRemover.type = "button";
        botaoRemover.classList.add("btn-remover");
        botaoRemover.textContent = "×";
        botaoRemover.setAttribute(
            "aria-label",
            `Remover tarefa ${tarefa.texto}`
        );

        botaoRemover.addEventListener("click", evento => {
            evento.stopPropagation();
            removerTarefa(tarefa.id);
        });

        item.appendChild(texto);
        item.appendChild(prioridadeTarefa);
        item.appendChild(botaoRemover);

        lista.appendChild(item);
    });

    atualizarContador();
    atualizarEstadoVazio();
}

function alternarTarefa(id) {
    const tarefa = tarefas.find(tarefa => tarefa.id === id);

    if (!tarefa) {
        return;
    }

    tarefa.concluida = !tarefa.concluida;

    renderizarTarefas();
}

function removerTarefa(id) {
    tarefas = tarefas.filter(tarefa => tarefa.id !== id);

    renderizarTarefas();
}

function atualizarContador() {
    const pendentes = tarefas.filter(
        tarefa => !tarefa.concluida
    ).length;

    if (pendentes === 1) {
        contador.textContent = "1 tarefa pendente";
    } else {
        contador.textContent = `${pendentes} tarefas pendentes`;
    }
}

function atualizarEstadoVazio() {
    if (tarefas.length === 0) {
        estadoVazio.style.display = "block";
    } else {
        estadoVazio.style.display = "none";
    }
}

renderizarTarefas();