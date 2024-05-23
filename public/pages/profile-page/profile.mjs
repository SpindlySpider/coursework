import { ACTIVTIES_KEY } from '../../web_componets/activity-tools.mjs';
import { PLAYLIST_KEY } from '../../web_componets/playlist-tools.mjs';
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
    const themes = frag.querySelector("#themes")
    welcomeMessage.textContent = `hello ${account.data[0].username}`
    const signOutButton = frag.querySelector("#sign-out")
    signOutButton.addEventListener('click', signOut)
    el.main.append(welcomeMessage, signOutButton, themes);
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
  await displayProfiles();
}

async function signIn(userData) {
  document.querySelector("toast-notification").addNotification(`logged in as ${userData.username}`, 2000)
  console.log("userdat", userData)
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
