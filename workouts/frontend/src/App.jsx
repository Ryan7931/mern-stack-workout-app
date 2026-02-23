import { useEffect, useState } from 'react';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/workouts');
      if (!response.ok) {
        throw new Error('Fout bij het ophalen van workouts');
      }
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      setError('Fout bij het ophalen van workouts');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleWorkoutAdded = () => {
    fetchWorkouts();
  };

  const handleWorkoutUpdated = () => {
    fetchWorkouts();
  };

  const handleWorkoutDeleted = () => {
    fetchWorkouts();
  };

  return (
    <div className="App">
      <h1>Workouts</h1>
      <WorkoutForm onSubmitSuccess={handleWorkoutAdded} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Laden...</p>
      ) : (
        <WorkoutList
          workouts={workouts}
          onUpdateSuccess={handleWorkoutUpdated}
          onDeleteSuccess={handleWorkoutDeleted}
        />
      )}
    </div>
  );
}

export default App;