import { getAllCustomActivites } from '../../web_componets/utilities.mjs';

const el = {};

function prepareHandles() {
  el.main = document.querySelector('#main-content');
}
export async function displayCustomCateogryPage() {
  const menu = document.createElement('bottom-sheet-menu');
  const customActivties = getAllCustomActivites();
  await menu.attachTemplate();
  menu.addButton.style.display = 'none';
  menu.setTitle('custom categories');
  el.main.append(menu);
  if (customActivties == null) {
    let emptyMessage = document.createElement('p');
    emptyMessage.textContent =
      'press the + at the bottom to make new activties';
    menu.appendEntry(emptyMessage);
    return;
  }
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
  el.main.textContent = '';

  const customActivties = document.createElement('h2');
  customActivties.textContent = 'custom activties';
  customActivties.id = 'customActivtiesCategory';
  customActivties.classList.add('category-item');

  const title = document.createElement('h1');
  title.textContent = 'categories';
  title.classList.add('bottomsheet-content-item');
  title.id = 'customActivtiesCategory';

  const container = document.createElement('ul');
  container.style.display = 'flex';
  container.style.flexDirection = 'row';

  el.main.appendChild(title);
  el.main.append(container);
  container.appendChild(customActivties);
  customActivties.addEventListener('click', displayCustomCateogryPage);
}
prepareHandles();
