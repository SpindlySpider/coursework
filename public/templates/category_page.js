export const categeoryTemplate = document.createElement('template');
export const customCategeoryTemplate = document.createElement('template');

customCategeoryTemplate.innerHTML = `
<h1 id="custom-categories">custom categories</h1>
`;

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
