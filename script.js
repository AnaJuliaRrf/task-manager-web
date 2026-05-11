// Troque pela URL do Render após o deploy
const API_URL = 'https://task-manager-api-d3s3.onrender.com';

async function loadTasks() {
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
      <button onclick="toggleTask(${task.id})">✔</button>
      <button onclick="deleteTask(${task.id})">🗑</button>
    `;

    taskList.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById('taskInput');
  const title = input.value.trim();

  if (!title) return;

  await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  input.value = '';
  loadTasks();
}

async function toggleTask(id) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT'
  });

  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE'
  });

  loadTasks();
}

loadTasks();