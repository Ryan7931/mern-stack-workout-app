import { useState } from 'react';

function UpdateWorkout({ workoutId, currentTitle, currentReps, currentLoad, onUpdateSuccess, onCancel }) {
  const [title, setTitle] = useState(currentTitle);
  const [reps, setReps] = useState(currentReps);
  const [load, setLoad] = useState(currentLoad);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const updatedWorkout = { 
      title, 
      reps: Number(reps), 
      load: Number(load) 
    };

    try {
      const response = await fetch(`http://localhost:4000/api/workouts/${workoutId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedWorkout)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Workout aangepast!', data);
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        setError(data.error || 'Fout bij het aanpassen van workout');
        console.error('Error:', data.error);
      }
    } catch (error) {
      setError('Netwerkfout bij het aanpassen van workout');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
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
        {loading ? 'Bezig...' : 'Aanpassen'}
      </button>
      {onCancel && <button type="button" onClick={onCancel}>Annuleren</button>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default UpdateWorkout;
