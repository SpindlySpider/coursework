import { fetchTemplate } from '../utilities.mjs';

export class bottomSheetMenu extends HTMLElement {
  constructor() {
    // must do all of the selections within the constructor
    super();
  }
  bottomSheetPrepareHandles() {
    // this is so that sub classes can set up query selectors
    this.content = this.shadow.querySelector('#bottomsheet-content');
    this.container = this.shadow.querySelector('#bottomsheet-container');
    this.header = this.shadow.querySelector('.bottomsheet-header-buttons');
    this.customTitle = this.shadow.querySelector('#bottomsheet-header-title');
    this.doneButton = this.shadow.querySelector('#bottomsheet-done');
    this.addButton = this.shadow.querySelector('#bottomsheet-add');
  }

  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    await fetchTemplate(
      this.shadow,
      '../../web_componets/bottom-sheet/bottomsheet.html',
    );
    this.bottomSheetPrepareHandles();
    this.content.style.height = '0vh';
    setTimeout(this.pullupAnimation.bind(this), 25, 75);
    this.doneButton.addEventListener('click', this.destorySelf.bind(this));
  }

  destorySelf() {
    this.content.style.height = '0vh';
    setTimeout(() => {
      this.remove();
    }, 300);
  }

  // add a element adding and removing function
  appendEntry(entryObj) {
    this.content.appendChild(entryObj);
  }

  removeEntry(selector) {
    this.content.querySelector(selector).remove();
  }

  pullupAnimation(pullupAmount) {
    this.content.style.height = `${pullupAmount}vh`;
  }

  setTitle(str) {
    // console.log('i listen');
    this.customTitle.textContent = str;
  }
}
customElements.define('bottom-sheet-menu', bottomSheetMenu);
