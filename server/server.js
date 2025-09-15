const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// connect to SQLite (creates file if it doesn’t exist)
const db = new sqlite3.Database("./tasks.db", (err) => {
  if (err) console.error(err.message);
  console.log("✅ Connected to SQLite database");
});

// create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT,
  dueDate TEXT,
  priority TEXT,
  category TEXT,
  completed INTEGER
)`);

// 🟢 Get all tasks
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 🟢 Add a new task
app.post("/tasks", (req, res) => {
  const { text, dueDate, priority, category } = req.body;
  db.run(
    `INSERT INTO tasks (text, dueDate, priority, category, completed) VALUES (?, ?, ?, ?, ?)`,
    [text, dueDate, priority, category, 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        text,
        dueDate,
        priority,
        category,
        completed: 0,
      });
    }
  );
});

// 🟢 Toggle complete
app.put("/tasks/:id", (req, res) => {
  const { completed } = req.body;
  db.run(
    `UPDATE tasks SET completed = ? WHERE id = ?`,
    [completed ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, completed });
    }
  );
});

// 🟢 Delete single task
app.delete("/tasks/:id", (req, res) => {
  db.run(`DELETE FROM tasks WHERE id = ?`, req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Task deleted" });
  });
});

// 🟢 Delete all tasks
app.delete("/tasks", (req, res) => {
  db.run(`DELETE FROM tasks`, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "All tasks deleted" });
  });
});

// start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
