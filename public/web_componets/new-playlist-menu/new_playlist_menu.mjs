import {
  ACTIVTIES_KEY,
  PLAYLIST_KEY,
  deleteFromLocal,
  fetchTemplate,
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
    this.UUID;
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
    this.addButton.textContent = 'add activity';
    this.backButton = this.shadow.querySelector('#bottomsheet-back');
    this.cancel = this.shadow.querySelector('#bottomsheet-cancel');
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
    this.content.addEventListener('dragover', this.dragOverInsert.bind(this));
    this.content.addEventListener('touchmove', this.dragOverInsert.bind(this));
  }

  dragOverInsert(event) {
    let yPos = event.clientY;
    if (event.type == 'touchmove') {
      yPos = event.targetTouches[0].clientY;
    }
    event.preventDefault();
    const elementAfter = this.getAfterElement(yPos);
    const draggable = this.shadow.querySelector('.dragging');
    if (elementAfter == null) {
      this.content.appendChild(draggable);
    } else {
      this.content.insertBefore(draggable, elementAfter);
    }
  }

  deletePlaylist() {
    deleteFromLocal(this.UUID, PLAYLIST_KEY);
    displayPlaylistPage();
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
    this.importPlaylist.textContent = 'import playlist';
    this.createEmptyPlaylist.type = 'button';
    this.importPlaylist.type = 'button';
    this.doneButton.textContent = 'save';

    this.createEmptyPlaylist.classList.add('bottomsheet-content-item');
    this.importPlaylist.classList.add('bottomsheet-content-item');
    this.nameInput.classList.add('bottomsheet-content-item');
    this.nameInput.style.display = 'none';
    this.backButton.style.display = 'none';
    this.content.append(this.createEmptyPlaylist);
    this.content.append(this.importPlaylist);
    this.content.append(this.nameInput);
  }

  addEntryToList(entry) {
    console.log(`add ${entry.dataset.id}`);
    this.activityItems.push(entry.dataset.id);
  }

  async customActivitesSelection() {
    setTimeout(this.pullupAnimation.bind(this), 50, 90);
    this.cleanContent();
    console.log('add activity');
    this.nameInput.style.display = 'none';
    this.cancel.style.display = 'none';
    this.doneButton.style.display = 'none';
    this.addButton.style.display = 'none';
    this.deleteButton.style.display = 'none';
    this.backButton.style.display = 'flex';
    this.setTitle('add activity');

    const customActivties = getAllCustomActivites(ACTIVTIES_KEY);
    if (customActivties == null || Object.keys(customActivties).length == 0) {
      let emptyMessage = document.createElement('p');
      emptyMessage.textContent =
        'press the + at the bottom to make new activties';
      emptyMessage.classList.add('activty-item');
      this.content.append(emptyMessage);
      return;
    }

    for (let item of Object.keys(customActivties)) {
      // make a web componenet for the event
      const entry = document.createElement('activity-entry');
      entry.editable = false;
      entry.dataset.id = item;
      entry.textContent = customActivties[item].title;
      entry.entryID = item;
      await entry.attachTemplate();
      entry.classList.add('bottomsheet-content-item');
      entry.classList.add('activty-item');
      entry.classList.add('clickable');
      entry.addEventListener('click', this.addEntryToList.bind(this, entry));
      this.content.append(entry);
    }
  }

  cleanContent() {
    let items = this.content.querySelectorAll('.activty-item');
    for (let item of items) {
      item.remove();
    }
  }

  getAfterElement(y) {
    let draggableItems = this.content.querySelectorAll(
      '.draggable:not(.dragging)',
    );
    draggableItems = Array.from(draggableItems);
    return draggableItems.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY },
    ).element;
  }

  playlistCreationTool() {
    setTimeout(this.pullupAnimation.bind(this), 50, 75);
    console.log('donbe');
    this.cleanContent();
    this.nameInput.style.display = 'flex';
    this.doneButton.style.display = 'flex';
    this.backButton.style.display = 'none';
    this.deleteButton.style.display = 'flex';
    this.content.style.height = '0vh';
    this.setTitle('create new workout');
    this.addButton.style.display = 'flex';
    this.cancel.style.display = 'flex';
    this.createEmptyPlaylist.remove();
    this.importPlaylist.remove();

    const customActivties = getAllCustomActivites(ACTIVTIES_KEY);

    if (this.activityItems.length == 0) {
      let emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'press add activity to add activties';
      emptyMessage.classList.add('activty-item');
      this.content.append(emptyMessage);
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
      deleteButton.textContent = '🗑️';
      entry.dataset.id = item;
      entry.style.display = 'flex';
      entry.style.flexDirection = 'row';
      name.textContent = customActivties[item].title;
      desciption.textContent = customActivties[item].description;
      entry.classList.add('bottomsheet-content-item');
      entry.classList.add('draggable');
      deleteButton.addEventListener('click', () => {
        entry.remove();
      });
      entry.draggable = true;
      entry.classList.add('activty-item');
      this.draggingEventListeners(entry);
      this.content.append(entry);
      entry.append(name, desciption, deleteButton, dragField);
    }
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

  disconnectedCallback() {}

  async saveNewPlaylist() {
    if (this.UUID == undefined) {
      this.UUID = await getUUID();
    }
    this.activityItems = [
      ...this.content.querySelectorAll('.activty-item'),
    ].map((item) => {
      return item.dataset.id;
    }); // turning the visual order into the saved order of events
    console.log(this.activityItems);
    if (this.activityItems[0] === undefined) {
      this.activityItems = [];
    }
    const title = this.nameInput.value;
    savePlaylist(this.UUID, title, this.activityItems);
    displayPlaylistPage();
    this.destorySelf();
  }
}
customElements.define('new-playlist-menu', newPlaylistMenu);
