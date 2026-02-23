import { useState } from 'react';

function DeleteWorkout({ workoutId, workoutTitle, onDeleteSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!confirm(`Weet je zeker dat je "${workoutTitle}" wilt verwijderen?`)) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/workouts/${workoutId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Workout verwijderd!', data);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } else {
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
