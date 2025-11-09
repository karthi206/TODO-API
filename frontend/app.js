const API_URL = "https://todo-api-8noq.onrender.com/api/tasks"; // 🔥 Your Render API URL

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Fetch tasks from backend
async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  taskList.innerHTML = "";
  tasks.forEach(addTaskToDOM);
}

// Add new task
addTaskBtn.addEventListener("click", async () => {
  const title = taskInput.value.trim();
  if (!title) return alert("Enter a task!");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  const newTask = await res.json();
  addTaskToDOM(newTask);
  taskInput.value = "";
});

// Add task element to DOM
function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="${task.completed ? "completed" : ""}">${task.title}</span>
    <div>
      <button onclick="toggleTask('${task._id}', ${task.completed})">✔</button>
      <button onclick="deleteTask('${task._id}')">❌</button>
    </div>
  `;
  taskList.appendChild(li);
}

// Toggle complete
async function toggleTask(id, currentState) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !currentState }),
  });
  fetchTasks();
}

// Delete task
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}

// Initialize
fetchTasks();
