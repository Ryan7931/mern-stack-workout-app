import { useState } from 'react';
import UpdateWorkout from './UpdateWorkout';
import DeleteWorkout from './DeleteWorkout';

function WorkoutItem({ workout, onUpdateSuccess, onDeleteSuccess }) {
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
        <UpdateWorkout
          workoutId={workout._id}
          currentTitle={workout.title}
          currentReps={workout.reps}
          currentLoad={workout.load}
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
            <DeleteWorkout
              workoutId={workout._id}
              workoutTitle={workout.title}
              onDeleteSuccess={onDeleteSuccess}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default WorkoutItem;
