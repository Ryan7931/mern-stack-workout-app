import { useState } from 'react';

function WorkoutForm({ onSubmitSuccess, token }) {
  const [title, setTitle] = useState('');
  const [reps, setReps] = useState('');
  const [load, setLoad] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const workout = { 
      title, 
      reps: Number(reps), 
      load: Number(load) 
    };

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('http://localhost:4000/api/workouts', {
        method: 'POST',
        headers,
        body: JSON.stringify(workout)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Workout aangemaakt!', data);
        setTitle('');
        setReps('');
        setLoad('');
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        setError(data.error || 'Fout bij het aanmaken van workout');
        console.error('Error:', data.error);
      }
    } catch (error) {
      setError('Netwerkfout bij het aanmaken van workout');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Load (kg)"
        value={load}
        onChange={(e) => setLoad(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Bezig...' : 'Toevoegen'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default WorkoutForm;
