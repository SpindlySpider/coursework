function newActivityPageDisplay() {}

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
const categeoryTemplate = document.createElement('template');

categeoryTemplate.innerHTML = `
<style>
.categoryElement{

}
.centerCategory{
  display:flex;

}
</style>
    <nav class="navbar ">
      <li class="centerCategory navbar-item">list view</li>
      <li class="centerCategory navbar-item">body view</li>
      <li class="centerCategory navbar-item">difficulty</li>
      <li class="rightCategory navbar-item">search</li>
    </nav>
    <ul class = "vertical-item-list">
      <li id = "customActivtiesCategory" class= "categoryElement"> custom activties </li>
    </ul>
`;

function displayCategoryPage() {
  const main = document.querySelector('#main-content');
  main.innerHTML = categeoryTemplate.innerHTML;
  // console.log(':)');
}
document
  .querySelector('#new-entry')
  .addEventListener('click', displayNewEntryOptions);
document
  .querySelector('#catagories')
  .addEventListener('click', displayCategoryPage);
