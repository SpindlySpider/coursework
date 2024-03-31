import { getAllCustomActivites } from '../../web_componets/utilities.mjs';

export async function displayCustomCateogryPage() {
  const main = document.querySelector('#main-content');
  const menu = document.createElement('bottom-sheet-menu');
  const customActivties = getAllCustomActivites();
  await menu.attachTemplate();
  menu.setTitle('custom categories');
  main.appendChild(menu);
  for (let item of Object.keys(customActivties)) {
    // make a web componenet for the event
    const entry = document.createElement('activity-entry');
    entry.customTitle = customActivties[item].title;
    entry.entryID = item;
    entry.classList.add('bottomsheet-content-item');
    menu.appendEntry(entry);
  }
}

export async function displayCategoryPage() {
  const main = document.querySelector('#main-content');
  const menu = document.createElement('bottom-sheet-menu');

  const customActivties = document.createElement('h1');
  customActivties.textContent = 'custom activties';
  customActivties.classList.add('bottomsheet-content-item');
  customActivties.id = 'customActivtiesCategory';

  await menu.attachTemplate();
  main.appendChild(menu);
  menu.appendEntry(customActivties);
  menu.setTitle('categories');
  menu.shadow
    .querySelector('#customActivtiesCategory')
    .addEventListener('click', displayCustomCateogryPage);
}
