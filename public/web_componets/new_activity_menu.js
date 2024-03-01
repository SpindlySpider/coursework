class newActivtyMenu extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
<header>
    <div id="dragElement"></div>
    <div id="activtyMenuHeading">
        <button id="exit"></button>
        <input id="activityNameInput"></input>
        <button id="done"></button>
    </div>
  </header>
  <main>
     <input id="descriptionInput"></input>
    <div class="column-group">
      <input type="time"></input>
        <input id="addPhoto"></input>
        <div id="tags"></div>
        <div id="required equipment"></div>
    </div>
      </main>
`;
  }
}
customElements.define('new_activty_menu', newActivtyMenu);
