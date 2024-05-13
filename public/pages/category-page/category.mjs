import { getAllCustomActivites, ACTIVTIES_KEY } from '../../../web_componets/activity-tools.mjs';
import {
  changeSelectedNavbar,
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

function setHeader(str) {
  const title = el.main.querySelector("#customActivtiesCategory")
  const headerList = el.main.querySelector("#titleContainer")
  title.textContent = str
  const backButton = document.createElement("button")
  backButton.textContent = "back"
  backButton.classList.add("bottomsheet-content-item")
  backButton.addEventListener("click", displayCategoryPage)
  headerList.append(backButton)
}
function isActivitiesEmpty(exercises) {
  if (exercises == null || Object.keys(exercises).length == 0) {
    let emptyMessage = document.createElement('p');
    emptyMessage.style = "font-size: 5vw;text-align: center;padding: 5vh;"
    emptyMessage.textContent =
      'press the + at the bottom to make new activties';
    el.content.append(emptyMessage);
    return true
  }
  return false
}
export async function displayCustomCateogryPage() {
  cleanContent()
  setHeader("your exercises")
  const exercises = getAllCustomActivites(ACTIVTIES_KEY);
  if (isActivitiesEmpty(exercises)) {
    return
  }
  for (let item of Object.keys(exercises)) {
    // make a web componenet for the event
    const entry = document.createElement('activity-entry');
    entry.entryID = item;
    entry.classList.add("menu-item")
    el.content.append(entry);
  }
}

async function displayAllActivities() {
  const menu = document.createElement('bottom-sheet-menu');
  const exercises = getAllCustomActivites(ACTIVTIES_KEY);
  if (isActivitiesEmpty(exercises)) {
    return
  }
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

  const titleContainer = document.createElement('ul');
  titleContainer.id = "titleContainer";

  const title = document.createElement('h1');
  title.textContent = 'categories';
  title.id = 'customActivtiesCategory';
  title.classList.add('menu-title');

  const customActivties = document.createElement('h2');
  customActivties.classList.add('menu-title');
  customActivties.textContent = 'your exercises';
  customActivties.id = 'customActivtiesCategory';
  customActivties.classList.add('category-item');
  customActivties.classList.add('menu-item');

  const allActivties = document.createElement('h2');
  allActivties.classList.add('menu-title');
  allActivties.textContent = 'all activties';
  allActivties.id = 'all-activities';
  allActivties.classList.add('category-item', "menu-item");
  allActivties.classList.add('menu-item');

  const container = document.createElement('ul');
  container.id = "categoryContainer"
  container.style = `display: flex; flex-direction: column;overflow-y: scroll;height: 75vh;`
  el.main.append(titleContainer, container);
  container.append(customActivties, allActivties);
  titleContainer.append(title)
  prepareHandles()
  customActivties.addEventListener('click', displayCustomCateogryPage, {});
  allActivties.addEventListener('click', displayAllActivities, {});
}

prepareHandles();
