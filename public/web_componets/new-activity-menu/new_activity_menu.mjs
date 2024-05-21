import {
  getUUID,
  fetchTemplate,
  fetchFragment,
} from '../utilities.mjs';
import { bottomSheetMenu } from '../bottom-sheet/bottom_sheet_menu.mjs';
import {
  displayCategoryPage,
  displayCustomCateogryPage,
} from '../../pages/category-page/category.mjs';
import { ACTIVTIES_KEY, saveActivty } from '../activity-tools.mjs';
import { cleanLocalTag, saveTags } from '../tag-tools.mjs';
import { getPhotos, uploadPhoto } from '../picture-tools.mjs';

export class newActivtyMenu extends bottomSheetMenu {
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.initilized = false;
  }

  async createActivtyInputs() {
    const frag = await fetchFragment(import.meta.resolve("./content.inc"))
    this.content.innerHTML = frag.innerHTML
    this.nameInput = this.shadow.querySelector("#activityNameInput")
    this.descriptionInput = this.shadow.querySelector("#descriptionInput")
    this.timeInput = this.shadow.querySelector("#timeInput")
    this.photoInput = this.shadow.querySelector("#addPhoto")
    this.tags = this.shadow.querySelector("#tag")
    this.descriptionInput.addEventListener(
      'keyup',
      this.resizingTextarea.bind(this),
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
    if (this.initilized) return;
    this.shadow = this.attachShadow({ mode: 'open' });
    await fetchTemplate(
      this.shadow,
      '../../web_componets/bottom-sheet/bottomsheet.html',
    );
    this.bottomSheetPrepareHandles();
    await this.createActivtyInputs();
    this.setupActivityEventListeners();
    setTimeout(this.pullupAnimation.bind(this), 25, 70);
    this.setTitle('new activity');
    this.initilized = true;
  }

  async connectedCallback() {
    if (this.initilized) return;
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

  disconnectedCallback() { }

  async saveNewActivty() {
    // should abtract this to a general store activties/ edit activites
    const title = this.nameInput.value;
    const description = this.descriptionInput.value;
    const duration = this.timeInput.getDuration();
    const UUID = await getUUID();
    console.log(UUID, title, description, duration);
    await saveActivty(UUID, title, description, duration, false);
    cleanLocalTag(UUID, ACTIVTIES_KEY);
    await saveTags(UUID, ACTIVTIES_KEY, this.tags.getTags(), false);
    if (this.photoInput.files.length >= 0) {
      for (let file of this.photoInput.files) {
        const input = new FormData()
        input.append("file", file)
        await uploadPhoto(UUID, input)
      }
    }
    document.querySelector("toast-notification").addNotification(`saved ${title}`, 1500)
    this.destorySelf();
  }
}
customElements.define('new-activty-menu', newActivtyMenu);
