import { useState } from 'react';

function DeleteWorkout({ workoutId, workoutTitle, token, onDeleteSuccess }) {
  // Verwijderknop voor een workout; stuurt Authorization header mee bij DELETE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!confirm(`Weet je zeker dat je "${workoutTitle}" wilt verwijderen?`)) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Zorg dat er een token is; zonder token kunnen we de eigenaar niet verifiëren
      if (!token) {
        setError('Je moet ingelogd zijn');
        setLoading(false);
        return;
      }

      // Authorization header voor backend owner-check
      const headers = {};
      headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:4000/api/workouts/${workoutId}`, {
        method: 'DELETE',
        headers
      });

      // Parse response en controleer resultaat
      const data = await response.json();

      if (response.ok) {
        // Succes — vraag parent om data te verversen
        console.log('Workout verwijderd!', data);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } else {
        // Server gaf een fout (bijv. niet jouw workout)
        setError(data.error || 'Fout bij het verwijderen van workout');
        console.error('Error:', data.error);
      }
    } catch (error) {
      setError('Netwerkfout bij het verwijderen van workout');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={loading} style={{ backgroundColor: 'red', color: 'white' }}>
        {loading ? 'Bezig...' : 'Verwijderen'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default DeleteWorkout;
