const API = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

// Show or hide sections based on login
if (token) {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('task-section').style.display = 'block';
  getTasks();
}

// Register
async function register() {
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;

  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  alert(data.message || data.error);
}

// Login
async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();

  if (data.token) {
    token = data.token;
    localStorage.setItem('token', token);
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('task-section').style.display = 'block';
    getTasks();
  } else {
    alert(data.error);
  }
}

// Get tasks
async function getTasks() {
  const res = await fetch(`${API}/tasks`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const tasks = await res.json();
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="${task.completed ? 'done' : ''}">${task.title}</span>
      <button onclick="toggleComplete('${task._id}', ${!task.completed})">✓</button>
      <button onclick="deleteTask('${task._id}')">✗</button>
    `;
    list.appendChild(li);
  });
}

// Add task
async function addTask() {
  const title = document.getElementById('task-input').value;
  const res = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });
  document.getElementById('task-input').value = '';
  getTasks();
}

// Toggle complete
async function toggleComplete(id, completed) {
  await fetch(`${API}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed })
  });
  getTasks();
}

// Delete
async function deleteTask(id) {
  await fetch(`${API}/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  getTasks();
}

// Logout
function logout() {
  localStorage.removeItem('token');
  token = null;
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('task-section').style.display = 'none';
}

