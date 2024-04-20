import { newPlaylistMenu } from '../web_componets/new-playlist-menu/new_playlist_menu.mjs';
import {
  ACTIVTIES_KEY,
  PLAYLIST_KEY,
  USER_KEY,
  changeSelectedNavbar,
  createButton,
  popuplateLocal,
  user,
} from '../web_componets/utilities.mjs';
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
  const para = document.createElement("h1")
  para.classList.add("menu-title")
  para.textContent = "users"
  el.main.append(para);

  if (user()) {
    console.log(user());
    const account = await fetch(`users/${user()}`).then((res) => {
      return res.json();
    });
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
      signIn(user.user_id);
    });
    el.main.append(userPara);
    userPara.append(signInbutton);
  }
}

async function signOut() {
  localStorage[USER_KEY] = '';
  localStorage[ACTIVTIES_KEY] = '{}';
  localStorage[PLAYLIST_KEY] = '{}';
  await displayProfiles();
}

async function signIn(accountKey) {
  localStorage[USER_KEY] = accountKey;
  await popuplateLocal();
  await displayProfiles();
}
prepareHandles();
