<div id="container">
  <div style="border: 0.5vw solid gray; padding: 0px;  border-radius: 3vw; margin-bottom: 4vh; display: flex; flex-direction: column;width: 89vw;" id="exercise-list"></div>

  <div style="margin-bottom: 4vh; display: flex; flex-direction: column;width: 89vw;" id="options-list">
    <li style="justify-content: space-between;display: flex;font-size: 7vw;border: 0.5vw solid black;border-bottom: 0;border-radius: 5vw 5vw 0vw 0vw;" id="setContainer" >
      <p style="margin: 1vh 5vw;">number of sets:</p>
      <input id="set-input" type="number" style="font-size: 5vw; width: 10vw;border-radius: 5vw;margin: 1vh 1vw;border: 0.5vw black solid;text-align: center;" placeholder="num">
    </li>
    <li style="justify-content: space-between;display: flex;font-size: 7vw;border: 0.5vw solid black;" id="restTimerContainer" >
      <p style="margin: 1vh 5vw;">rest between exercises:</p>
      <input id="rest-timer-input" type="time" step="600" style="font-size: 5vw;border-radius: 5vw;padding: 1vw;margin: 2vw;">
    </li>
      <li style="justify-content: space-between;display: flex;font-size: 7vw;border: 0.5vw solid black;border-top: 0;border-radius: 0vw 0vw 5vw 5vw;" id="setRestContainer" >
      <p style="margin: 1vh 5vw;">rest between sets:</p>
      <input id="set-rest-input" type="time" step="600" style="font-size: 5vw;border-radius: 5vw;padding: 1vw;margin: 2vw;">
    </li>
  </div>
</div>
