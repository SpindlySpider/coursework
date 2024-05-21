import { ACTIVTIES_KEY } from '../../web_componets/activity-tools.mjs';
import { PLAYLIST_KEY } from '../../web_componets/playlist-tools.mjs';
import {
  USER_KEY,
  changeSelectedNavbar,
  createButton,
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
    const text = document.createElement('h1');
    const signOutbutton = createButton('sign out');
    text.classList.add("menu-title")
    text.textContent = `hello ${account.data[0].username}`;
    signOutbutton.addEventListener('click', signOut);
    signOutbutton.style.width = "34vw"
    el.main.append(text);
    el.main.append(signOutbutton);
    return;
  }
  for (let user of users.data) {
    const userPara = document.createElement('li');
    userPara.classList.add("menu-item")
    const signInbutton = createButton('login');
    userPara.textContent = user.username;
    userPara.dataset.id = user.user_id;
    signInbutton.addEventListener('click', () => {
      signIn(user);
    });
    el.main.append(userPara);
    userPara.append(signInbutton);
  }
}

async function signOut() {
  document.querySelector("toast-notification").addNotification(`signed out`, 2000)
  localStorage[USER_KEY] = '';
  localStorage[ACTIVTIES_KEY] = '{}';
  localStorage[PLAYLIST_KEY] = '{}';
  await displayProfiles();
}

async function signIn(userData) {
  document.querySelector("toast-notification").addNotification(`logged in as ${userData.username}`, 2000)
  localStorage[USER_KEY] = userData.user_id;
  await popuplateLocal();
  await displayProfiles();
}
prepareHandles();
