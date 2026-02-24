import { useState } from 'react';

function Register({ onRegisterSuccess }) {
  // Registratieformulier: registreer nieuwe gebruiker en sla token op
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Stuur registratiegegevens naar backend
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Parse JSON response
      const data = await response.json();

      if (response.ok) {
        // Sla token op en laat parent weten dat registratie/islogged-in is
        localStorage.setItem('token', data.token);
        console.log('Geregistreerd!');
        if (onRegisterSuccess) onRegisterSuccess(data.token);
      } else {
        // Toon serverfout
        setError(data.error || 'Fout bij registreren');
      }
    } catch (error) {
      // Netwerk- of parse-fout
      console.error('Error:', error);
      setError('Netwerkfout bij registreren');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Wachtwoord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registreren</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default Register;
