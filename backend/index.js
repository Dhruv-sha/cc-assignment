const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const DATA_FILE = "./data.json";

// Get all tasks
app.get("/tasks", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// Add task
app.post("/tasks", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const newTask = { id: Date.now(), text: req.body.text, completed: false };
  data.push(newTask);

  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json(newTask);
});

// Toggle task
app.put("/tasks/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  data = data.map(task =>
    task.id == req.params.id ? { ...task, completed: !task.completed } : task
  );

  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json(data);
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  data = data.filter(task => task.id != req.params.id);

  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));