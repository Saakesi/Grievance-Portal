import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate
import { useAuth } from "../context/contextProvider"; // ✅ To update user in context

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth(); // ✅ get setUser from context

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      // Save token in localStorage
      localStorage.setItem("token", res.data.token);

      // ✅ Update user context
      setUser(res.data.user);

      // ✅ Redirect to home
      navigate("/");

      // Optional success message
      setMessage("✅ Login successful!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-72 border rounded-md px-4 py-6 bg-white shadow"
      >
        <h2 className="text-xl font-bold text-center text-blue-600">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-medium"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">{message}</p>
      </form>
    </div>
  );
};

export default Login;

