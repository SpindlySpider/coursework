import { getAllCustomActivites, ACTIVTIES_KEY } from '../../../web_componets/activity-tools.mjs';
import { getActivtyFromID } from '../../web_componets/activity-tools.mjs';
import { TAG_KEY, getTags } from '../../web_componets/tag-tools.mjs';
import {
  changeSelectedNavbar,
  fetchFragment,
  isLocalStorageEmpty,
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

async function isActivitiesEmpty(exercises) {
  if (exercises == null || Object.keys(exercises).length == 0) {
    let emptyMessage = document.createElement('p');
    emptyMessage.style = "font-size: 5vw;text-align: center;padding: 5vh;"
    emptyMessage.textContent =
      'press the + at the bottom to make new activties';
    el.content.append(emptyMessage);
    return true
  }
  console.log("execse", exercises)
  for (let item of Object.keys(exercises)) {
    // console.log("activity", item)
    await getTags(item, ACTIVTIES_KEY)
  }
  return false
}

export async function displayCustomCateogryPage() {
  cleanContent()
  setHeader("Your Exercises")
  const exercises = getAllCustomActivites(ACTIVTIES_KEY);
  if (await isActivitiesEmpty(exercises)) {
    return
  }
  for (let item of Object.keys(exercises)) {
    // make a web componenet for the event
    const entry = document.createElement('activity-entry');
    entry.entryID = item;
    console.log(exercises[item].created_by)
    if (user() === exercises[item].created_by) {
      entry.classList.add("menu-item")
      el.content.append(entry);
      entry.editable = true
    }
  }
}

async function displayAllActivities() {
  cleanContent()
  setHeader("All Exercises")
  const exercises = getAllCustomActivites(ACTIVTIES_KEY);
  if (await isActivitiesEmpty(exercises)) {
    return
  }
  for (let item of Object.keys(exercises)) {
    // make a web componenet for the event
    const entry = document.createElement('activity-entry');
    entry.entryID = item;
    if (user() !== exercises[item].created_by) {
      entry.editable = false
    }
    entry.classList.add("menu-item")
    el.content.append(entry);
  }
}

async function getTagActivites(tag, exercises) {
  cleanContent()
  setHeader(tag)
  exercises = await fetch(`/tags/${tag}/get-activities`).then(res => res.json());
  // exercises = exercises.data.map((item) => item.activity_id)
  let list = []
  console.log("tafgsdfsdf", exercises)
  for (let exercise of exercises.data) {
    list.push(await getActivtyFromID(exercise.activity_id))
  }
  if (await isActivitiesEmpty(list)) {
    return
  }
  for (let index = 0; index < exercises.data.length; index++) {
    // make a web componenet for the event
    const entry = document.createElement('activity-entry');
    entry.entryID = exercises.data[index].activity_id;
    if (user() !== list[index].created_by) {
      entry.editable = false
    }
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
  if (isLocalStorageEmpty(TAG_KEY) !== undefined) {
    const tagJSON = JSON.parse(localStorage.getItem(TAG_KEY))
    for (let key of Object.keys(tagJSON)) {
      console.log("tag", key, tagJSON[key])
      const tagSelect = await fetchFragment(import.meta.resolve("./category-item.inc"))
      tagSelect.textContent = key
      tagSelect.addEventListener("click", () => { getTagActivites(key, tagJSON[key].activites) })
      container.append(tagSelect);
    }
  }

  prepareHandles()
  userActivities.addEventListener('click', displayCustomCateogryPage);
  allActivities.addEventListener('click', displayAllActivities);
}

prepareHandles();
