import { saveActivty, getUUID } from './utilities.mjs';
import { bottomSheetMenu } from './bottom_sheet_menu.mjs';

export class newActivtyMenu extends bottomSheetMenu {
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.donebutton = this.shadow.querySelector('#doneButton');
    this.addButton = this.shadow.querySelector('#bottomsheet-add');

    this.nameInput = document.createElement('input');
    this.descriptionInput = document.createElement('input');
    this.timeInput = document.createElement('duration-picker');
    this.photoInput = document.createElement('input');

    this.nameInput.id = 'activityNameInput';
    this.descriptionInput.id = 'descriptionInput';
    this.timeInput.id = 'timeInput';
    this.photoInput.id = 'addPhoto';

    this.nameInput.classList.add('bottomsheet-content-item');
    this.descriptionInput.classList.add('bottomsheet-content-item');
    this.timeInput.classList.add('bottomsheet-content-item');
    this.photoInput.classList.add('bottomsheet-content-item');

    this.content.append(this.nameInput);
    this.content.append(this.descriptionInput);
    this.content.append(this.timeInput);
    this.content.append(this.photoInput);

    console.log(getUUID());
  }

  connectedCallback() {
    setTimeout(this.pullupAnimation.bind(this), 25, 75);
    this.addButton.textContent = 'cancel';
    this.doneButton.addEventListener('click', this.saveNewActivty.bind(this));
    this.addButton.addEventListener('click', this.destorySelf.bind(this));
    this.setTitle('new activity');
  }

  disconnectedCallback() {}

  async saveNewActivty() {
    // should abtract this to a general store activties/ edit activites
    const title = this.nameInput.value;
    const description = this.descriptionInput.value;
    const duration = this.timeInput.getDuration();
    const UUID = await getUUID();
    console.log(UUID);
    saveActivty(UUID, title, description, duration);
    this.destorySelf();
  }
}
customElements.define('new-activty-menu', newActivtyMenu);
