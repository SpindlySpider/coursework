import { saveActivty } from './utilities.js';

const template = document.createElement('template');

template.innerHTML = `
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
      <input id="timeInput" type="time"></input>
        <input id="addPhoto"></input>
        <div id="tags"></div>
        <div id="required equipment"></div>
    </div>
      </main>
`;
class newActivtyMenu extends HTMLElement {
  // might be able to abstract this out and then add custom elements to it and use it just as a menu for all things
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = template.innerHTML;
    this.donebutton = this.shadow.querySelector('#doneButton');
  }

  connectedCallback() {
    this.donebutton.addEventListener('click', this.saveNewActivty.bind(this));
    // set up event listners here
  }

  disconnectedCallback() {}

  saveNewActivty() {
    // should abtract this to a general store activties/ edit activites
    const title = this.shadow.querySelector('#activityNameInput').value;
    const description = this.shadow.querySelector('#descriptionInput').value;
    const duration = this.shadow.querySelector('#timeInput').value;
    const UUID = crypto.randomUUID();
    saveActivty(UUID, title, description, duration);
  }
}
customElements.define('new-activty-menu', newActivtyMenu);
