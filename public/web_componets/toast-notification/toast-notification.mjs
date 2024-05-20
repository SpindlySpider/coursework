export class toast extends HTMLElement {
  constructor() {
    super();
    this.initilized = false;
  }
  async attachTemplate() {
    // extracting this out of the on connectedCallback because it means we can invoke this in javacript to ensure everything is set up correctly
    if (this.initilized) {
      return;
    }
    this.shadow = this.attachShadow({ mode: 'open' });
    await fetchTemplate(
      this.shadow,
      import.meta.resolve(),
    );
    this.initilized = true;
  }


}
customElements.define('toast-notification', toast);
