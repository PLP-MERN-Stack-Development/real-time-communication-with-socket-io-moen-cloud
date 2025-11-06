import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", { username, password });
    alert("Registered");
    navigate("/login");
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" />
        <button type="submit">Register</button>
      </form>
      <Link to="/login">Login</Link>
    </div>
  );
}
