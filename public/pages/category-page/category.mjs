import { getAllCustomActivites, ACTIVTIES_KEY } from '../../../web_componets/activity-tools.mjs';
import {
  changeSelectedNavbar,
  fetchFragment,
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
  const headerList = el.main.querySelector("#titleContainer")
  el.title.textContent = str
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

  const titleContainer = await fetchFragment(import.meta.resolve("./category-title.inc"))
  const userActivities = await fetchFragment(import.meta.resolve("./category-item.inc"))
  const allActivities = await fetchFragment(import.meta.resolve("./category-item.inc"))
  allActivities.textContent = "all exercises"
  userActivities.textContent = "your exercises"

  const container = await fetchFragment(import.meta.resolve("./category-list.inc"))
  el.main.append(titleContainer, container);
  container.append(userActivities, allActivities);
  prepareHandles()
  userActivities.addEventListener('click', displayCustomCateogryPage);
  allActivities.addEventListener('click', displayAllActivities);
}

prepareHandles();
