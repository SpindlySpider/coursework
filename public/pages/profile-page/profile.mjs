import { ACTIVTIES_KEY } from '../../web_componets/activity-tools.mjs';
import { PLAYLIST_KEY } from '../../web_componets/playlist-tools.mjs';
import { TAG_KEY } from '../../web_componets/tag-tools.mjs';
import {
  USER_KEY,
  changeSelectedNavbar,
  fetchFragment,
  popuplateLocal,
  user,
} from '../../web_componets/utilities.mjs';

const el = {};

function prepareHandles() {
  el.main = document.querySelector('#main-content');
  el.navbar = document.querySelector('#navbar');
}

function lightThemeChange() {
  console.log("light theme")
  for (let icon of document.querySelectorAll(".icon")) {
    icon.style.filter = "invert(0)"
  }
  document.documentElement.style.setProperty('--nav-bar-background-color', 'white');
  document.documentElement.style.setProperty('--text-colour', 'black');
  document.documentElement.style.setProperty('--button-colour', '#589aff');
  document.documentElement.style.setProperty('--button-alternative', '#ff5a34');
  document.documentElement.style.setProperty('--border-colour', 'gray');
  document.documentElement.style.setProperty('--background-color', '#EEEEEE');
  document.documentElement.style.setProperty('--foreground-color', 'white');
  document.documentElement.style.setProperty('--banner-color', 'white');
}
function darkThemeChange() {
  console.log("dark theme")
  for (let icon of document.querySelectorAll(".icon")) {
    icon.style.filter = "invert(1)"
  }
  document.documentElement.style.setProperty('--nav-bar-background-color', '#292244');
  document.documentElement.style.setProperty('--text-colour', '#ffebeb');
  document.documentElement.style.setProperty('--button-colour', '#774eea');
  document.documentElement.style.setProperty('--button-alternative', '#ff5a34');
  document.documentElement.style.setProperty('--border-colour', '#9c9595');
  document.documentElement.style.setProperty('--background-color', '#120F1C');
  document.documentElement.style.setProperty('--foreground-color', '#292244');
  document.documentElement.style.setProperty('--banner-color', '#292244');
}

export async function displayProfiles() {
  changeSelectedNavbar('#profile');
  const users = await fetch('users/').then((res) => {
    return res.json();
  });
  const title = await fetchFragment(import.meta.resolve("./profile-title.inc"))
  el.main.append(title);

  if (user()) {
    const account = await fetch(`users/${user()}`).then((res) => res.json());
    const frag = await fetchFragment(import.meta.resolve("./profile-signed-in-user.inc"))
    const welcomeMessage = frag.querySelector("#welcome-message")
    const headGroup = frag.querySelector("#user-group")
    const themes = frag.querySelector("#themes")
    const lightTheme = frag.querySelector("#light-theme")
    const darkTheme = frag.querySelector("#dark-theme")
    lightTheme.addEventListener("click", lightThemeChange)
    darkTheme.addEventListener("click", darkThemeChange)
    welcomeMessage.textContent = `${account.data[0].username}`
    const signOutButton = frag.querySelector("#sign-out")
    signOutButton.addEventListener('click', signOut)
    el.main.append(headGroup, themes);
    return;
  }
  for (let user of users.data) {
    const frag = await fetchFragment(import.meta.resolve("./profile-users.inc"))
    const userPara = frag.querySelector("#username");
    userPara.classList.add("menu-item")
    const signInbutton = frag.querySelector("#login-button");
    userPara.textContent = user.username;
    userPara.dataset.id = user.user_id;
    signInbutton.addEventListener('click', () => {
      signIn(user);
    });
    el.main.append(frag);
  }
}

async function signOut() {
  document.querySelector("toast-notification").addNotification(`signed out`, 2000)
  localStorage[USER_KEY] = '{}';
  localStorage[ACTIVTIES_KEY] = '{}';
  localStorage[PLAYLIST_KEY] = '{}';
  localStorage[TAG_KEY] = '{}';
  await displayProfiles();
}

async function signIn(userData) {
  document.querySelector("toast-notification").addNotification(`logged in as ${userData.username}`, 2000)
  localStorage.setItem(USER_KEY, JSON.stringify({
    user: userData.user_id,
    username: userData.username,
    exercise_time: userData.exercise_time,
    workout_finished: userData.workouts_finished
  }));
  await popuplateLocal();
  await displayProfiles();
}
prepareHandles();
