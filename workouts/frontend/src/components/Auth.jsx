import { useState } from 'react';
import Login from './Login';
import Register from './Register';

function Auth({ onAuthSuccess }) {
  // Eenvoudige auth-pagina: toggle tussen login en register
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <button onClick={() => setIsRegister(false)} disabled={!isRegister}>Inloggen</button>
        <button onClick={() => setIsRegister(true)} disabled={isRegister} style={{ marginLeft: '8px' }}>Registreren</button>
      </div>

      {isRegister ? (
        <Register onRegisterSuccess={onAuthSuccess} />
      ) : (
        <Login onLoginSuccess={onAuthSuccess} />
      )}
    </div>
  );
}

export default Auth;
