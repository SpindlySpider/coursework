import {
  categeoryTemplate,
  customCategeoryTemplate,
} from '../../templates/category_page.js';
import { getAllCustomActivites } from '../../web_componets/utilities.js';

export function displayCustomCateogryPage() {
  const main = document.querySelector('#main-content');
  main.innerHTML = customCategeoryTemplate.innerHTML;
  const customActivties = getAllCustomActivites();
  console.log(customActivties);
  for (let item of Object.keys(customActivties)) {
    // make a web componenet for the event
    const entry = document.createElement('p');
    entry.textContent = customActivties[item].title;
    main.appendChild(entry);
  }
}

export function displayCategoryPage() {
  const main = document.querySelector('#main-content');
  main.innerHTML = categeoryTemplate.innerHTML;
  document
    .querySelector('#customActivtiesCategory')
    .addEventListener('click', displayCustomCateogryPage);
}
