// Tasks.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import "./App.css";

export default function Tasks() {
  const { token, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");

  // Fetch tasks for logged-in user
  const fetchTasks = () => {
    axios
      .get("http://localhost:5000/tasks", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Fetch tasks error:", err));
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5000/tasks",
        { text, dueDate, priority, category, completed: 0 }, // store completed as 0/1
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setTasks([...tasks, res.data]);
        setText("");
        setDueDate("");
        setPriority("");
        setCategory("");
      })
      .catch((err) => console.error("Add task error:", err));
  };

  // Toggle completed
  const toggleComplete = (id, completed) => {
    axios
      .put(
        `http://localhost:5000/tasks/${id}`,
        { completed: completed ? 0 : 1 }, // toggle 0/1
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setTasks(tasks.map((task) => (task.id === id ? res.data : task)));
      })
      .catch((err) => console.error("Toggle complete error:", err));
  };

  // Delete task
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((err) => console.error("Delete task error:", err));
  };

  return (
    <div className="container">
      <h1>Task Tracker</h1>
      <button className="logout-btn"
       style={{
          background: "#e91e63",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          color: "white",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "15px",
        }} onClick={logout}>
        Logout
      </button>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Task"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Category</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
        </select>
        <button type="submit" className="add-btn">Add Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span
              className={`task-text ${task.completed ? "completed" : ""}`}
              onClick={() => toggleComplete(task.id, task.completed)}
            >
              {task.text}
              {task.dueDate && <span className="due-date">({task.dueDate})</span>}
              {task.priority && <span className={`priority ${task.priority}`}>{task.priority}</span>}
              {task.category && <span className="category-badge">{task.category}</span>}
            </span>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
