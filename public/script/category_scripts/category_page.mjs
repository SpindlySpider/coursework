import { getAllCustomActivites } from '../../web_componets/utilities.mjs';
export function displayCustomCateogryPage() {
  const main = document.querySelector('#main-content');
  const menu = document.createElement('bottom-sheet-menu');
  main.appendChild(menu);
  menu.setTitle('custom activties');
  const customActivties = getAllCustomActivites();
  for (let item of Object.keys(customActivties)) {
    // make a web componenet for the event
    const entry = document.createElement('activity-entry');
    entry.customTitle = customActivties[item].title;
    entry.entryID = item;
    entry.classList.add('bottomsheet-content-item');
    menu.appendEntry(entry);
  }
}

export function displayCategoryPage() {
  const main = document.querySelector('#main-content');
  const menu = document.createElement('bottom-sheet-menu');
  const customActivties = document.createElement('h1');
  customActivties.textContent = 'custom activties';
  customActivties.classList.add('bottomsheet-content-item');
  customActivties.id = 'customActivtiesCategory';
  main.appendChild(menu);
  menu.setTitle('categories');
  menu.appendEntry(customActivties);
  // put the web componenet here

  menu.shadow
    .querySelector('#customActivtiesCategory')
    .addEventListener('click', displayCustomCateogryPage);
}
