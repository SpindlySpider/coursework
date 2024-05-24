import { getAllCustomActivites, ACTIVTIES_KEY } from '../../../web_componets/activity-tools.mjs';
import {
  changeSelectedNavbar,
  fetchFragment,
  user,
} from '../../web_componets/utilities.mjs';

const el = {};

function cleanContent() {
  el.content.textContent = ""
  el.title.textContent = ""
}

function prepareHandles() {
  el.main = document.querySelector('#main-content');
  el.content = el.main.querySelector("#categoryContainer")
  el.title = el.main.querySelector("#customActivtiesCategory")
  el.headerList = el.main.querySelector("#titleContainer")
}

function setHeader(str) {
  el.title.textContent = str
  const backButton = document.createElement("button")
  backButton.textContent = "<"
  backButton.classList.add("bottomsheet-content-item")
  backButton.style.padding = "1vh 1vw"
  backButton.style.width = "10vw"
  backButton.addEventListener("click", displayCategoryPage)
  el.headerList.prepend(backButton)
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
  setHeader("Your Exercises")
  const exercises = getAllCustomActivites(ACTIVTIES_KEY);
  if (isActivitiesEmpty(exercises)) {
    return
  }
  for (let item of Object.keys(exercises)) {
    // make a web componenet for the event
    const entry = document.createElement('activity-entry');
    entry.entryID = item;
    console.log(exercises[item].created_by)
    if (user() !== exercises[item].created_by) {
      entry.editable = false
    }
    entry.classList.add("menu-item")
    el.content.append(entry);
  }
}

async function displayAllActivities() {
  cleanContent()
  setHeader("All Exercises")
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

export async function displayCategoryPage() {
  changeSelectedNavbar('#catagories');

  const titleContainer = await fetchFragment(import.meta.resolve("./category-title.inc"))
  const userActivities = await fetchFragment(import.meta.resolve("./category-item.inc"))
  const allActivities = await fetchFragment(import.meta.resolve("./category-item.inc"))
  allActivities.textContent = "All Exercises"
  userActivities.textContent = "Your Exercises"
  const container = await fetchFragment(import.meta.resolve("./category-list.inc"))
  el.main.append(titleContainer, container);
  container.append(userActivities, allActivities);
  prepareHandles()
  userActivities.addEventListener('click', displayCustomCateogryPage);
  allActivities.addEventListener('click', displayAllActivities);
}

prepareHandles();
