import {
  ACTIVTIES_KEY,
  deleteFromLocal,
  fetchTemplate,
  getActivtyFromID,
  saveActivty,
  formatedSeconds,
} from '../utilities.mjs';
import { newActivtyMenu } from '../new-activity-menu/new_activity_menu.mjs';
import {
  displayCategoryPage,
  displayCustomCateogryPage,
} from '../../script/category_page.mjs';
export class Entry extends newActivtyMenu {
  constructor() {
    super();
    this.entryID;
    this.customTitle;
    this.description;

    this.editing = false;
    this.initilized = false;
    this.seconds = 0;
  }

  deleteEntry() {
    deleteFromLocal(this.entryID, ACTIVTIES_KEY);
    this.destorySelf();
  }

  destorySelf() {
    this.content.style.height = '0vh';
    this.remove();
    this.enableNavbarBorder();
    displayCategoryPage();
    displayCustomCateogryPage();
  }
  async connectedCallback() {
    if (this.editing || this.initilized) {
      return;
    }
    await this.attachTemplate();
    this.initilized = true;
  }
  thumbnailDescription() {
    // formats a string such that it will add ... if the description is too long
    const cutoffPoint = 13; // number of char
    if (this.description.length > cutoffPoint) {
      this.description = this.description.slice(0, cutoffPoint - 3) + '...';
    }
    const duration = formatedSeconds(this.seconds);
    const hour = duration.hour == 0 ? '' : `${duration.hour}h`;
    const mins = duration.minutes == 0 ? '' : `${duration.minutes}m`;
    const secs = duration.seconds == 0 ? '' : `${duration.seconds}s`;
    this.description = `${this.description} | ⏱︎ ${hour}${mins}${secs}`;
    return this.description;
  }

  async attachTemplate() {
    // extracting this out of the on connectedCallback because it means we can invoke this in javacript to ensure everything is set up correctly
    if (this.editing || this.initilized) {
      return;
    }
    this.shadow = this.attachShadow({ mode: 'open' });
    this.entryThumbnail = document.createElement('ul');

    this.entryName = document.createElement('h3');
    this.entryName.textContent = this.customTitle;
    this.entryDescription = document.createElement('p');
    this.entryDescription.style = 'margin:0;';
    this.entryName.style = 'margin:0;';
    this.entryDescription.textContent = this.thumbnailDescription();
    this.shadow.append(this.entryThumbnail);
    this.entryThumbnail.append(this.entryName, this.entryDescription);
    this.addEventListener('click', this.eventOptionsBottomSheet.bind(this), {
      once: true,
    });
    this.initilized = true;
  }

  setupEventListners() {
    this.backButton.addEventListener('click', this.deleteEntry.bind(this));
  }

  editMenuPrepareHandles() {
    this.nameInput.value = '';
    this.descriptionInput.value = '';
    this.photoInput.value = '';
    this.backButton.style.display = 'flex';
    this.doneButton.textContent = 'save';
    this.backButton.textContent = 'delete';
    this.addButton.textContent = 'cancel';
  }

  async eventOptionsBottomSheet() {
    // creates a event options pop up
    // this.shadow = this.attachShadow({ mode: 'open' });
    const activity = getActivtyFromID(this.entryID);
    await fetchTemplate(
      this.shadow,
      '../../web_componets/bottom-sheet/bottomsheet.html',
    );
    this.classList.remove('bottomsheet-content-item');
    this.bottomSheetPrepareHandles();
    await this.createActivtyInputs();
    this.setTitle(`edit ${activity.title}`);
    this.setupActivityEventListeners();
    this.editMenuPrepareHandles();
    this.seconds = activity.duration;
    this.timeInput.setDuration(this.seconds);
    this.parentNode.append(this);
    this.entryID = this.entryID;
    this.nameInput.value = activity.title;
    this.descriptionInput.value = activity.description;
    this.editing = true;
    this.setupEventListners();
    setTimeout(this.pullupAnimation.bind(this), 25, 90);
  }
  saveNewActivty() {
    // should abtract this to a general store activties/ edit activites
    const title = this.nameInput.value;
    const description = this.descriptionInput.value;
    const duration = this.timeInput.getDuration();
    const UUID = this.entryID;
    saveActivty(UUID, title, description, duration);

    document.querySelector('#main-content').textContent = '';

    this.destorySelf();
  }
}

customElements.define('activity-entry', Entry);
