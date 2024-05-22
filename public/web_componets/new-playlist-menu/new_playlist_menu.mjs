import {
  deleteFromLocal,
  fetchFragment,
  fetchTemplate,
  formatedSeconds,
  getUUID,
  stringTimeToSeconds,
} from '../utilities.mjs';
import { bottomSheetMenu } from '../bottom-sheet/bottom_sheet_menu.mjs';
import { displayPlaylistPage } from '/../../pages/playlist-page/playlist.mjs';
import { PLAYLIST_KEY, savePlaylist } from '../playlist-tools.mjs';
import { ACTIVTIES_KEY, getAllCustomActivites } from '../activity-tools.mjs';
import { getPhotoFromID, getPhotos } from '../picture-tools.mjs';

export class newPlaylistMenu extends bottomSheetMenu {
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.activityItems = [];
    this.nameInput = document.createElement('input');
    this.initilized = false;
    this.headerTitle = "create workout"
  }

  async connectedCallback() {
    if (this.initilized) return;
    await this.attachTemplate();
    this.initilized = true;
  }

  async prepareHandles() {
    this.backButton = this.shadow.querySelector('#bottomsheet-back');
    this.cancel = this.shadow.querySelector('#bottomsheet-cancel');
    const options = await fetchFragment(import.meta.resolve("./playlist-options.inc"))
    this.excerciseList = options.querySelector("#exercise-list")
    this.optionsList = options.querySelector("#options-list")
    this.setInput = this.optionsList.querySelector("#set-input")
    this.restTimer = this.optionsList.querySelector("#rest-timer-input")
    this.setRestTimer = this.optionsList.querySelector("#set-rest-input")
    this.extraDetails = await fetchFragment(import.meta.resolve("./playlist-duration-text.inc"))
    this.playlistDurationText = this.extraDetails.querySelector("#total-duration");
  }

  setupContent() {
    this.addButton.style.display = 'none';
    this.doneButton.style.display = 'none';
    this.addButton.textContent = '➕exercise';
    this.header.parentNode.append(this.extraDetails);
    this.cancel.style.display = 'flex';
    this.deleteButton.textContent = "delete playlist"
    this.doneButton.textContent = 'save';
    this.deleteButton.style.backgroundColor = "red"
    this.deleteButton.style.alignSelf = "flex-end"
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
    await this.prepareHandles();
    await this.createButtons();
    this.setupContent()
    this.setupEventListeners();
    this.setTitle('new playlist');
    setTimeout(this.pullupAnimation.bind(this), 25, 70);
    this.initilized = true;
  }

  setupEventListeners() {
    this.addButton.addEventListener(
      'click',
      this.customActivitesSelection.bind(this),
    );
    this.backButton.addEventListener(
      'click',
      this.playlistCreationTool.bind(this),
    );
    this.createEmptyPlaylist.addEventListener(
      'click',
      this.playlistCreationTool.bind(this),
    );
    this.cancel.addEventListener('click', this.destorySelf.bind(this));
    this.doneButton.addEventListener(
      'click',
      this.saveNewPlaylist.bind(this, this.UUID),
    );
    this.deleteButton.addEventListener('click', this.deletePlaylist.bind(this));
    this.excerciseList.addEventListener('dragover', this.dragOverInsert.bind(this));
    this.excerciseList.addEventListener('touchmove', this.dragOverInsert.bind(this));
  }

  dragOverInsert(event) {
    let yPos = event.clientY;
    if (event.type === 'touchmove') yPos = event.targetTouches[0].clientY;
    const elementAfter = this.getAfterElement(yPos);
    const draggable = this.shadow.querySelector('.dragging');
    if (draggable == null) throw Error("not dragging anything");
    // in this order so that the user can still scroll on mobile devices
    event.preventDefault();
    if (elementAfter == null) this.excerciseList.appendChild(draggable);
    else this.excerciseList.insertBefore(draggable, elementAfter);
  }

  async deletePlaylist() {
    await deleteFromLocal(this.UUID, PLAYLIST_KEY);
    await displayPlaylistPage();
    document.querySelector("toast-notification").addNotification(`deleted ${this.nameInput.value}`, 1500)
    this.destorySelf();
  }

  async createButtons() {
    const buttons = await fetchFragment(import.meta.resolve("./playlist-button.inc"))
    this.shadow.querySelector("#bottomsheet-content").innerHTML = buttons.innerHTML
    this.createEmptyPlaylist = this.shadow.querySelector("#create-empty-playlist")
    this.importPlaylist = this.shadow.querySelector("#import-playlist")
    this.nameInput = this.shadow.querySelector("#playlist-title")
  }

  async addEntryToList(entry) {
    this.activityItems.push(entry.dataset.id);
    let image = entry.querySelector("img")
    if (image) image = image.src
    const name = entry.querySelector("#title").textContent
    //add pop up to notify the user an exercise has been added
    await document.querySelector("toast-notification").addNotification(`added ${name} to workout`, 1500, image)
  }

  async customActivitesSelection() {
    setTimeout(this.pullupAnimation.bind(this), 50, 60);
    let hideList = [this.nameInput, this.cancel, this.doneButton, this.addButton, this.deleteButton, this.playlistDurationText, this.excerciseList]
    let enableList = [this.backButton]
    this.cleanContent();
    await this.hideOptions()
    hideList.forEach((item) => item.style.display = "none")
    enableList.forEach((item) => item.style.display = "flex")
    this.setTitle('add activity');
    this.backButton.style.backgroundColor = "var(--button-background-color)"
    this.shadow.querySelector(".bottomsheet-header-buttons").prepend(this.backButton)

    const customActivties = getAllCustomActivites(ACTIVTIES_KEY);
    if (customActivties == null || Object.keys(customActivties).length == 0) {
      this.excerciseList.style.display = "none"
      const emptyMessage = this.content.querySelector("#message");
      emptyMessage.textContent =
        'press the + at the bottom to make new activties';
      return;
    }
    this.content.querySelector("#message").style.display = "none"

    for (let item of Object.keys(customActivties)) {
      const entry = await fetchFragment(import.meta.resolve("./playlist-excerises-item.inc"))
      entry.dataset.id = item;
      entry.querySelector("#title").textContent = customActivties[item].title;
      entry.querySelector("#duration").textContent = this.updateplaylistduration(customActivties[item].duration);
      entry.entryID = item;
      entry.addEventListener('click', this.addEntryToList.bind(this, entry));
      this.content.append(entry)
      const image = await this.getPhotoURL(item);
      if (image) {
        entry.querySelector("img").src = image
        entry.querySelector("img").style.display = "flex";
      }
    }
  }

  async getPhotoURL(UUID) {
    const photos = await getPhotos(UUID)
    if (photos[0] !== undefined) {
      const response = await getPhotoFromID(photos[0])
      if (!response.ok) return null;
      return response.url
    }
  }

  cleanContent() {
    const items = this.content.querySelectorAll('.activty-item');
    for (let item of items) {
      item.remove();
    }
  }

  getAfterElement(y) {
    // got this from stack overflow
    let draggableItems = this.excerciseList.querySelectorAll(
      '.draggable:not(.dragging)',
    );
    draggableItems = Array.from(draggableItems);
    return draggableItems.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY },
    ).element;
  }

  createContainer(id) {
    const container = document.createElement("li")
    container.style.justifyContent = "space-between"
    container.id = id
    return container
  }

  async hideOptions() {
    let emptyMessage;
    const hideList = [this.deleteButton, this.excerciseList, this.optionsList]
    if (this.shadow.querySelector("#message")) {
      emptyMessage = this.shadow.querySelector("#message");
      emptyMessage.style.display = "flex"
    }
    else {
      emptyMessage = await fetchFragment(import.meta.resolve("./playlist-empty-message.inc"))
      this.content.append(emptyMessage);
    }
    hideList.forEach((item) => item.style.display = "none")
  }

  async playlistCreationTool() {
    setTimeout(this.pullupAnimation.bind(this), 50, 50);
    this.cleanContent();
    this.content.append(this.excerciseList, this.optionsList)
    this.duration = 0;
    const enableList = [this.nameInput, this.doneButton, this.deleteButton, this.playlistDurationText, this.excerciseList, this.optionsList, this.addButton, this.cancel]
    enableList.forEach((item) => item.style.display = "flex")
    this.backButton.style.display = 'none';
    this.content.style.height = '0vh';
    this.setTitle(`${this.headerTitle}`);
    this.createEmptyPlaylist.remove();
    this.importPlaylist.remove();
    if (this.activityItems.length == 0) {
      this.hideOptions()
      return;
    }
    const customActivties = getAllCustomActivites(ACTIVTIES_KEY);
    for (let item of this.activityItems) {
      const entry = await fetchFragment(import.meta.resolve("./playlist-item.inc"))
      const name = entry.querySelector('h2');
      const deleteButton = entry.querySelector('h4');
      const duration = entry.querySelector('#duration');
      const image = await this.getPhotoURL(item)
      const drag = entry.querySelector("#drag")
      if (image !== null && image !== undefined) {
        entry.querySelector("img").style.display = "flex"
        entry.querySelector("img").src = image
      }
      entry.dataset.id = item;
      entry.name = customActivties[item].title
      name.textContent = entry.name;
      duration.textContent = this.updateplaylistduration(customActivties[item].duration);
      this.duration += customActivties[item].duration
      deleteButton.addEventListener('click', () => { this.deleteItem(item, customActivties, entry) });
      this.draggingEventListeners(drag);
      this.excerciseList.append(entry);
    }
    this.playlistDurationText.textContent = `excerise length :${this.updateplaylistduration(this.duration)}`;
    this.content.append(this.deleteButton)
  }

  deleteItem(item, customActivties, entry) {
    this.duration -= customActivties[item].duration
    let removed = false;
    this.activityItems = this.activityItems.filter((excercise) => {
      if (!removed && excercise == item) {
        removed = true
        return false
      }
      return true
    });
    if (this.activityItems.length == 0) this.hideOptions();
    this.shadow.querySelector('#total-duration').textContent = `excerise length :${this.updateplaylistduration(this.duration)}`
    entry.remove();
  }

  updateplaylistduration(seconds) {
    if (seconds <= 0) return ""
    const duration = formatedSeconds(seconds);
    const hour = duration.hour === 0 ? '' : `${duration.hour}h`;
    const mins = duration.minutes === 0 ? '' : `${duration.minutes}m`;
    const secs = duration.seconds === 0 ? '' : `${duration.seconds}s`;
    return `⏱︎ ${hour}${mins}${secs}`
  }

  draggingEventListeners(element) {
    element.addEventListener('dragstart', () => {
      element.parentNode.parentNode.classList.add("dragging")
    });
    element.addEventListener('touchstart', () => {
      element.parentNode.parentNode.classList.add("dragging")
    });
    element.addEventListener('dragend', () => {
      element.parentNode.parentNode.classList.remove("dragging")
    });
    element.addEventListener('touchend', () => {
      element.parentNode.parentNode.classList.remove("dragging")
    });
  }

  toastNotification(str) {
    document.querySelector("toast-notification").addNotification(str, 1500)
  }

  async saveNewPlaylist() {
    if (this.UUID === undefined) this.UUID = await getUUID();
    this.activityItems = [
      ...this.content.querySelectorAll('.activty-item'),
    ].map((item) => {
      return item.dataset.id;
    }); // turning the visual order into the saved order of events
    if (this.activityItems[0] === undefined) this.activityItems = [];
    const title = this.nameInput.value;
    if (title == "") {
      this.toastNotification(`cannot save as there is no title`)
      throw Error("no title")
    }
    const sets = parseInt(this.setInput.value) || 1; // if you cant parse any value
    if (sets < 1 || sets === undefined) {
      this.toastNotification(`cannot save ${title} there is no duration`)
      throw Error("no duration")
    }
    const excerciseRest = this.restTimer.getDuration()
    const setRest = this.setRestTimer.getDuration()
    await savePlaylist(this.UUID, title, this.activityItems, sets, excerciseRest, setRest, false);
    await document.querySelector("toast-notification").addNotification(`saved ${this.nameInput.value}`, 1500)
    await displayPlaylistPage();
    this.destorySelf();
  }
}
customElements.define('new-playlist-menu', newPlaylistMenu);
