import { getAllCustomActivites } from '../../web_componets/utilities.mjs';
import {
  ACTIVTIES_KEY,
  changeSelectedNavbar,
  user,
} from '../web_componets/utilities.mjs';

const el = {};

function prepareHandles() {
  el.main = document.querySelector('#main-content');
}
export async function displayCustomCateogryPage() {
  if (document.querySelector('bottom-sheet-menu')) {
    //already have a menu on display
    return;
  }
  const menu = document.createElement('bottom-sheet-menu');
  const customActivties = getAllCustomActivites(ACTIVTIES_KEY);
  await menu.attachTemplate();
  menu.addButton.style.display = 'none';
  menu.setTitle('custom categories');
  el.main.append(menu);
  if (customActivties == null || Object.keys(customActivties).length == 0) {
    let emptyMessage = document.createElement('p');
    emptyMessage.textContent =
      'press the + at the bottom to make new activties';
    menu.appendEntry(emptyMessage);
    return;
  }
  for (let item of Object.keys(customActivties)) {
    // make a web componenet for the event
    const entry = document.createElement('activity-entry');
    entry.entryID = item;
    await entry.attachTemplate();
    entry.classList.add('bottomsheet-content-item');
    menu.appendEntry(entry);
  }
}

async function displayAllActivities() {
  if (document.querySelector('bottom-sheet-menu')) {
    // already have a menu on display
    return;
  }
  const menu = document.createElement('bottom-sheet-menu');
  const customActivties = getAllCustomActivites(ACTIVTIES_KEY);
  await menu.attachTemplate();
  menu.addButton.style.display = 'none';
  menu.setTitle('all activities');
  el.main.append(menu);

  const activities = await fetch(`users/${user()}/activities`).then((res) => {
    return res.json();
  });
  console.log(activities);
  for (let item of activities.data) {
    // make a web componenet for the event
    const entry = document.createElement('activity-entry');
    entry.entryID = item.activity_id;
    await entry.attachTemplate();
    entry.classList.add('bottomsheet-content-item');
    menu.appendEntry(entry);
  }
}

export async function displayCategoryPage() {
  changeSelectedNavbar('#catagories');
  const title = document.createElement('h1');
  title.textContent = 'categories';
  title.id = 'customActivtiesCategory';
  title.classList.add('menu-title');

  const customActivties = document.createElement('h2');
  customActivties.classList.add('menu-title');
  customActivties.textContent = 'custom activties';
  customActivties.id = 'customActivtiesCategory';
  customActivties.classList.add('category-item');
  customActivties.classList.add('menu-item');

  const allActivties = document.createElement('h2');
  allActivties.classList.add('menu-title');
  allActivties.textContent = 'all activties';
  allActivties.id = 'all-activities';
  allActivties.classList.add('category-item');
  allActivties.classList.add('menu-item');

  const container = document.createElement('ul');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

  el.main.appendChild(title);
  el.main.append(container);
  container.append(customActivties, allActivties);
  customActivties.addEventListener('click', displayCustomCateogryPage, {});
  allActivties.addEventListener('click', displayAllActivities, {});
}

prepareHandles();
