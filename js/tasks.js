// Task management

function loadTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

let tasks = loadTasks();
let editId = null;

// Tasks section

const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#book-title");
const descInput = document.querySelector("#task-desc");
const dueInput = document.querySelector("#task-due");
const statusInput = document.querySelector("#task-status");
const submitBtn = document.querySelector("#submit-btn");
const cancelBtn = document.querySelector("#cancel-btn");
const formHeading = document.querySelector("#form-heading");
const tableBody = document.querySelector("#task-body");

// Filtering section

const searchInput = document.querySelector("#search-input");
const filterStatus = document.querySelector("#filter-status");
const sortBy = document.querySelector("#sort-by");

// Analytics setcion

const barCanvas = document.querySelector("#bar-chart");
const board = document.querySelector("#board");
const columns = document.querySelectorAll(".kanban-column");

function compareDueAsc(a, b) {
  return a.dueDate.localeCompare(b.dueDate);
}
function compareDueDesc(a, b) {
  return b.dueDate.localeCompare(a.dueDate);
}
function compareNameAsc(a, b) {
  return a.title.localeCompare(b.title);
}
function compareNameDesc(a, b) {
  return b.title.localeCompare(a.title);
}

function filteredTasks() {
  const query = searchInput.value.toLowerCase();
  const statusFilter = filterStatus.value;
  const sortChoice = sortBy.value;

  let result = tasks.filter(function (task) {
    if (statusFilter === "completed" && task.completed === false) {
      return false;
    }
    if (statusFilter === "pending" && task.completed === true) {
      return false;
    }

    if (query !== "") {
      const text = (task.title + " " + task.description).toLowerCase();
      if (text.includes(query) === false) {
        return false;
      }
    }
    return true;
  });

  if (sortChoice === "due-asc") {
    result.sort(compareDueAsc);
  } else if (sortChoice === "due-desc") {
    result.sort(compareDueDesc);
  } else if (sortChoice === "name-asc") {
    result.sort(compareNameAsc);
  } else if (sortChoice === "name-desc") {
    result.sort(compareNameDesc);
  }
  
  return result;
}

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

  const getTasks = filteredTasks();

  if (tasks.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" class="text-center text-muted">No book tasks yet.</td></tr>';
    return;
  }

  if (getTasks.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" class="text-center text-muted">No tasks match your search or filter.</td></tr>';
    return;
  }

  getTasks.forEach(function (task) {
    const row = document.createElement("tr");
    if (task.completed === true) {
      row.classList.add("row-completed");
    }

    let disabledAttribute = "";
    if (task.completed === true) {
      disabledAttribute = "disabled";
    }

    row.innerHTML = `
      <td>${escapeHtml(task.title)}</td>
      <td>${escapeHtml(task.description)}</td>
      <td>${task.dueDate}</td>
      <td><span class="badge text-bg-${statusColors[task.status]}">${task.status}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-success" data-action="complete" data-id="${task.id}" ${disabledAttribute}>
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
  const completed = countCompleted();

  document.querySelector("#count-total").textContent = total;
  document.querySelector("#count-completed").textContent = completed;
  document.querySelector("#count-pending").textContent = total - completed;
}

function findTaskById(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      return tasks[i];
    }
  }
  return null;
}

function countCompleted() {
  let completed = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].completed === true) {
      completed = completed + 1;
    }
  }
  return completed;
}

function renderAll() {
  if (tableBody !== null) {
    renderTable();
    renderSummary();
  }

  if (barCanvas !== null) {
    renderCharts();
  }

  if (board !== null) {
    renderBoard();
  }
}

function resetForm() {
  editId = null;
  form.reset();
  formHeading.textContent = "Add Book";
  submitBtn.textContent = "Add Book";
  cancelBtn.classList.add("d-none");
}

if (form !== null) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
      dueDate: dueInput.value,
      status: statusInput.value
    };

    if (editId === null) {
      tasks.push({ id: Date.now(), ...data, completed: false});
    } else {
      const task = findTaskById(editId);
      Object.assign(task, data);  
    }

    saveTasks();
    resetForm();
    renderAll();
  });
  cancelBtn.addEventListener("click", resetForm);
}

if(tableBody !== null) {
  tableBody.addEventListener("click", function (e) {
    const btn = e.target.closest("button");

    if (btn === null) {
      return;
    }

    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === "delete") {
      if (confirm("Delete this book task?")) {
        const remainingTasks = [];
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].id !== id) {
            remainingTasks.push(tasks[i]);
          }
        }
        tasks = remainingTasks;

        if (editId === id) {
          resetForm();
        }
      }
    }

    if (action === "complete") {
      const task = findTaskById(id);
      task.completed = true;
    }

    if (action === "edit") {
      const task = findTaskById(id);
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
}


let barChart = null;

function renderCharts() {
  const completed = countCompleted();
  const pending = tasks.length - completed;

  if (barChart === null) {
    barChart = new Chart(barCanvas, {
      type: "bar",
      data: {
        labels: ["Completed", "Pending"],
        datasets: [{
          label: "Tasks",
          data: [completed, pending],
          backgroundColor: ["#b497d6", "#adb5bd"]
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  } else {
    barChart.data.datasets[0].data = [completed, pending];
    barChart.update();
  }
}

function renderBoard() {
  for (let x = 0; x < columns.length; x++) {
    const column = columns[x];
    const columnName = column.dataset.column;

    column.innerHTML = "";
    let cardCount = 0;

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      if (task.status !== columnName) {
        continue;
      }

      cardCount = cardCount + 1;

      let cardClass = "card mb-2 kanban-card";
      if (task.completed === true) {
        cardClass = cardClass + " done";
      }

      const card = document.createElement("div");
      card.className = cardClass;
      card.innerHTML = `
        <div class="card-body p-2">
          <div class="fw-bold">${escapeHtml(task.title)}</div>
          <div class="small">${escapeHtml(task.description)}</div>
          <div class="small text-muted mt-1">Due: ${task.dueDate}</div>
        </div>`;
      column.appendChild(card);
    }

    if (cardCount === 0) {
      column.innerHTML =
        '<p class="text-muted small text-center mb-0">No tasks</p>';
    }
  }
}


if (searchInput !== null) {
  searchInput.addEventListener("input", renderAll);
}
if (filterStatus !== null) {
  filterStatus.addEventListener("change", renderAll);
}
if (sortBy !== null) {
  sortBy.addEventListener("change", renderAll);
}

renderAll();