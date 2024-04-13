import {
  saveActivty,
  getUUID,
  fetchTemplate,
  saveTag,
  ACTIVTIES_KEY,
  cleanLocalTag,
} from '../utilities.mjs';
import { bottomSheetMenu } from '../bottom-sheet/bottom_sheet_menu.mjs';
import {
  displayCategoryPage,
  displayCustomCateogryPage,
} from '../../script/category_page.mjs';

export class newActivtyMenu extends bottomSheetMenu {
  // also if any of the attributes change then we need to update local storage + server cache

  constructor() {
    // must do all of the selections within the constructor
    super();
    this.initilized = false;
  }

  async createActivtyInputs() {
    this.nameInput = document.createElement('input');
    this.descriptionInput = document.createElement('textarea');

    this.timeInput = document.createElement('duration-picker');
    await this.timeInput.attachTemplate();
    this.photoInput = document.createElement('input');
    this.tags = document.createElement('tag-input');
    await this.tags.attachTemplate();

    this.nameInput.id = 'activityNameInput';
    this.descriptionInput.id = 'descriptionInput';
    this.timeInput.id = 'timeInput';
    this.photoInput.id = 'addPhoto';
    this.tags.id = 'tag';
    this.addButton.textContent = 'cancel';

    this.nameInput.placeholder = 'title';
    this.descriptionInput.placeholder = 'descrption';

    this.nameInput.classList.add('bottomsheet-content-item');
    this.descriptionInput.classList.add('bottomsheet-content-item');
    this.timeInput.classList.add('bottomsheet-content-item');
    this.photoInput.classList.add('bottomsheet-content-item');

    this.descriptionInput.addEventListener(
      'keyup',
      this.resizingTextarea.bind(this),
    );

    this.content.append(
      this.nameInput,
      this.descriptionInput,
      this.timeInput,
      this.photoInput,
      this.tags,
    );
  }

  resizingTextarea(e) {
    this.descriptionInput.style.height = 'auto';
    const scrollHeight = e.target.scrollHeight;
    this.descriptionInput.style.height = `${scrollHeight}px`;
  }

  setupActivityEventListeners() {
    this.doneButton.addEventListener('click', this.saveNewActivty.bind(this));
    this.addButton.addEventListener('click', this.destorySelf.bind(this));
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
    this.setupActivityEventListeners();
    setTimeout(this.pullupAnimation.bind(this), 25, 75);
    this.setTitle('new activity');
    this.initilized = true;
  }

  async connectedCallback() {
    if (this.initilized) {
      return;
    }
    await this.attachTemplate();
  }

  destorySelf() {
    this.content.style.height = '0vh';
    setTimeout(() => {
      this.remove();
      this.enableNavbarBorder();
      displayCategoryPage();
      displayCustomCateogryPage();
    }, 300);
  }

  disconnectedCallback() {}

  async saveNewActivty() {
    // should abtract this to a general store activties/ edit activites
    const title = this.nameInput.value;
    const description = this.descriptionInput.value;
    const duration = this.timeInput.getDuration();
    const UUID = await getUUID();
    console.log(UUID, title, description, duration);
    await saveActivty(UUID, title, description, duration, false);
    cleanLocalTag(UUID, ACTIVTIES_KEY);
    for (let tag of this.tags.getTags()) {
      await saveTag(UUID, ACTIVTIES_KEY, tag, false);
    }
    this.destorySelf();
  }
}
customElements.define('new-activty-menu', newActivtyMenu);
