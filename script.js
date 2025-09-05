// ====== Data Storage ======
let tasks = [];
let taskIdCounter = 0;
let deletedTask = null;
let undoTimeout = null;

// ====== Utility ======
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
  const data = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = data;
  renderTasks();
}

// ====== Toast Notification ======
function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast show";
  toast.innerText = msg;
  document.getElementById("toastContainer").appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("show");
    toast.remove();
  }, 3000);
}

// ====== Add Task ======
function addTask() {
  const title = document.getElementById("taskInput").value.trim();
  const due = document.getElementById("taskDate").value;
  const category = document.getElementById("taskCategory").value.trim();
  const priority = document.getElementById("taskPriority").value;

  if (!title) {
    showToast("⚠️ Task title is required");
    return;
  }

  const newTask = {
    id: ++taskIdCounter,
    title,
    due,
    category,
    priority,
    status: "Pending",
    subtasks: []
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  updateStats();
  showToast("✅ Task added!");

  // reset form
  document.getElementById("taskInput").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskCategory").value = "";
  document.getElementById("taskPriority").value = "Medium";
}

// ====== Delete Task ======
function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    deletedTask = tasks[index];
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    updateStats();
    showToast("🗑️ Task deleted! Undo?");

    // undo option 5s
    clearTimeout(undoTimeout);
    undoTimeout = setTimeout(() => {
      deletedTask = null;
    }, 5000);
  }
}

function undoDelete() {
  if (deletedTask) {
    tasks.push(deletedTask);
    deletedTask = null;
    saveTasks();
    renderTasks();
    updateStats();
    showToast("↩️ Undo successful");
  }
}

// ====== Toggle Complete ======
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = task.status === "Completed" ? "Pending" : "Completed";
    saveTasks();
    renderTasks();
    updateStats();
    showToast(`🔄 Task marked ${task.status}`);
  }
}

// ====== Render Task List ======
function renderTasks() {
  const tbody = document.getElementById("taskBody");
  tbody.innerHTML = "";

  tasks.forEach(task => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-100 dark:hover:bg-gray-700 transition";

    tr.innerHTML = `
      <td class="p-3 font-semibold">${task.title}</td>
      <td class="p-3">${task.due || "-"}</td>
      <td class="p-3">${task.category || "-"}</td>
      <td class="p-3">
        <span class="px-2 py-1 rounded text-white ${
          task.priority === "High" ? "bg-red-500" :
          task.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
        }">${task.priority}</span>
      </td>
      <td class="p-3 ${
        task.status === "Completed" ? "text-green-500" :
        task.status === "Pending" ? "text-yellow-500" : "text-red-500"
      }">${task.status}</td>
      <td class="p-3 flex gap-2">
        <button class="btn-primary" onclick="toggleTask(${task.id})">✔</button>
        <button class="btn-dark" onclick="editTask(${task.id})">✏️</button>
        <button class="btn-danger" onclick="deleteTask(${task.id})">🗑️</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ====== Stats & Progress ======
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const overdue = tasks.filter(t => t.due && new Date(t.due) < new Date() && t.status !== "Completed").length;
  const today = tasks.filter(t => t.due && new Date(t.due).toDateString() === new Date().toDateString()).length;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statDone").textContent = completed;
  document.getElementById("statOverdue").textContent = overdue;
  document.getElementById("statToday").textContent = today;

  const progress = total === 0 ? 0 : (completed / total) * 100;
  document.getElementById("progressBar").style.width = progress + "%";
  document.getElementById("progressBar").style.background =
    "linear-gradient(90deg,#FCBB6D,#DB737F)";
}

// ====== Dark Mode ======
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
  showToast("🌙 Dark mode toggled");
}

// ====== Init ======
window.onload = () => {
  loadTasks();
  updateStats();
};

