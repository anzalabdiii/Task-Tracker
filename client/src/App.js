import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [notification, setNotification] = useState(null);

  // helper: show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // fetch tasks from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks")
      .then((res) => setTasks(res.data))
      .catch(() => showNotification("❌ Failed to fetch tasks", "error"));
  }, []);

  // add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!text) return;

    const newTask = { text, dueDate, priority, category, completed: 0 };

    axios
      .post("http://localhost:5000/tasks", newTask)
      .then((res) => {
        setTasks([...tasks, res.data]); // ✅ only add after backend success
        showNotification("✅ Task added successfully!");
      })
      .catch(() => {
        showNotification("❌ Failed to add task!", "error");
      });

    setText("");
    setDueDate("");
    setPriority("");
    setCategory("");
  };

  // toggle complete
  const toggleComplete = (id, completed) => {
    axios
      .put(`http://localhost:5000/tasks/${id}`, { completed: !completed })
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: !completed } : task
          )
        );
      })
      .catch(() => showNotification("❌ Failed to update task!", "error"));
  };

  // delete task
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
        showNotification("🗑️ Task deleted");
      })
      .catch(() => showNotification("❌ Failed to delete task!", "error"));
  };

  // clear all tasks
  const clearAllTasks = () => {
    tasks.forEach((task) => {
      axios
        .delete(`http://localhost:5000/tasks/${task.id}`)
        .catch(() => showNotification("❌ Failed to clear some tasks", "error"));
    });
    setTasks([]);
    showNotification("🧹 All tasks cleared");
  };

  return (
    <div className="container">
      <h1>Task Tracker</h1>

      {/* 🔔 Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* 📝 Task Form */}
      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Task"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* 🟢 Category Dropdown */}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Category</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
        </select>

        <button type="submit" className="add-btn">
          Add Task
        </button>
      </form>

      {/* 📋 Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              className={`task-text ${task.completed ? "completed" : ""}`}
              onClick={() => toggleComplete(task.id, task.completed)}
            >
              {task.text}
              {task.dueDate && (
                <span className="due-date">({task.dueDate})</span>
              )}
              {task.priority && (
                <span className={`priority ${task.priority}`}>
                  {task.priority}
                </span>
              )}
              {task.category && (
                <span className="category-badge">{task.category}</span>
              )}
            </span>

            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* 🟢 Clear All button */}
      {tasks.length > 0 && (
        <button className="clear-btn" onClick={clearAllTasks}>
          Clear All Tasks
        </button>
      )}
    </div>
  );
}

export default App;
