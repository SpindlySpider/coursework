import { fetchTemplate } from '../utilities.mjs';

export class bottomSheetMenu extends HTMLElement {
  constructor() {
    super();
    this.initilized = false;
    // initilized prevents shadow dom being defined if it already is defined
  }

  bottomSheetPrepareHandles() {
    // this is so that sub classes can set up query selectors
    this.content = this.shadow.querySelector('#bottomsheet-content');
    this.container = this.shadow.querySelector('#bottomsheet-container');
    this.header = this.shadow.querySelector('.bottomsheet-header-buttons');
    this.customTitle = this.shadow.querySelector('#bottomsheet-header-title');
    this.doneButton = this.shadow.querySelector('#bottomsheet-done');
    this.addButton = this.shadow.querySelector('#bottomsheet-add');
    this.backButton = this.shadow.querySelector('#bottomsheet-back');
    this.deleteButton = this.shadow.querySelector('#bottomsheet-delete');
  }

  disableNavbarBorder() {
    document.querySelector('#navbar').classList.remove('border-active');
  }

  enableNavbarBorder() {
    document.querySelector('#navbar').classList.add('border-active');
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
    this.content.style.height = '0vh';
    setTimeout(this.pullupAnimation.bind(this), 25, 70);
    this.doneButton.addEventListener('click', this.destorySelf.bind(this));
    this.disableNavbarBorder();
    this.initilized = true;
  }

  async connectedCallback() {
    if (this.initilized) {
      return;
    }
    await this.attachTemplate();
    this.initilized = true;
  }

  destorySelf() {
    this.content.style.height = '0vh';
    setTimeout(() => {
      this.remove();
      this.enableNavbarBorder();
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
    this.customTitle.textContent = str;
  }
}
customElements.define('bottom-sheet-menu', bottomSheetMenu);
