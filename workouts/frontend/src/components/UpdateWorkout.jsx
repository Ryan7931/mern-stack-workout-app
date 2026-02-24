import { useState } from 'react';

function UpdateWorkout({ workoutId, currentTitle, currentReps, currentLoad, token, onUpdateSuccess, onCancel }) {
  // Formulier om een bestaande workout te bewerken; vereist token (owner-check op backend)
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
      // Controleer of token aanwezig is (frontend guard). Backend doet ook owner-check.
      if (!token) {
        setError('Je moet ingelogd zijn');
        setLoading(false);
        return;
      }

      // Zet headers (Content-Type + Authorization)
      const headers = { 'Content-Type': 'application/json' };
      headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:4000/api/workouts/${workoutId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updatedWorkout)
      });

      // Parse response en handel serverreactie af
      const data = await response.json();

      if (response.ok) {
        // Succes: laat parent opnieuw ophalen
        console.log('Workout aangepast!', data);
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        // Fout (validatie of autorisatie)
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
