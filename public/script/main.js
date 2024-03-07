import { displayCategoryPage } from './category_scripts/category_page.js';

function displayNewEntryOptions() {
  if (document.querySelector('#newActivtyPopup') == null) {
    const newActivty = document.createElement('li');
    newActivty.id = 'newActivtyPopup';
    newActivty.textContent = 'create new activity';
    newActivty.classList.add('right-floating-notification');
    const container = document.querySelector('#app-container');
    container.append(newActivty);
  } else {
    document.querySelector('#newActivtyPopup').remove();
  }
}

document
  .querySelector('#new-entry')
  .addEventListener('click', displayNewEntryOptions);
document
  .querySelector('#catagories')
  .addEventListener('click', displayCategoryPage);
