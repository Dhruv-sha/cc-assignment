const API = "/tasks";

async function loadTasks() {
  const res = await fetch(API);
  if (!res.ok) {
    throw new Error("Unable to load tasks");
  }

  const tasks = await res.json();

  const list = document.getElementById("taskList");
  const total = document.getElementById("totalCount");
  const completed = document.getElementById("completedCount");
  const emptyState = document.getElementById("emptyState");

  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item${task.completed ? " completed" : ""}`;

    const main = document.createElement("div");
    main.className = "task-main";
    main.onclick = () => toggleTask(task.id);

    const dot = document.createElement("span");
    dot.className = "dot";

    const text = document.createElement("span");
    text.className = "task-text";
    text.innerText = task.text;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.innerText = "Delete";
    delBtn.onclick = event => {
      event.stopPropagation();
      deleteTask(task.id);
    };

    main.appendChild(dot);
    main.appendChild(text);
    li.appendChild(main);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  total.innerText = tasks.length;
  completed.innerText = tasks.filter(task => task.completed).length;
  emptyState.classList.toggle("hidden", tasks.length > 0);
}

async function addTask() {
  try {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (!text) {
      return;
    }

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      throw new Error("Unable to add task");
    }

    input.value = "";
    await loadTasks();
  } catch (error) {
    alert(error.message || "Something went wrong while adding the task.");
  }
}

async function toggleTask(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: "PUT" });
    if (!res.ok) {
      throw new Error("Unable to update task");
    }
    await loadTasks();
  } catch (error) {
    alert(error.message || "Something went wrong while updating the task.");
  }
}

async function deleteTask(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      throw new Error("Unable to delete task");
    }
    await loadTasks();
  } catch (error) {
    alert(error.message || "Something went wrong while deleting the task.");
  }
}

document.getElementById("taskInput").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    addTask();
  }
});

loadTasks().catch(error => {
  alert(error.message || "Unable to connect to backend API.");
});