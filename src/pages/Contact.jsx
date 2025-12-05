import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Something went wrong.");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500  flex flex-col justify-center items-center px-6 py-12">
      {/* Title */}
      <div className="text-center mb-12 text-gray-800">
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">Get in Touch</h1>
        <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
          We’d love to hear from you! Whether you have a question, feedback, or collaboration idea — reach out and let’s connect.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Contact Form */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-gray-800">
          <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 font-medium">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg p-3 border border-white/30 bg-white/10 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg p-3 border border-white/30 bg-white/10 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Message</label>
              <textarea
                name="message"
                rows="5"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-lg p-3 border border-white/30 bg-white/10 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              Send Message
            </button>
          </form>
        </div>

       {/* Contact Info */}
<div className="flex flex-col justify-center gap-6 text-white">
  <div className="flex items-center gap-4 bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:scale-105 transition">
    <Mail className="w-8 h-8 text-white" />
    <div className="text-gray-800">
      <h3 className="font-semibold text-lg">Email</h3>
      <p>support@lifeblog.com</p>
    </div>
  </div>

  <div className="flex items-center gap-4 bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:scale-105 transition">
    <Phone className="w-8 h-8 text-white" />
    <div className="text-gray-800">
      <h3 className="font-semibold text-lg">Phone</h3>
      <p>+91 98765 43210</p>
    </div>
  </div>

  <div className="flex items-center gap-4 bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:scale-105 transition">
    <MapPin className="w-8 h-8 text-white" />
    <div className="text-gray-800">
      <h3 className="font-semibold text-lg">Address</h3>
      <p>123 Blog Street, New Delhi, India</p>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default Contact;
