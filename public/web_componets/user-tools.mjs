import { user } from "./utilities.mjs";

export async function updateUserExerciseTime(duration) {
  const res = await fetch(`users/${user()}/exercise-time`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ exercise_time: duration }),
  });
}
export async function updateUser(completedNumber) {
  const res = await fetch(`users/${user()}/workout-finished`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workouts_finished: completedNumber }),
  });
}
export async function updateUserFinishedActivity(activity_id, number) {
  const res = await fetch(`users/${user()}/activity-finished`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activity_id,finished:number}),
  });
}
export async function updateUserFinishedPlaylist(playlist_id, number) {
  const res = await fetch(`users/${user()}/playlist-finished`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playlist_id,finished:number}),
  });
}
