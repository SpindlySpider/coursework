export const bottomSheetTemplate = document.createElement('template');
bottomSheetTemplate.innerHTML = `
<style>
#bottomsheet-container {
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 4px;
  background-color: grey;
  position: absolute;
  bottom: 0;
  paddingBottom: 0vh;
  border-radius: 30px 30px 0 0;

}

.bottom-sheet-container-hidden{
  display:none;
  padding-bottom:0vh;
}
#bottomsheet-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#drag-bar {
  width: 5vw;
  height: 10px;
  background-color: white;
  border: 0.5rem;
  border-radius: 30px;
  margin: 10px;
  margin-top: 1vh;
}
.empty-space {
  flex: 1;
}
#bottomsheet-header-title {
  display: flex;
  align-self: flex-start;
  justify-self: flex-start;
}
.bottomsheet-header-buttons {
  font-size: 3em;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100vw;
}
.bottomsheet-header-item {
  margin: 0 25px 0 10px;
  padding: 0px 30px 0px 30px;
}
.bottomsheet-content-item {
  display: flex;
  border-radius: 15px;
  text-align: center;
  background-color: yellow;
  font-size: 2em;
  margin: 10px 0 10px 0;
  padding: 2vh 35vw 2vh 35vw;
  justify-content: center;
}
.bottomsheet-header-button {
  font-size: 40px;
}
#bottomsheet-content{
  /* transition:padding-bottom 300ms; */
  transition:height 300ms;
  overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
}
.bottomsheet-content-title {
  display: flex;
  text-align: center;
  font-size: 2em;
  padding-top: 2%;
  padding-bottom: 2%;
}
</style>

<form id="bottomsheet-container">
  <header id="bottomsheet-header">
    <div id="drag-bar" class="bottomsheet-header-item"></div>
    <div class="bottomsheet-header-buttons">
      <p id="bottomsheet-header-title" class="bottomsheet-header-item">title</p>
      <div class="empty-space"></div>
      <button
        id="bottomsheet-add"
        class="bottomsheet-header-item bottomsheet-header-button"
      type='button'>
        add
      </button>
      <button
        id="bottomsheet-done"
        class="bottomsheet-header-item bottomsheet-header-button"
        type='button'
      >
        done
      </button>
    </div>
  </header>
  <main id="bottomsheet-content">
  </main>
</form>`;
