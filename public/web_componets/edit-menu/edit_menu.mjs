import { newActivtyMenu } from '../new-activity-menu/new_activity_menu.mjs';
import { fetchTemplate, saveActivty } from '../utilities.mjs';
export class editMenu extends newActivtyMenu {
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.initilized = false;
    this.seconds = 0;
  }
  editMenuPrepareHandles() {
    this.entryID = '';
    this.nameInput.value = '';
    this.descriptionInput.value = '';
    this.photoInput.value = '';
    this.backButton.style.display = 'flex';
    this.backButton.textContent = 'delete';
    this.addButton.textContent = 'cancel';
  }
  async attachTemplate() {
    // extracting this out of the on connectedCallback because it means we can invoke this in javacript to ensure everything is set up correctly
    if (this.initilized) {
      return;
    }
    this.shadow = this.attachShadow({ mode: 'open' });
    await fetchTemplate(
      this.shadow,
      '../../web_componets/bottom-sheet/bottomsheet.html',
    );
    this.bottomSheetPrepareHandles();
    await this.createActivtyInputs();
    this.setTitle(`edit ${this.nameInput.value}`);
    this.setupActivityEventListeners();
    this.editMenuPrepareHandles();
    this.timeInput.setDuration(this.seconds);
    this.initilized = true;
    setTimeout(this.pullupAnimation.bind(this), 25, 90);
  }

  setupEventListners() {
    this.backButton.addEventListener('click', deleteEntry.bind(this));
  }
  deleteEntry() {}
  async connectedCallback() {
    if (this.initilized) {
      return;
    }
    await this.attachTemplate();
    this.initilized = true;
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
