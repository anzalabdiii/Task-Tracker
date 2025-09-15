# Task Tracker

Task Tracker is a full-stack web app for organizing, managing, and tracking your tasks. It features a React frontend and a Node.js backend, with data stored in an SQLite database. You can add, remove, complete, and clear all tasks from an intuitive UI.

---

## Features

- **Add Task**: Add tasks with text, optional due date, priority (low/medium/high), and category (Work, Personal, Shopping, Health).
- **Remove Task**: Delete individual tasks from the list.
- **Clear All Tasks**: Remove all tasks with a single click.
- **Beautiful UI**: Responsive and stylish interface using React and custom CSS.
- **Backend API**: Node.js/Express REST API with SQLite to persist all data.

---

## Tech Stack

- **Frontend:** React, Axios, CSS ([client/src/App.js](client/src/App.js), [client/src/App.css](client/src/App.css))
- **Backend:** Node.js, Express, SQLite ([server/server.js](server/server.js))
- **Database:** SQLite (local file: `tasks.db`)

---

## Project Structure

```
Task-Tracker/
├── client/              # React frontend
│   ├── src/
│   │   ├── App.js       # Main React app
│   │   ├── App.css      # Main styling
│   │   └── ...
│   ├── public/
│   └── ...
├── server/              # Node backend
│   ├── server.js        # Main API entry
│   └── ...
├── README.md
└── ...
```

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm

### 1. Start the Backend

Open a terminal and run:

```bash
cd server
npm install
node server.js
```
This starts the API on [http://localhost:5000](http://localhost:5000).

### 2. Start the Frontend

Open another terminal and run:

```bash
cd client
npm install
npm start
```
This starts the React app on [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

- `GET    /tasks`          – List all tasks
- `POST   /tasks`          – Add a new task (`{ text, dueDate, priority, category }`)
- `PUT    /tasks/:id`      – Update a task (toggle complete)
- `DELETE /tasks/:id`      – Delete a task
- `DELETE /tasks`          – Delete all tasks

---

## Usage

- Enter text (required), and optionally set due date, priority, and category.
- Click **Add Task**.
- Click a task to mark as complete/incomplete.
- Click the **Delete** button to remove a task.
- Click **Clear All Tasks** to delete every task.

---

## Screenshots

<!-- Add screenshots here if available -->

---

## License

MIT

---

## Author

- [anzalabdiii](https://github.com/anzalabdiii)

---

_If you find this project helpful, please star the repo!_
