import { useEffect, useState } from 'react';

function WorkoutForm() {
  const [title, setTitle] = useState('');
  const [reps, setReps] = useState('');
  const [load, setLoad] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workout = { 
      title, 
      reps: Number(reps), 
      load: Number(load) 
    };

    const response = await fetch('http://localhost:4000/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workout)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Workout aangemaakt!', data);
      // Reset form
      setTitle('');
      setReps('');
      setLoad('');
    } else {
      console.error('Error:', data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <input
        type="number"
        placeholder="Load (kg)"
        value={load}
        onChange={(e) => setLoad(e.target.value)}
      />
      <button type="submit">Toevoegen</button>
    </form>
  );
}

function UpdateWorkout({ workoutId, currentTitle, currentReps, currentLoad, onUpdateSuccess }) {
  const [title, setTitle] = useState(currentTitle);
  const [reps, setReps] = useState(currentReps);
  const [load, setLoad] = useState(currentLoad);

  const handleUpdate = async (e) => {
    e.preventDefault();

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
        onUpdateSuccess();
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <input
        type="number"
        placeholder="Load (kg)"
        value={load}
        onChange={(e) => setLoad(e.target.value)}
      />
      <button type="submit">Aanpassen</button>
    </form>
  );
}

function DeleteWorkout({ workoutId, workoutTitle, onDeleteSuccess }) {
  const handleDelete = async () => {
    // Bevestiging vragen
    if (!confirm(`Weet je zeker dat je "${workoutTitle}" wilt verwijderen?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/workouts/${workoutId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Workout verwijderd!', data);
        onDeleteSuccess();
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <button onClick={handleDelete}>
      Verwijderen
    </button>
  );
}

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/workouts');
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleUpdateSuccess = () => {
    fetchWorkouts();
    setEditingId(null);
  };

  return (
    <div className="App">
      <h1>Workouts</h1>
      <WorkoutForm />
      {workouts.length === 0 ? (
        <p>Geen workouts gevonden</p>
      ) : (
        workouts.map(workout => (
          <div key={workout._id}>
            {editingId === workout._id ? (
              <UpdateWorkout
                workoutId={workout._id}
                currentTitle={workout.title}
                currentReps={workout.reps}
                currentLoad={workout.load}
                onUpdateSuccess={handleUpdateSuccess}
              />
            ) : (
              <>
                <h3>{workout.title}</h3>
                <p>Reps: {workout.reps}</p>
                <p>Load: {workout.load} kg</p>
                <button onClick={() => setEditingId(workout._id)}>Bewerk</button>
                <DeleteWorkout
                  workoutId={workout._id}
                  workoutTitle={workout.title}
                  onDeleteSuccess={fetchWorkouts}
                />
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;