let tasks = [];

function renderTasks(filter = false) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  let filteredTasks = tasks;
  if (filter) {
    filteredTasks = tasks.filter(task => !task.done);
  }

  if (filteredTasks.length === 0) {
    todoList.innerHTML = `<tr><td colspan="4" class="text-center py-3 text-gray-500">No task found</td></tr>`;
    return;
  }

  filteredTasks.forEach((task, index) => {
    const row = document.createElement("tr");
    row.classList.add("border-b", "border-gray-700");

    row.innerHTML = `
      <td class="px-4 py-2">${task.text}</td>
      <td class="px-4 py-2">${task.date}</td>
      <td class="px-4 py-2">${task.done ? "✅ Done" : "⏳ Pending"}</td>
      <td class="px-4 py-2">
        <button onclick="toggleStatus(${index})" 
          class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md mr-2">
          Toggle
        </button>
        <button onclick="deleteTask(${index})" 
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md">
          Delete
        </button>
      </td>
    `;
    todoList.appendChild(row);
  });
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");

  if (taskInput.value.trim() === "" || dateInput.value === "") {
    alert("Please enter task and date!");
    return;
  }

  tasks.push({
    text: taskInput.value,
    date: dateInput.value,
    done: false
  });

  taskInput.value = "";
  dateInput.value = "";
  renderTasks();
}

function toggleStatus(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function deleteAll() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    renderTasks();
  }
}

function filterTasks() {
  renderTasks(true);
}

// Initial render
renderTasks();
