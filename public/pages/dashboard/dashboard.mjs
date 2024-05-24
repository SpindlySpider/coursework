import {
  USER_KEY,
  changeSelectedNavbar,
  getFormatStringTime,
  user,
} from '../../web_componets/utilities.mjs';

const el = {};

function prepareHandles() {
  el.main = document.querySelector('#main-content');
  el.content = el.main.querySelector('#categoryContainer');
  el.title = el.main.querySelector('#customActivtiesCategory');
}

export async function displayDashboardPage() {
  changeSelectedNavbar('#dashboard');
  const res = await fetch(import.meta.resolve('./dashboard.html'));
  el.main.innerHTML = await res.text();
  if (!user()) {
    // please login
    el.main.querySelector('#user-greeting').textContent = 'Please login to access features';
    el.main.querySelector('#exercise').style.display = 'none';
    el.main.querySelector('#workouts').style.display = 'none';
    return;
  }
  const userJSON = JSON.parse(localStorage.getItem(USER_KEY));
  const username = userJSON.username;
  el.main.querySelector('#user-greeting').textContent = `Hello ${username},`;
  el.main.querySelector('#exercise').textContent = `You have exercised for: ${getFormatStringTime(userJSON.exercise_time)}`;
  el.main.querySelector('#workouts').textContent = `Total workouts completed: ${userJSON.workout_finished}`;
}

prepareHandles();
