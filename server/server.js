// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
const SECRET = "your_secret_key_here"; // change to a strong secret

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) console.error(err);
  else console.log("✅ Connected to SQLite database");
});

// Create users table
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)
`);

// Create tasks table
db.run(`
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT,
  dueDate TEXT,
  priority TEXT,
  category TEXT,
  completed INTEGER DEFAULT 0,
  user_id INTEGER
)
`);

// -----------------
// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // user.id and user.username
    next();
  });
}

// -----------------
// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function (err) {
      if (err) return res.status(400).json({ error: "Username may already exist" });
      res.json({ id: this.lastID, username });
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (!user) return res.status(400).json({ error: "Invalid username or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid username or password" });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  });
});

// -----------------
// Get all tasks for logged-in user
app.get("/tasks", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all("SELECT * FROM tasks WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create task
app.post("/tasks", authenticateToken, (req, res) => {
  const { text, dueDate, priority, category, completed } = req.body;
  const userId = req.user.id;

  db.run(
    "INSERT INTO tasks (user_id, text, dueDate, priority, category, completed) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, text, dueDate, priority, category, completed || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        user_id: userId,
        text,
        dueDate,
        priority,
        category,
        completed: completed || 0
      });
    }
  );
});

// Toggle completed
app.put("/tasks/:id", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { completed } = req.body;

  db.run(
    "UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?",
    [completed, taskId, userId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get("SELECT * FROM tasks WHERE id = ?", [taskId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
      });
    }
  );
});

// Delete task
app.delete("/tasks/:id", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  db.run(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [taskId, userId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// -----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
