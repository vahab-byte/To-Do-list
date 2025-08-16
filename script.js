let currentFilter = 'All';

function setFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  document
    .querySelector(`.filter-btn:nth-child(${filter === "All" ? 1 : filter === "Completed" ? 2 : 3})`)
    .classList.add("active");

  filterTasks();
}

function filterTasks() {
  const taskItems = document.querySelectorAll('#taskList li');

  taskItems.forEach(item => {
    const checkbox = item.querySelector("input[type=checkbox]");
    const isCompleted = checkbox && checkbox.checked;

    if (
      currentFilter === 'All' ||
      (currentFilter === 'Completed' && isCompleted) ||
      (currentFilter === 'Pending' && !isCompleted)
    ) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  const existingToast = container.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode === container) {
      toast.remove();
    }
  }, 3000);
}

function updateTaskCounters() {
  const tasks = document.querySelectorAll("#taskList li");
  const total = tasks.length;
  let completed = 0;

  tasks.forEach(task => {
    const checkbox = task.querySelector("input[type=checkbox]");
    if (checkbox && checkbox.checked) completed++;
  });

  const pending = total - completed;
  document.getElementById("totalCount").textContent = total;
  document.getElementById("completedCount").textContent = completed;
  document.getElementById("pendingCount").textContent = pending;
}

document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("taskDate");
  const calendarIcon = document.querySelector(".calendar-icon");
  const inputWrapper = document.querySelector(".input-with-icon");

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;

  [taskInput, dateInput].forEach(input => {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addTask();
        inputWrapper.classList.remove("open");
        dateInput.blur();
      }
    });
  });

  if (calendarIcon && inputWrapper) {
    calendarIcon.addEventListener("click", function () {
      inputWrapper.classList.toggle("open");
      dateInput.focus();
    });
  }

  document.addEventListener("click", function (e) {
    const isInside = inputWrapper.contains(e.target) || e.target === calendarIcon;
    if (!isInside) {
      inputWrapper.classList.remove("open");
      dateInput.blur();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      inputWrapper.classList.remove("open");
      dateInput.blur();
    }
  });

  loadTasks();
});

function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    const taskText = li.querySelector(".task-text-box")?.textContent || "";
    const completed = li.querySelector("input[type=checkbox]").checked;
    const dateText = li.querySelector(".task-date span:nth-child(2)")?.textContent.replace("Due: ", "") || "";
    tasks.push({ text: taskText, done: completed, date: dateText });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateTaskCounters();
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTask(task.text, task.done, task.date));
  updateTaskCounters();
}

function addTask(taskText = null, isCompleted = false, taskDate = null) {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("taskDate");
  const inputWrapper = document.querySelector(".input-with-icon");

  if (!taskText) taskText = taskInput.value.trim();
  if (!taskDate) taskDate = dateInput.value;

  if (taskText === "") {
    showAlertPopup("Please enter a to-do.");
    return;
  }

  const taskList = document.getElementById("taskList");
  const li = document.createElement("li");

  const taskLeft = document.createElement("div");
  taskLeft.className = "task-left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isCompleted;

  const taskSpan = document.createElement("div");
  taskSpan.className = "task-text-box";
  taskSpan.textContent = taskText;
  if (isCompleted) taskSpan.classList.add("task-done");

  const dateContainer = document.createElement("div");
  dateContainer.className = "task-date";
  if (taskDate) {
    const icon = document.createElement("span");
    icon.className = "material-symbols-outlined";
    icon.textContent = "calendar_month";

    const dateText = document.createElement("span");
    dateText.textContent = `Due: ${taskDate}`;
    dateText.style.marginLeft = "4px";

    dateContainer.appendChild(icon);
    dateContainer.appendChild(dateText);
  }

  checkbox.onchange = function () {
    taskSpan.classList.toggle("task-done", this.checked);
    showToast(this.checked ? "Marked as complete" : "Marked as incomplete");
    applyOverdueHighlight(li, taskDate, this.checked);
    saveTasksToLocalStorage();
  };

  const editBtn = document.createElement("span");
  editBtn.className = "material-symbols-outlined edit-btn";
  editBtn.textContent = "edit";

  editBtn.onclick = function () {
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = taskSpan.textContent;
    inputField.className = "edit-input";
    inputField.style.padding = "4px";
    inputField.style.marginLeft = "8px";

    taskLeft.replaceChild(inputField, taskSpan);
    inputField.focus();

    inputField.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const newText = inputField.value.trim();
        if (newText !== "") {
          taskSpan.textContent = newText;
          taskLeft.replaceChild(taskSpan, inputField);
          saveTasksToLocalStorage();
          showToast("Task updated");
        }
      }
    });
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "material-symbols-outlined delete-btn";
  deleteBtn.textContent = "delete_forever";

  deleteBtn.onclick = function () {
    showDeletePopup(() => {
      li.remove();
      showToast("Task deleted successfully");
      saveTasksToLocalStorage();
    });
  };

  const actionBtns = document.createElement("div");
  actionBtns.className = "task-actions";
  actionBtns.appendChild(editBtn);
  actionBtns.appendChild(deleteBtn);

  taskLeft.appendChild(checkbox);
  taskLeft.appendChild(taskSpan);
  if (taskDate) taskLeft.appendChild(dateContainer);

  li.appendChild(taskLeft);
  li.appendChild(actionBtns);
  taskList.appendChild(li);

  if (taskText === taskInput.value.trim() && taskDate === dateInput.value) {
    showToast("Task added successfully");
  }

  taskInput.value = "";
  dateInput.value = "";
  dateInput.blur();
  if (inputWrapper) inputWrapper.classList.remove("open");

  saveTasksToLocalStorage();
  applyOverdueHighlight(li, taskDate, isCompleted);

filterTasks();
}

function applyOverdueHighlight(li, taskDate, isCompleted) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (taskDate) {
    const dueDate = new Date(taskDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today && !isCompleted) {
      li.classList.add("overdue");
    } else {
      li.classList.remove("overdue");
    }
  }
}

function showDeletePopup(onConfirm) {
  let existingPopup = document.getElementById("custom-confirm");
  if (existingPopup) existingPopup.remove();

  const overlay = document.createElement("div");
  overlay.id = "custom-confirm";
  overlay.innerHTML = `
    <div class="popup-box">
      <h3>Delete</h3>
      <p class="popup-message">Are you sure you want to delete?</p>
      <div class="popup-buttons">
        <button class="popup-btn cancel">Close</button>
        <button class="popup-btn confirm">Yes, delete</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector(".confirm").onclick = () => {
    onConfirm();
    overlay.remove();
  };

  overlay.querySelector(".cancel").onclick = () => {
    overlay.remove();
  };
}

function showAlertPopup(message) {
  let existingPopup = document.getElementById("custom-confirm");
  if (existingPopup) existingPopup.remove();

  const overlay = document.createElement("div");
  overlay.id = "custom-confirm";
  overlay.innerHTML = `
    <div class="popup-box">
      <h3>Alert</h3>
      <p class="popup-message">${message}</p>
      <div class="popup-buttons">
        <button class="popup-btn confirm">OK</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.querySelector(".confirm").onclick = () => overlay.remove();
}
