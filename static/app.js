const todoList = document.getElementById("todo-list");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");

function callApi(url, options = {}) {
  const defaults = {
    headers: { "Content-Type": "application/json" },
  };
  const opts = Object.assign({}, defaults, options);
  return fetch(url, opts).then((response) => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return response.json();
  });
}

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.dataset.id = todo.id;
  if (todo.done) li.classList.add("done");

  const span = document.createElement("span");
  span.textContent = todo.text;
  li.appendChild(span);

  // Botão para alternar estado
  const toggleButton = document.createElement("button");
  toggleButton.textContent = todo.done ? "↺" : "✓";
  toggleButton.title = "Concluir/Reabrir tarefa";
  toggleButton.addEventListener("click", () => {
    toggleTodoDone(todo.id, !todo.done);
  });
  li.appendChild(toggleButton);

  // Botão para adicionar nota
  const noteButton = document.createElement("button");
  noteButton.innerHTML = "📝";
  noteButton.title = "Adicionar nota";
  noteButton.addEventListener("click", () => {
    const note = prompt("Escreve a nota:");
    if (note && note.trim().length > 0) {
      addNote(todo.id, note.trim());
    }
  });
  li.appendChild(noteButton);

  // Botão para apagar tarefa
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑️";
  deleteButton.title = "Apagar tarefa";
  deleteButton.addEventListener("click", () => {
    if (confirm("Apagar esta tarefa?")) {
      deleteTodo(todo.id);
    }
  });
  li.appendChild(deleteButton);

  // Sub-lista de notas
  const notesContainer = document.createElement("div");
  notesContainer.classList.add("note-list");

  const notesTitle = document.createElement("div");
  notesTitle.textContent = "Notas:";
  notesTitle.style.fontWeight = "bold";
  notesTitle.style.borderTop = "1px dotted #ccc";
  notesTitle.style.paddingTop = "0.5rem";

  notesContainer.appendChild(notesTitle);
  li.appendChild(notesContainer);

  // Buscar notas associadas à tarefa
  fetchNotes(todo.id, notesContainer);

  return li;
}

function renderTodoList(todos) {
  todoList.innerHTML = "";

  // Agrupar por dia
  const porDia = {};
  todos.forEach((todo) => {
    if (!porDia[todo.day]) porDia[todo.day] = [];
    porDia[todo.day].push(todo);
  });

  // Renderizar por dia
  for (const dia in porDia) {
    const section = document.createElement("section");
    const h2 = document.createElement("h2");
    h2.textContent = `📅 ${dia.charAt(0).toUpperCase() + dia.slice(1)}`;
    section.appendChild(h2);

    porDia[dia].forEach((todo) => {
      const li = createTodoElement(todo);
      section.appendChild(li);
    });

    todoList.appendChild(section);
  }
}


function fetchTodos() {
  callApi("/api/todos")
    .then((data) => renderTodoList(data))
    .catch(() => alert("Erro ao obter tarefas 😢"));
}

function addTodo(text, day) {
  callApi("/api/todos", {
    method: "POST",
    body: JSON.stringify({ text, day }),
  })
    .then(fetchTodos)
    .catch(() => alert("Erro ao adicionar tarefa 😢"));
}

function toggleTodoDone(id, done) {
  callApi(`/api/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ done }),
  })
    .then(() => {
      fetchTodos();

      if (done) {
        fetch("/random")
        .then((res) => res.json())
        .then((data) => {
          showMotivacao(data.numero, data.frase);
        });
      }

    })
    .catch(() => alert("Erro ao atualizar tarefa 😢"));
}

function deleteTodo(id) {
  fetch(`/api/todos/${id}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) fetchTodos();
      else alert("Erro ao apagar tarefa 😢");
    })
    .catch(() => alert("Erro ao apagar tarefa 😢"));
}

// NOVO: Adicionar nota a uma tarefa
function addNote(todoId, content) {
  callApi(`/api/todos/${todoId}/notes`, {
    method: "POST",
    body: JSON.stringify({ content }),
  })
    .then(fetchTodos)
    .catch(() => alert("Erro ao adicionar nota 😢"));
}

// NOVO: Buscar notas de uma tarefa
function fetchNotes(todoId, container) {
  fetch(`/api/todos/${todoId}/notes`)
    .then((response) => response.json())
    .then((notes) => {
      notes.forEach((note) => {
        const li = document.createElement("li");
        li.classList.add("note");
        li.textContent = `• ${note.content}`;
        container.appendChild(li);
      });
    })
    .catch(() => {
      const li = document.createElement("li");
      li.textContent = "Erro ao carregar notas.";
      container.appendChild(li);
    });
}

function showMotivacao(numero, frase) {
  const box = document.getElementById("motivacao-box");
  box.textContent = `🎉 Frase de motivação: ${numero} — ${frase}`;
  box.classList.remove("hide");
  box.classList.add("show");

  // Esconde automaticamente ao fim de 4 segundos
  setTimeout(() => {
    box.classList.remove("show");
    box.classList.add("hide");
  }, 4000);
}


// Submeter novos exercícios
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();
  const day = document.getElementById("todo-day").value;
  if (text.length === 0 || !day) return;
  addTodo(text, day);
  todoInput.value = "";
});



// Carregar tudo ao iniciar
fetchTodos();
