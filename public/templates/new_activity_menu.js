export const newActivtyMenuTemplate = document.createElement('template');
newActivtyMenuTemplate.innerHTML = `
<style>
:root{
  --drag-bar-color:#1e90ff;
}
*{
  font-size:20px;
  padding : 15px 20px 10px 20px 
}
#dragElement{
  width:50px;
  height:10px;
  background-color:red;
}
header, main{
  display:flex;
  flex-direction: column;
}
</style>
<header>
    <div id="dragElement"></div>
    <div id="activtyMenuHeading">
        <button id="exit">exit</button>
        <input id="activityNameInput"></input>
        <button id="doneButton">done</button>
    </div>
  </header>
  <main>
     <input id="descriptionInput"></input>
    <div class="column-group">
        <duration-picker id="timeInput"></duration-picker>
        <input id="addPhoto"></input>
        <div id="tags"></div>
        <div id="required equipment"></div>
    </div>
      </main>
`;
