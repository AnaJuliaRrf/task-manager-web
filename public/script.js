// 1. URL do Back-end (Render)
const PROD_BACKEND_URL = "https://task-manager-api-d3s3.onrender.com";

// 2. URL do Back-end Local no Codespaces (Porta 5000)
const CODESPACE_BACKEND_URL = "https://cautious-space-parakeet-jj97q96jrrjghjq4q-5000.app.github.dev";

// Detecção Automática de Ambiente
let API_URL = PROD_BACKEND_URL;

if (window.location.hostname.includes("github.dev") || window.location.hostname.includes("localhost")) {
    API_URL = CODESPACE_BACKEND_URL;
    console.log("✈️ Ambiente de teste local (Codespaces) detectado. Usando API local:", API_URL);
} else {
    console.log("🚀 Ambiente de Produção detectado. Usando API do Render:", API_URL);
}
// =======================================================================

// Listar tarefas (Modificado para usar crase dinamicamente)
async function loadTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');

      li.innerHTML = `
        <span class="${task.completed ? 'completed' : ''}">
          ${task.title}
        </span>
        <div>
          <button onclick="toggleTask(${task.id})">✔</button>
          <button onclick="deleteTask(${task.id})">🗑</button>
        </div>
      `;

      taskList.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
  }
}

// Criar tarefa
async function addTask() {
  const input = document.getElementById('taskInput');
  const title = input.value.trim();

  if (!title) return;

  try {
    await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    input.value = '';
    loadTasks();
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
  }
}

// Marcar como concluída
async function toggleTask(id) {
  try {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT'
    });
    loadTasks();
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
  }
}

// Excluir tarefa
async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE'
    });
    loadTasks();
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
  }
}

// --- NOVA FUNÇÃO OBRIGATÓRIA DA PARTE 2.5 ---
// Faz a chamada na rota /v1 do back-end para provar a integração entre os containers
async function chamarAPI() {
  const respostaCampo = document.getElementById("resposta");
  respostaCampo.textContent = "⏳ Conectando ao container da API...";
  
  try {
    const resposta = await fetch(`${API_URL}/v1`);
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
    
    const dados = await resposta.json();
    respostaCampo.textContent = `${dados.message} chamada em ${dados.chamada_em}`;
  } catch (erro) {
    console.error('Erro na integração:', erro);
    respostaCampo.innerHTML = `❌ Erro ao conectar ao container back-end.<br>Verifique se a porta 5000 está Pública.`;
  }
}

// Carregar tarefas ao abrir a página
loadTasks();