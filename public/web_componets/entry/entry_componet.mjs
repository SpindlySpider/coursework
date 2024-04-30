import {
  ACTIVTIES_KEY,
  deleteFromLocal,
  fetchTemplate,
  getActivtyFromID,
  saveActivty,
  formatedSeconds,
  saveTags,
  cleanLocalTag,
  getTags,
  createButton,
} from '../utilities.mjs';
import { newActivtyMenu } from '../new-activity-menu/new_activity_menu.mjs';
import {
  displayCategoryPage,
  displayCustomCateogryPage,
} from '../../script/category_page.mjs';
export class Entry extends newActivtyMenu {
  constructor() {
    super();
    this.editing = false;
    this.editable = true; // used to make this entry editable
    this.initilized = false;
    this.seconds = 0;
    this.entryJSON = {};
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
  }

  getFormatStringTime() {
    const duration = formatedSeconds(this.seconds);
    const hour = duration.hour === 0 ? '' : `${duration.hour}h`;
    const mins = duration.minutes === 0 ? '' : `${duration.minutes}m`;
    const secs = duration.seconds === 0 ? '' : `${duration.seconds}s`;
    return `⏱︎ ${hour}${mins}${secs}`;
  }

  thumbnailDescription() {
    // formats a string such that it will add ... if the description is too long
    const cutoffPoint = 50; // number of char
    if (this.entryJSON.description.length > cutoffPoint) {
      this.description = this.description.slice(0, cutoffPoint - 3) + '...';
    }
    return this.description;
  }

  async attachTemplate() {
    // extracting this out of the on connectedCallback because it means we can invoke this in javacript to ensure everything is set up correctly
    if (this.editing || this.initilized) {
      return;
    }
    this.shadow = this.attachShadow({ mode: 'open' });
    this.entryThumbnail = document.createElement('ul');
    this.entryThumbnail.id = "entryThumbnail"
    this.entryThumbnail.style = `display: flex; border: 0.5vw solid black; border-radius: 5vw;flex-direction:column;overflow-wrap: anywhere;`
    // fetch pictures for this activity from the server here
    this.entryJSON = await getActivtyFromID(this.entryID);

    this.entryName = document.createElement('h3');
    this.entryName.textContent = this.entryJSON.title;
    this.seconds = this.entryJSON.duration;
    this.description = this.entryJSON.description;
    this.entryDescription = document.createElement('p');
    this.entryDescription.style = 'margin:0;';
    this.entryName.style = 'margin-bottom:0;';
    this.entryDescription.textContent = this.thumbnailDescription();
    const container = document.createElement('ul');
    container.style = `display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 0;
  height: 10vh;
  text-align: center;
  font-size: 8vw;`
    this.durationDisplay = document.createElement('p');
    this.editButton = createButton("edit");
    this.editButton.style = `;
    align-self: center;
  font-size: 9vw;
  background-color: var(--button-colour);
  padding: 1vw;
  border: 1px;
  border-radius: 2vw;
  margin: 2vw;
  width: 26vw;`
    this.durationDisplay.textContent = this.getFormatStringTime()
    container.append(this.durationDisplay, this.editButton)

    this.shadow.append(this.entryThumbnail);
    this.entryThumbnail.append(this.entryName, this.entryDescription, container);

    if (this.editable) {
      this.addEventListener('click', this.eventOptionsBottomSheet.bind(this), {
        once: true,
      });
    }

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

  async getTags() {
    cleanLocalTag(this.entryID, ACTIVTIES_KEY);
    const tags = await getTags(this.entryID, ACTIVTIES_KEY);
    this.tags.setTags(tags);
  }

  async eventOptionsBottomSheet() {
    // creates a event options pop up
    await fetchTemplate(
      this.shadow,
      '../../web_componets/bottom-sheet/bottomsheet.html',
    );
    this.classList.remove('bottomsheet-content-item');
    this.bottomSheetPrepareHandles();
    await this.createActivtyInputs();
    this.setTitle(`edit ${this.entryJSON.title}`);
    this.setupActivityEventListeners();
    this.editMenuPrepareHandles();
    this.timeInput.setDuration(this.seconds);
    await this.getTags();
    this.parentNode.append(this);
    this.nameInput.value = this.entryJSON.title;
    this.descriptionInput.value = this.entryJSON.description;
    this.editing = true;
    this.setupEventListners();
    setTimeout(this.pullupAnimation.bind(this), 25, 78);
  }

  async saveNewActivty() {
    // should abtract this to a general store activties/ edit activites
    const title = this.nameInput.value;
    const description = this.descriptionInput.value;
    const duration = this.timeInput.getDuration();
    const UUID = this.entryID;
    await saveActivty(UUID, title, description, duration, false);
    cleanLocalTag(UUID, ACTIVTIES_KEY);
    await saveTags(UUID, ACTIVTIES_KEY, this.tags.getTags(), false);
    document.querySelector('#main-content').textContent = '';
    this.destorySelf();
  }
}

customElements.define('activity-entry', Entry);
