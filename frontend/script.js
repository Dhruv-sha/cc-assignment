const API = "http://localhost:5000/tasks";

async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerText = task.text;
    li.onclick = () => toggleTask(task.id);
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input.value })
  });

  input.value = "";
  loadTasks();
}

async function toggleTask(id) {
  await fetch(`${API}/${id}`, { method: "PUT" });
  loadTasks();
}

loadTasks();