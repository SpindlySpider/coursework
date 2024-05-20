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
    if (this.initilized) {
      return;
    }
    await this.attachTemplate();
    this.initilized = true;
  }

  async prepareHandles() {
    this.addButton.style.display = 'none';
    this.doneButton.style.display = 'none';
    this.addButton.textContent = '➕exercise';
    this.backButton = this.shadow.querySelector('#bottomsheet-back');
    this.cancel = this.shadow.querySelector('#bottomsheet-cancel');
    this.extraDetails = document.createElement("div")
    this.excerciseList = await fetchFragment(import.meta.resolve("./playlist-option-list.inc"))
    this.optionsList = await fetchFragment(import.meta.resolve("./playlist-option-list.inc"))
    this.excerciseList.id = "exercise-list"
    this.optionsList.id = "options-list"
    await this.setupPlaylistOptions();
    this.playlistDurationText = document.createElement("p");
    this.playlistDurationText.style.fontSize = "3.5vw"
    this.playlistDurationText.id = "totalDuration"
    this.header.parentNode.append(this.extraDetails);
    this.extraDetails.append(this.playlistDurationText);
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
    this.setupEventListeners();
    this.setTitle('new playlist');
    setTimeout(this.pullupAnimation.bind(this), 25, 75);
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
    if (event.type === 'touchmove') {
      yPos = event.targetTouches[0].clientY;
    }
    event.preventDefault();
    const elementAfter = this.getAfterElement(yPos);
    const draggable = this.shadow.querySelector('.dragging');
    if (draggable == null) {
      throw Error("not dragging anything")
    }
    if (elementAfter == null) {
      this.excerciseList.appendChild(draggable);
    } else {
      this.excerciseList.insertBefore(draggable, elementAfter);
    }
  }

  async deletePlaylist() {
    await deleteFromLocal(this.UUID, PLAYLIST_KEY);
    await displayPlaylistPage();
    this.destorySelf();
  }

  async createButtons() {
    this.createEmptyPlaylist = await fetchFragment(import.meta.resolve("./playlist-button.inc"))
    this.importPlaylist = await fetchFragment(import.meta.resolve("./playlist-button.inc"))

    this.cancel.style.display = 'flex';

    this.createEmptyPlaylist.id = 'create-empty-playlist';
    this.importPlaylist.id = 'import-playlist';
    this.nameInput.id = 'playlistTitle';

    this.createEmptyPlaylist.textContent = 'create empty playlist';
    this.deleteButton.textContent = "delete playlist"
    this.importPlaylist.textContent = 'import playlist';
    this.doneButton.textContent = 'save';

    this.nameInput.classList.add('bottomsheet-content-item');
    this.deleteButton.style.backgroundColor = "red"
    this.deleteButton.style.alignSelf = "flex-end"
    this.nameInput.style.display = this.backButton.style.display = 'none';
    this.content.append(this.createEmptyPlaylist, this.importPlaylist, this.nameInput);
  }

  addEntryToList(entry) {
    // add visuall notifcaiton of adding activity
    this.activityItems.push(entry.dataset.id);
  }

  async customActivitesSelection() {
    setTimeout(this.pullupAnimation.bind(this), 50, 78);
    let hideList = [this.nameInput, this.cancel, this.doneButton, this.addButton, this.deleteButton, this.playlistDurationText]
    this.playlistDurationText = this.shadow.querySelector("#totalDuration")
    this.cleanContent();
    await this.hideOptions()
    hideList.forEach((item) => item.style.display = "none")
    this.excerciseList.style.display = "flex"
    this.backButton.style.display = 'flex';
    this.setTitle('add activity');

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
      // make a web componenet for the event
      const entry = await fetchFragment(import.meta.resolve("./playlist-excerises-item.inc"))
      entry.dataset.id = item;
      entry.querySelector("#title").textContent = customActivties[item].title;
      entry.querySelector("#duration").textContent = this.updateplaylistduration(customActivties[item].duration);
      entry.entryID = item;
      entry.addEventListener('click', this.addEntryToList.bind(this, entry));
      this.excerciseList.append(entry);
      const photos = await getPhotos(item)
      if (photos[0] !== undefined) {
        const response = await getPhotoFromID(photos[0])
        if (!response.ok) {
          throw Error("couldnt get photo")
        }
        entry.querySelector("img").src = response.url;
      }
    }
  }

  cleanContent() {
    const items = this.excerciseList.querySelectorAll('.activty-item');
    for (let item of items) {
      item.remove();
    }
  }

  getAfterElement(y) {
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

  async setupPlaylistOptions() {
    const options = await fetchFragment(import.meta.resolve("./playlist-exercise-options.inc"))
    this.optionsList.innerHTML = options.innerHTML
    this.setInput = this.optionsList.querySelector("#set-input")
    this.restTimer = this.optionsList.querySelector("#rest-timer-input")
    this.setRestTimer = this.optionsList.querySelector("#set-rest-input")
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
    setTimeout(this.pullupAnimation.bind(this), 50, 75);
    this.cleanContent();
    this.duration = 0;
    this.content.append(this.excerciseList, this.optionsList)
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
      console.log(item, customActivties)
      const deleteButton = entry.querySelector('h4');
      const duration = entry.querySelector('#duration');
      entry.dataset.id = item;
      name.textContent = customActivties[item].title;
      duration.textContent = this.updateplaylistduration(customActivties[item].duration);
      this.duration += customActivties[item].duration

      deleteButton.addEventListener('click', () => {
        this.duration -= customActivties[item].duration
        duration.textContent = this.updateplaylistduration(this.duration)
        let removed = false;
        this.activityItems = this.activityItems.filter((excercise) => {
          if (!removed && excercise == item) {
            removed = true
            return false
          }
          return removed
        })
        if (this.activityItems.length == 0) {
          this.hideOptions()
        }
        entry.remove();
      });
      this.draggingEventListeners(entry);
      this.excerciseList.append(entry);
    }
    const text = this.shadow.querySelector("#totalDuration")
    text.textContent = `excerise length :${this.updateplaylistduration(this.duration)}`;
    this.content.append(this.deleteButton)
  }

  updateplaylistduration(seconds) {
    if (seconds <= 0) {
      return ""
    }
    const duration = formatedSeconds(seconds);
    const hour = duration.hour === 0 ? '' : `${duration.hour}h`;
    const mins = duration.minutes === 0 ? '' : `${duration.minutes}m`;
    const secs = duration.seconds === 0 ? '' : `${duration.seconds}s`;
    return `⏱︎ ${hour}${mins}${secs}`
  }

  draggingEventListeners(element) {
    element.addEventListener('dragstart', () => {
      element.classList.add('dragging');
    });
    element.addEventListener('touchstart', () => {
      element.classList.add('dragging');
    });
    element.addEventListener('dragend', () => {
      element.classList.remove('dragging');
    });
    element.addEventListener('touchend', () => {
      element.classList.remove('dragging');
    });
  }

  disconnectedCallback() { }

  async saveNewPlaylist() {
    if (this.UUID === undefined) {
      this.UUID = await getUUID();
    }
    this.activityItems = [
      ...this.content.querySelectorAll('.activty-item'),
    ].map((item) => {
      return item.dataset.id;
    }); // turning the visual order into the saved order of events
    if (this.activityItems[0] === undefined) {
      this.activityItems = [];
    }
    const title = this.nameInput.value;
    const sets = parseInt(this.setInput.value);
    const excerciseRest = stringTimeToSeconds(this.restTimer.value)
    const setRest = stringTimeToSeconds(this.setRestTimer.value)
    await savePlaylist(this.UUID, title, this.activityItems, sets, excerciseRest, setRest, false);
    await displayPlaylistPage();
    this.destorySelf();
  }
}
customElements.define('new-playlist-menu', newPlaylistMenu);
