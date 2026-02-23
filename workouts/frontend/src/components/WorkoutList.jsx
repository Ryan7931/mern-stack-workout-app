import WorkoutItem from './WorkoutItem';

function WorkoutList({ workouts, onUpdateSuccess, onDeleteSuccess }) {
  if (workouts.length === 0) {
    return <p>Geen workouts gevonden</p>;
  }

  return (
    <div>
      {workouts.map(workout => (
        <WorkoutItem
          key={workout._id}
          workout={workout}
          onUpdateSuccess={onUpdateSuccess}
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </div>
  );
}

export default WorkoutList;
