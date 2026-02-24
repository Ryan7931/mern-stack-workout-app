import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sla token op
        localStorage.setItem("token", data.token);
        console.log("Ingelogd!");
        // Redirect of refresh workouts
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Wachtwoord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Inloggen</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default Login;