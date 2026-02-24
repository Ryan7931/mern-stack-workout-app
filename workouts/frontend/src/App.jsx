import { useEffect, useState } from 'react';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';
import Auth from './components/Auth';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // token in state — gebruikt om te bepalen of gebruiker ingelogd is
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // Haal workouts van de backend; voegt Authorization header toe als token aanwezig
  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);

    // token uit localStorage (frontend kan token ook uit state gebruiken)
    const token = localStorage.getItem('token');

    if (!token) {
      // geen token => niet ingelogd, stop met ophalen
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
    // Herlaad workouts wanneer token verandert (bij login/logout)
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
    // Token is opgeslagen door Login/Register; update App state
    setToken(newToken);
  };

  const handleLogout = () => {
    // Verwijder token lokaal en reset app state
    localStorage.removeItem('token');
    setToken(null);
    setWorkouts([]);
    console.log('Uitgelogd');
  };

  return (
    <div className="App">
      <h1>Workouts</h1>
      {!token ? (
        <Auth onAuthSuccess={handleLogin} />
      ) : (
        <div style={{ marginBottom: '12px' }}>
          <button onClick={handleLogout}>Uitloggen</button>
        </div>
      )}
      {token && (
        <>
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
        </>
      )}
    </div>
  );
}

export default App;