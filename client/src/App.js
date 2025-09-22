// App.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./AuthContext";
import Login from "./Login";
import Register from "./Register";
import Tasks from "./Tasks";

function AppRoutes() {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/login"
        element={!token ? <Login /> : <Navigate to="/tasks" />}
      />
      <Route
        path="/register"
        element={!token ? <Register /> : <Navigate to="/tasks" />}
      />
      <Route
        path="/tasks"
        element={token ? <Tasks /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to={token ? "/tasks" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
