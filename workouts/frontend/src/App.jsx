import { useEffect, useState } from 'react';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';
import Login from './components/Login';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');

    if (!token) {
      console.log('Niet ingelogd');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/workouts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setWorkouts(data);
      } else {
        setError(data.error || 'Fout bij het ophalen van workouts');
        console.error(data.error);
      }
    } catch (error) {
      setError('Error bij ophalen workouts');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [token]);

  const handleWorkoutAdded = () => {
    fetchWorkouts();
  };

  const handleWorkoutUpdated = () => {
    fetchWorkouts();
  };

  const handleWorkoutDeleted = () => {
    fetchWorkouts();
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setWorkouts([]);
    console.log('Uitgelogd');
  };

  return (
    <div className="App">
      <h1>Workouts</h1>
      {!token ? (
        <Login onLoginSuccess={handleLogin} />
      ) : (
        <div style={{ marginBottom: '12px' }}>
          <button onClick={handleLogout}>Uitloggen</button>
        </div>
      )}

      <WorkoutForm token={token} onSubmitSuccess={handleWorkoutAdded} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Laden...</p>
      ) : (
        <WorkoutList
          workouts={workouts}
          token={token}
          onUpdateSuccess={handleWorkoutUpdated}
          onDeleteSuccess={handleWorkoutDeleted}
        />
      )}
    </div>
  );
}

export default App;