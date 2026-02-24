import { useState } from "react";

function Login({ onLoginSuccess }) {
  // Login formulier: sla token op in localStorage en geef token door aan parent
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Stuur credentials naar backend
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Parse JSON body
      const data = await response.json();

      if (response.ok) {
        // Sla token op (eenvoudige opslag)
        localStorage.setItem("token", data.token);
        console.log("Ingelogd!");
        // Laat App weten dat we ingelogd zijn zodat deze token in state gezet wordt
        if (onLoginSuccess) onLoginSuccess(data.token);
      } else {
        // Toon server-side foutmelding (bijv. verkeerde credentials)
        setError(data.error);
      }
    } catch (error) {
      // Netwerk- of parse-fout
      console.error("Error:", error);
      setError('Netwerkfout bij inloggen');
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