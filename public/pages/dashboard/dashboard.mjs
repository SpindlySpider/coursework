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

export async function displayDashboardPage() {
  console.log("clicked")
  changeSelectedNavbar('#dashboard');

  // const titleContainer = await fetchFragment(import.meta.resolve("./category-title.inc"))
  // const userActivities = await fetchFragment(import.meta.resolve("./category-item.inc"))
  // const allActivities = await fetchFragment(import.meta.resolve("./category-item.inc"))
  // allActivities.textContent = "all exercises"
  // userActivities.textContent = "your exercises"

  // const container = await fetchFragment(import.meta.resolve("./category-list.inc"))
  // el.main.append(titleContainer, container);
  // container.append(userActivities, allActivities);
  // cleanContent()
  // userActivities.addEventListener('click', displayCustomCateogryPage);
  // allActivities.addEventListener('click', displayAllActivities);
}

prepareHandles();
