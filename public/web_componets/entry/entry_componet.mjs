import {
  ACTIVTIES_KEY,
  saveActivty,
  getActivtyFromID,
} from '../activity-tools.mjs';
import { deleteFromLocal, formatedSeconds, fetchTemplate } from '../utilities.mjs';
import { newActivtyMenu } from '../new-activity-menu/new_activity_menu.mjs';
import {
  displayCategoryPage,
  displayCustomCateogryPage,
} from '../../pages/category-page/category.mjs';
import { cleanLocalTag, saveTags, getTags } from '../tag-tools.mjs';
import { getPhotos, getPhotoFromID, uploadPhoto } from '../picture-tools.mjs';
export class Entry extends newActivtyMenu {
  constructor() {
    super();
    this.editing = false;
    this.editable = true; // used to make this entry editable
    this.initilized = false;
    this.seconds = 0;
    this.entryJSON = {};
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  deleteEntry() {
    deleteFromLocal(this.entryID, ACTIVTIES_KEY);
    for (let id of this.pictures) {
      this.deletePicture(id);
    }
    document.querySelector("toast-notification").addNotification(`deleted ${this.entryJSON.title}`, 1500)
    this.destorySelf();
  }

  destorySelf() {
    this.content.style.height = '0vh';
    this.enableNavbarBorder();
    displayCategoryPage();
    displayCustomCateogryPage();
    this.remove();
  }

  async connectedCallback() {
    if (this.editing || this.initilized) return;
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
    // setting up inner HTML for shadowDOM
    this.entryJSON = await getActivtyFromID(this.entryID);
    const thumbnail = await fetch(import.meta.resolve("./thumbnail.inc")).then(item => item.text())
    this.shadow.innerHTML = thumbnail;
    // setting values for title, description and duration
    this.shadow.querySelector("#title").textContent = this.entryJSON.title
    this.shadow.querySelector("#description").textContent = this.entryJSON.description
    this.seconds = this.entryJSON.duration;
    this.shadow.querySelector("#duration").textContent = this.getFormatStringTime()
    // appending any photos if there are any
    const photoIDs = await getPhotos(this.entryID)
    if (photoIDs.length > 0) {
      this.image = this.shadow.querySelector("#image")
      const response = await getPhotoFromID(photoIDs[0])
      this.image.src = response.url
    }
    // if own this event you can edit it
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
    this.backButton.textContent = 'delete exercise';
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
    await this.getTags();
    this.parentNode.append(this);
    this.nameInput.value = this.entryJSON.title;
    this.descriptionInput.value = this.entryJSON.description;
    this.editing = true;
    this.setupEventListners();
    setTimeout(this.pullupAnimation.bind(this), 25, 50);
    this.pictures = await getPhotos(this.entryID)
    await this.appendPictures()
    this.timeInput.setDuration(this.seconds);
    this.content.append(this.backButton)
  }

  toastNotification(str) {
    document.querySelector("toast-notification").addNotification(str, 1500)
  }

  async saveNewActivty() {
    // should abtract this to a general store activties/ edit activites
    const title = this.nameInput.value;
    if (title == "") {
      this.toastNotification(`cannot save as there is no title`)
      throw Error("no title")
    }
    const duration = this.timeInput.getDuration();
    if (duration <= 0) {
      this.toastNotification(`cannot save ${title} there is no duration`)
      throw Error("no duration")
    }
    const description = this.descriptionInput.value;
    const UUID = this.entryID;
    await saveActivty(UUID, title, description, duration, false);
    cleanLocalTag(UUID, ACTIVTIES_KEY);
    await saveTags(UUID, ACTIVTIES_KEY, this.tags.getTags(), false);
    document.querySelector('#main-content').textContent = '';
    let photoURL = null
    if (this.photoInput.files.length >= 0) {
      for (let file of this.photoInput.files) {
        const input = new FormData()
        input.append("file", file)
        await uploadPhoto(UUID, input)
      }
      photoURL = this.pictureURL
    }
    document.querySelector("toast-notification").addNotification(`saved ${title}`, 1500, photoURL)
    this.destorySelf();
  }
}

customElements.define('activity-entry', Entry);
