import WorkoutItem from './WorkoutItem';


function WorkoutList({ workouts, token, onUpdateSuccess, onDeleteSuccess }) {
  // Lijst van workouts; geeft token door aan elk item zodat child-components headers kunnen sturen
  if (workouts.length === 0) {
    return <p>Geen workouts gevonden</p>;
  }

  return (
    <div>
      {/* Voor elke workout renderen we één WorkoutItem */}
      {workouts.map(workout => (
        <WorkoutItem
          key={workout._id}
          workout={workout}
          token={token}
          onUpdateSuccess={onUpdateSuccess}
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </div>
  );
}

export default WorkoutList;
