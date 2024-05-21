<div id="container">
  <div style="border: 0.5vw solid gray; padding: 0px;  border-radius: 3vw; margin-bottom: 4vh; display: flex; flex-direction: column;width: 89vw;" id="exercise-list"></div>

  <div style="border: 0.5vw solid gray; padding: 0px;  border-radius: 3vw; margin-bottom: 4vh; display: flex; flex-direction: column;width: 89vw;" id="options-list">
    <li style="justify-content: space-between;" id="setContainer" class="bottomsheet-content-item">
      <p>number of sets</p>
      <input id="set-input" type="number" style="font-size: 5vw; width: 12vw;" placeholder="num">
    </li>
    <li style="justify-content: space-between;" id="restTimerContainer" class="bottomsheet-content-item">
      <p>rest between exercises</p>
      <input id="rest-timer-input" type="time" step="600" style="font-size: 5vw;">
    </li>
      <li style="justify-content: space-between;" id="setRestContainer" class="bottomsheet-content-item">
      <p>rest between sets</p>
      <input id="set-rest-input" type="time" step="600" style="font-size: 5vw;">
    </li>
  </div>
</div>
