const API_URL = `${import.meta.env.VITE_SERVER_URL}/api`;

// Users
export const fetchUsers = () =>
  fetch(`${API_URL}/users`).then(r => r.json());

export const createUser = (data) =>
  fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const updateUser = async (id, data) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

// Teams
export const fetchTeams = () =>
  fetch(`${API_URL}/teams`).then(r => r.json());

export const createTeam = (data) =>
  fetch(`${API_URL}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const updateTeam = async (id, data) => {
  const response = await fetch(`${API_URL}/teams/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteTeam = async (id) => {
  const response = await fetch(`${API_URL}/teams/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

// Tasks
export const fetchTasks = () =>
  fetch(`${API_URL}/tasks`).then(r => r.json());

export const createTask = (data) =>
  fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const updateTask = async (id, data) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};