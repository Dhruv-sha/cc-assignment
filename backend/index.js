const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

const DATA_FILE = "./data.json";

function readTasks() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]");
      return [];
    }

    const raw = fs.readFileSync(DATA_FILE, "utf-8").trim();
    if (!raw) {
      fs.writeFileSync(DATA_FILE, "[]");
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    fs.writeFileSync(DATA_FILE, "[]");
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// Get all tasks
app.get("/tasks", (req, res) => {
  const data = readTasks();
  res.json(data);
});

// Add task
app.post("/tasks", (req, res) => {
  const data = readTasks();
  const text = (req.body.text || "").trim();

  if (!text) {
    return res.status(400).json({ error: "Task text is required" });
  }

  const newTask = { id: Date.now(), text, completed: false };
  data.push(newTask);

  writeTasks(data);
  res.json(newTask);
});

// Toggle task
app.put("/tasks/:id", (req, res) => {
  let data = readTasks();
  const exists = data.some(task => task.id == req.params.id);

  if (!exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  data = data.map(task =>
    task.id == req.params.id ? { ...task, completed: !task.completed } : task
  );

  writeTasks(data);
  res.json(data);
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  let data = readTasks();
  const exists = data.some(task => task.id == req.params.id);

  if (!exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  data = data.filter(task => task.id != req.params.id);

  writeTasks(data);
  res.json(data);
});

app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));