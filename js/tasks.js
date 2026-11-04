function loadTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

let tasks = loadTasks();
let editId = null;

const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#book-title");
const descInput = document.querySelector("#task-desc");
const dueInput = document.querySelector("#task-due");
const statusInput = document.querySelector("#task-status");
const submitBtn = document.querySelector("#submit-btn");
const cancelBtn = document.querySelector("#cancel-btn");
const formHeading = document.querySelector("#form-heading");
const tableBody = document.querySelector("#task-body");

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

const statusColors = {
  "Read": "success",
  "Currently Reading": "primary",
  "Want to Read": "secondary"
};

function renderTable() {
  tableBody.innerHTML = "";

  if (tasks.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" class="text-center text-muted">No book tasks yet.</td></tr>';
    return;
  }

  tasks.forEach(function (task) {
    const row = document.createElement("tr");
    if (task.completed) row.classList.add("row-completed");

    row.innerHTML = `
      <td>${escapeHtml(task.title)}</td>
      <td>${escapeHtml(task.description)}</td>
      <td>${task.dueDate}</td>
      <td><span class="badge text-bg-${statusColors[task.status]}">${task.status}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-success" data-action="complete" data-id="${task.id}" ${task.completed ? "disabled" : ""}>
          <i class="bi bi-check-lg"></i>
        </button>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${task.id}">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${task.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>`;
    tableBody.appendChild(row);
  });
}

function renderSummary() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  document.querySelector("#count-total").textContent = total;
  document.querySelector("#count-completed").textContent = completed;
  document.querySelector("#count-pending").textContent = total - completed;
}

function renderAll() {
  renderTable();
  renderSummary();
}

function resetForm() {
  editId = null;
  form.reset();
  form.classList.remove("was-validated");
  formHeading.textContent = "Add Book";
  submitBtn.textContent = "Add Book";
  cancelBtn.classList.add("d-none");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const data = {
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    dueDate: dueInput.value,
    status: statusInput.value
  };

  if (editId === null) {
    tasks.push({ id: Date.now(), ...data, completed: false });
  } else {
    const task = tasks.find(t => t.id === editId);
    Object.assign(task, data);  
  }

  saveTasks();
  resetForm();
  renderAll();
});

cancelBtn.addEventListener("click", resetForm);

tableBody.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;

  if (action === "delete") {
    if (confirm("Delete this book task?")) {
      tasks = tasks.filter(t => t.id !== id);
      if (editId === id) resetForm();
    }
  }

  if (action === "complete") {
    tasks.find(t => t.id === id).completed = true;
  }

  if (action === "edit") {
    const task = tasks.find(t => t.id === id);
    titleInput.value = task.title;
    descInput.value = task.description;
    dueInput.value = task.dueDate;
    statusInput.value = task.status;
    editId = id;
    formHeading.textContent = "Editing Book Task...";
    submitBtn.textContent = "Save Changes";
    cancelBtn.classList.remove("d-none");
    titleInput.focus();
    return;
  }

  saveTasks();
  renderAll();
});

renderAll();