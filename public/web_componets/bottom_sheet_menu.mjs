import { bottomSheetTemplate } from '../templates/bottom_sheet.mjs';
export class bottomSheetMenu extends HTMLElement {
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = bottomSheetTemplate.innerHTML;
    this.container = this.shadow.querySelector('#bottomsheet-container');
    this.header = this.shadow.querySelector('.bottomsheet-header-buttons');
    this.customTitle = this.shadow.querySelector('#bottomsheet-header-title');
    this.content = this.shadow.querySelector('#bottomsheet-content');
    this.doneButton = this.shadow.querySelector('#bottomsheet-done');
    // this.content.style.paddingBottom = '0vh';
    this.content.style.height = '0vh';
  }

  connectedCallback() {
    // this.donebutton.addEventListener('click', this.saveNewActivty.bind(this));
    // this.pullupAnimation.bind(this);
    // set up event listners here
    setTimeout(this.pullupAnimation.bind(this), 25, 75);
    this.doneButton.addEventListener('click', this.destorySelf.bind(this));
    // setTimeout(this.pullupAnimation, 100, 75);
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
