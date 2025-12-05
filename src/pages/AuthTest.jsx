import { useState } from "react";

export default function AuthTest() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username, // using username also as name for quick test
          email,
          username,
          password,
        }),
      });
      const data = await res.json();
      setMessage(res.ok ? `Signup OK: ${JSON.stringify(data)}` : `Signup error: ${data.error}`);
    } catch (err) {
      setMessage("Signup error: " + err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      setMessage(res.ok ? `Login OK: ${JSON.stringify(data)}` : `Login error: ${data.error}`);
    } catch (err) {
      setMessage("Login error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h2>Test Signup / Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />

      <button onClick={handleSignup} style={{ marginRight: 8 }}>
        Signup
      </button>
      <button onClick={handleLogin}>Login</button>

      {message && (
        <div style={{ marginTop: 10, padding: 10, background: "#f0f0f0" }}>{message}</div>
      )}
    </div>
  );
}
    