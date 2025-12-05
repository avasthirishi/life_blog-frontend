// src/pages/CreateAdmin.jsx
import { useState } from "react";

export default function CreateAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    bio: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // optionally include auth token:
          // Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create admin");
      const data = await res.json();
      setMessage(`✅ Admin ${data.username || formData.username} created successfully`);
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
        bio: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating admin: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create New Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Admin
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center font-medium">{message}</p>
      )}
    </div>
  );
}
