import { newActivtyMenu } from '../new-activity-menu/new_activity_menu.mjs';
import { fetchTemplate, saveActivty } from '../utilities.mjs';
export class editMenu extends newActivtyMenu {
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
  }
  editMenuPrepareHandles() {
    this.entryID = '';
    this.nameInput.value = '';
    this.descriptionInput.value = '';
    this.photoInput.value = '';
    this.addButton.textContent = 'cancel';
  }

  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    await fetchTemplate(
      this.shadow,
      '../../web_componets/bottom-sheet/bottomsheet.html',
    );
    this.bottomSheetPrepareHandles();
    this.createActivtyInputs();
    this.setupActivityEventListeners();
    this.editMenuPrepareHandles();
    setTimeout(this.pullupAnimation.bind(this), 25, 75);
    setTimeout(() => {
      this.timeInput.setDuration(this.seconds);
    }, 3);
    this.setTitle(`edit ${this.nameInput.value}`);
  }

  disconnectedCallback() {}

  saveNewActivty() {
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
