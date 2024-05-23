import { user } from "./utilities.mjs";

export async function updateUser(workoutCompletedNumber, exercise_time) {
  const res = await fetch(`users/${user()}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workouts_finished: workoutCompletedNumber, exercise_time }),
  });
}

