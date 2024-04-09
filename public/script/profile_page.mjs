import { newPlaylistMenu } from '../web_componets/new-playlist-menu/new_playlist_menu.mjs';
import {
  USER_KEY,
  changeSelectedNavbar,
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

  if (user()) {
    console.log(user());
    const account = await fetch(`users/${user()}`).then((res) => {
      return res.json();
    });
    console.log(account);
    console.log(account.data[0].username);
    const text = document.createElement('h1');
    const signInbutton = document.createElement('button');
    signInbutton.textContent = 'sign out';
    text.textContent = `hello ${account.data[0].username}`;
    signInbutton.addEventListener('click', signOut);
    el.main.append(text);
    el.main.append(signInbutton);
    return;
  }
  console.log(users);
  for (let user of users.data) {
    const userPara = document.createElement('li');
    const signInbutton = document.createElement('button');
    signInbutton.textContent = 'login';
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
  await displayProfiles();
}

async function signIn(accountKey) {
  localStorage[USER_KEY] = accountKey;
  await displayProfiles();
}
prepareHandles();
