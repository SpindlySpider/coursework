import { saveActivty } from './utilities.js';
import { newActivtyMenuTemplate } from '../templates/new_activity_menu.js';
class newActivtyMenu extends HTMLElement {
  // might be able to abstract this out and then add custom elements to it and use it just as a menu for all things
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = newActivtyMenuTemplate.innerHTML;
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
