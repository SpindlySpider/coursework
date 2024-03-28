import { newActivtyMenu } from './new_activity_menu.mjs';
import { saveActivty } from './utilities.mjs';
export class editMenu extends newActivtyMenu {
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.entryID = '';
    this.nameInput.value = '';
    this.descriptionInput.value = '';
    this.photoInput.value = '';
    this.seconds;
  }

  async connectedCallback() {
    setTimeout(this.pullupAnimation.bind(this), 25, 75);
    this.doneButton.addEventListener('click', this.saveNewActivty.bind(this));
    this.addButton.addEventListener('click', this.destorySelf.bind(this));
    this.addButton.textContent = 'cancel';
    this.timeInput.seconds = this.seconds;
    this.setTitle(`edit ${this.nameInput.value}`);
  }

  disconnectedCallback() {}

  async saveNewActivty() {
    // should abtract this to a general store activties/ edit activites
    const title = this.nameInput.value;
    const description = this.descriptionInput.value;
    const duration = this.timeInput.getDuration();
    const UUID = this.entryID;
    saveActivty(UUID, title, description, duration);
    this.destorySelf();
  }
}
customElements.define('edit-menu', editMenu);
