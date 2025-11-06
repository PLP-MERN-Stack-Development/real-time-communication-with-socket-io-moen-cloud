import React, { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL; // ensures no undefined

const Home = () => {
  const { user, login, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, { username, password });
      login(res.data.user, res.data.token);
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${API}/api/auth/register`, { username, password });
      alert("Registered! Please login.");
    } catch (err) {
      alert(err.response?.data?.msg || "Register failed");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <h1 className="text-2xl font-bold">Login / Register</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <div className="flex gap-2">
          <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </button>
          <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded">
            Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen p-4 flex flex-col">
      <div className="flex justify-between mb-2">
        <h2>Welcome, {user.username}</h2>
        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
      <div className="flex-1">
        <ChatWindow room="global" />
      </div>
    </div>
  );
};

export default Home;
