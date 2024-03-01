function newActivityPageDisplay() {

}

function displayNewEntryOptions() {
  if (document.querySelector('#newActivtyPopup') == null) {
    const newActivty = document.createElement('div');
    newActivty.id = 'newActivtyPopup';
    newActivty.textContent = 'create new activity';
    newActivty.classList.add('right-floating-notification');
    const container = document.querySelector('#app-container');
    container.append(newActivty);
  } else {
    document.querySelector('#newActivtyPopup').remove();
  }
}

document.querySelector('#new-entry').addEventListener('click', displayNewEntryOptions);
