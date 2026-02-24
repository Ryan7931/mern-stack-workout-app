import { useState } from 'react';
import UpdateWorkout from './UpdateWorkout';
import DeleteWorkout from './DeleteWorkout';

function WorkoutItem({ workout, token, onUpdateSuccess, onDeleteSuccess }) {
  // Item weergave voor één workout; opent edit formulier en doorgeeft token aan children
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    if (onUpdateSuccess) {
      onUpdateSuccess();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
      {isEditing ? (
        // Geef token door aan edit-form zodat PATCH request geautoriseerd is
        <UpdateWorkout
          workoutId={workout._id}
          currentTitle={workout.title}
          currentReps={workout.reps}
          currentLoad={workout.load}
          token={token}
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <h3>{workout.title}</h3>
          <p>Reps: {workout.reps}</p>
          <p>Load: {workout.load} kg</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleEditClick}>Bewerk</button>
            {/* // Geef token door aan delete-knop zodat DELETE request geautoriseerd is */}
            <DeleteWorkout
              workoutId={workout._id}
              workoutTitle={workout.title}
              token={token}
              onDeleteSuccess={onDeleteSuccess}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default WorkoutItem;
