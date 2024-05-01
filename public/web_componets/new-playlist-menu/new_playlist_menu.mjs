import {
  ACTIVTIES_KEY,
  PLAYLIST_KEY,
  deleteFromLocal,
  fetchTemplate,
  formatedSeconds,
  getAllCustomActivites,
  getUUID,
  savePlaylist,
} from '../utilities.mjs';
import { bottomSheetMenu } from '../bottom-sheet/bottom_sheet_menu.mjs';
import { displayPlaylistPage } from '/../../script/playlist_page.mjs';

export class newPlaylistMenu extends bottomSheetMenu {
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.activityItems = [];
    this.nameInput = document.createElement('input');
    this.initilized = false;
  }

  async connectedCallback() {
    if (this.initilized) {
      return;
    }
    await this.attachTemplate();
    this.initilized = true;
  }

  prepareHandles() {
    this.addButton.style.display = 'none';
    this.doneButton.style.display = 'none';
    this.addButton.textContent = '➕exercise';
    this.backButton = this.shadow.querySelector('#bottomsheet-back');
    this.cancel = this.shadow.querySelector('#bottomsheet-cancel');
    this.extraDetails = document.createElement("div")
    this.excerciseList = document.createElement("div")
    this.optionsList = document.createElement("div")
    this.excerciseList.id = "exercise-list"
    this.optionsList.id = "options-list"
    this.excerciseList.style = this.optionsList.style = `border: 0.5vw solid gray; padding: 0; box-shadow: 0px 0.5vw 13px 0.5vw #534747; border-radius: 3vw; margin-bottom: 1vh ;display:none; flex-direction: column;`

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
    this.prepareHandles();
    this.createButtons();
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

  createButtons() {
    this.createEmptyPlaylist = document.createElement('button');
    this.importPlaylist = document.createElement('button');

    this.cancel.style.display = 'flex';

    this.createEmptyPlaylist.id = 'create-empty-playlist';
    this.importPlaylist.id = 'import-playlist';
    this.nameInput.id = 'playlistTitle';

    this.createEmptyPlaylist.textContent = 'create empty playlist';
    this.deleteButton.textContent = "delete playlist"
    this.importPlaylist.textContent = 'import playlist';
    this.createEmptyPlaylist.type = 'button';
    this.importPlaylist.type = 'button';
    this.doneButton.textContent = 'save';

    this.createEmptyPlaylist.classList.add('bottomsheet-content-item');
    this.importPlaylist.classList.add('bottomsheet-content-item');
    this.nameInput.classList.add('bottomsheet-content-item');
    this.deleteButton.style.backgroundColor = "red"
    this.deleteButton.style.alignSelf = "flex-end"
    this.nameInput.style.display = this.backButton.style.display = 'none';
    this.content.append(this.createEmptyPlaylist, this.importPlaylist, this.nameInput);
    this.content.append(this.excerciseList, this.optionsList)
  }

  addEntryToList(entry) {
    console.log(`add ${entry.dataset.id}`);
    this.activityItems.push(entry.dataset.id);
  }

  async customActivitesSelection() {
    setTimeout(this.pullupAnimation.bind(this), 50, 78);
    this.playlistDurationText = this.shadow.querySelector("#totalDuration")
    this.cleanContent();
    this.excerciseList.style.display = "flex"
    console.log('add activity');
    this.nameInput.style.display = 'none';
    this.cancel.style.display = 'none';
    this.doneButton.style.display = 'none';
    this.addButton.style.display = 'none';
    this.deleteButton.style.display = 'none';
    this.playlistDurationText.style.display = "none";
    this.backButton.style.display = 'flex';
    this.setTitle('add activity');

    const customActivties = getAllCustomActivites(ACTIVTIES_KEY);
    if (customActivties == null || Object.keys(customActivties).length == 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent =
        'press the + at the bottom to make new activties';
      emptyMessage.classList.add('activty-item');
      this.content.append(emptyMessage);
      return;
    }

    for (let item of Object.keys(customActivties)) {
      // make a web componenet for the event
      const entry = document.createElement('ul');
      const entryText = document.createElement('p');
      entry.dataset.id = item;
      entry.textContent = customActivties[item].title;
      entry.entryID = item;
      // await entry.attachTemplate();
      entry.classList.add('bottomsheet-content-item');
      entry.classList.add('activty-item');
      entry.classList.add('clickable');
      entry.addEventListener('click', this.addEntryToList.bind(this, entry));
      this.excerciseList.append(entry);
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

  setupPlaylistOptions() {
    function createTimeInput(title) {
      const label = document.createElement("p")
      const input = document.createElement("input")
      label.textContent = title
      input.type = "time"
      input.step = "600"
      input.value = "00:00:00"
      input.style.fontSize = "5vw"
      return { label, input }
    }
    const items = []
    //number of sets
    const setContainer = this.createContainer("setContainer")
    const setInput = document.createElement("input")
    const setLabel = document.createElement("p")
    setInput.type = "number"
    setInput.style.fontSize = "5vw"
    setInput.placeholder = "num"
    setInput.style.width = "12vw"
    setLabel.textContent = "number of sets"
    setContainer.append(setLabel,setInput)
    items.push(setContainer)
    // rests between exercies and the formated text
    const restTimerContainer = this.createContainer("restTimerContainer")
    const restTimer = createTimeInput("rest between exercises")
    this.restTimerLabel = restTimer.label
    this.restTimer = restTimer.input
    restTimerContainer.append(this.restTimerLabel, this.restTimer)
    items.push(restTimerContainer)
    // rests between sets
    const setRestContainer = this.createContainer("setRestContainer")
    const setRest = createTimeInput("rest between sets")
    this.setRestLabel = setRest.label
    this.setRestTimer = setRest.input
    setRestContainer.append(this.setRestLabel, this.setRestTimer)
    items.push(setRestContainer)
    // audio option 
    // vibrate 
    // difficulty
    for (let item of items) {
      item.classList.add("bottomsheet-content-item")
      this.optionsList.append(item)
    }
  }

  playlistCreationTool() {
    setTimeout(this.pullupAnimation.bind(this), 50, 75);
    this.cleanContent();

    this.duration = 0;
    const enableList = [this.nameInput, this.doneButton, this.deleteButton, this.playlistDurationText, this.excerciseList, this.optionsList, this.addButton, this.cancel]
    for (let item of enableList) {
      item.style.display = "flex"
    }
    this.backButton.style.display = 'none';
    this.content.style.height = '0vh';
    this.setTitle('create new workout');
    this.createEmptyPlaylist.remove();
    this.importPlaylist.remove();

    const customActivties = getAllCustomActivites(ACTIVTIES_KEY);

    if (this.activityItems.length == 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'press add activity to add activties';
      emptyMessage.classList.add('activty-item');
      this.deleteButton.style.display = 'none';
      this.content.append(emptyMessage);
      this.excerciseList.style.display = this.optionsList.style.display = "none"
      return;
    }
    for (let item of this.activityItems) {
      const entry = document.createElement('ul');
      const name = document.createElement('h2');
      const dragField = document.createElement('p');
      const deleteButton = document.createElement('h4');
      const desciption = document.createElement('p');
      entry.style.justifyContent = 'space-between';
      dragField.textContent = '⋮⋮';
      desciption.style.alignSelf = 'flex-end';
      desciption.style.overflowWrap = 'anywhere';
      this.playlistDurationText = document.createElement("p");
      deleteButton.textContent = '🗑️';
      entry.dataset.id = item;
      entry.style.display = 'flex';
      entry.style.flexDirection = 'row';
      name.textContent = customActivties[item].title;
      desciption.textContent = customActivties[item].description;
      this.duration += customActivties[item].duration
      entry.classList.add('bottomsheet-content-item');
      entry.classList.add('draggable');
      deleteButton.addEventListener('click', () => {
        this.duration -= customActivties[item].duration
        this.updatePlaylistDuration()
        entry.remove();

      });
      entry.draggable = true;
      entry.classList.add('activty-item');
      this.draggingEventListeners(entry);
      this.excerciseList.append(entry);
      entry.append(name, desciption, deleteButton, dragField);
    }
    this.updatePlaylistDuration();
    this.setupPlaylistOptions();
    this.content.append(this.deleteButton)
  }

  updatePlaylistDuration() {
    const text = this.shadow.querySelector("#totalDuration")
    if (this.duration <= 0) {
      text.textContent = ""
      return
    }
    const duration = formatedSeconds(this.duration);
    const hour = duration.hour === 0 ? '' : `${duration.hour}h`;
    const mins = duration.minutes === 0 ? '' : `${duration.minutes}m`;
    const secs = duration.seconds === 0 ? '' : `${duration.seconds}s`;
    text.textContent = ` total time :⏱︎ ${hour}${mins}${secs}`
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
    await savePlaylist(this.UUID, title, this.activityItems);
    await displayPlaylistPage();
    this.destorySelf();
  }
}
customElements.define('new-playlist-menu', newPlaylistMenu);
