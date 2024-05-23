import { getAllCustomActivites, ACTIVTIES_KEY } from '../../../web_componets/activity-tools.mjs';
import {
  USER_KEY,
  changeSelectedNavbar,
  fetchFragment,
  fetchTemplate,
  getFormatStringTime,
  user,
} from '../../web_componets/utilities.mjs';

const el = {};

function cleanContent() {
  el.content.textContent = ""
}

function prepareHandles() {
  el.main = document.querySelector('#main-content');
  el.content = el.main.querySelector("#categoryContainer")
  el.title = el.main.querySelector("#customActivtiesCategory")
}

export async function displayDashboardPage() {
  console.log("clicked")
  changeSelectedNavbar('#dashboard');
  const res = await fetch(import.meta.resolve("./dashboard.html"));
  el.main.innerHTML = await res.text();
  if (!user()) {
    // please login
    el.main.querySelector("#user-greeting").textContent = `please login to access features`
    el.main.querySelector("#exercise").style.display = "none"
    el.main.querySelector("#workouts").style.display = "none"
    return
  }
  const userJSON = JSON.parse(localStorage.getItem(USER_KEY))
  const username = userJSON.username
  el.main.querySelector("#user-greeting").textContent = `hello ${username}`
  el.main.querySelector("#exercise").textContent = `you have exercised for ${getFormatStringTime(userJSON.exercise_time)} over all`
  el.main.querySelector("#workouts").textContent = `you have completed ${userJSON.workout_finished} workouts`

}

prepareHandles();
