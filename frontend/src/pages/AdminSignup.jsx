import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminSignup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        ...form,
        role: "admin",
      });
      alert("Admin registered successfully!");
      navigate("/admin/login");
    } catch (err) {
      console.error(err);
      alert("Error registering admin");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="email" placeholder="Email" className="w-full border p-2 rounded" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="w-full border p-2 rounded" onChange={handleChange} />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register as Admin
        </button>
      </form>
    </div>
  );
};

export default AdminSignup;
