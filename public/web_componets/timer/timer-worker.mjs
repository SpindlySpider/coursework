let timeRunning = false
let intervalID;
let miliseconds = 0
let timeEvent = new CustomEvent("timeEvent",{miliseconds})
async function startTimer() {
  if (!timeRunning) {
    intervalID = setInterval(this.incrementTimer.bind(this), 100);
    dispatchEvent(timeEvent)
    this.updateTimerDisplay();
    this.time.classList.remove('hidden');
    this.upNext.classList.remove('hidden');
    this.shadow.querySelector("#container").style.display = "flex"
    this.shadow.querySelector("#next-container").style.display = "flex"
    this.clockContainer.classList.remove('hidden');
    this.titleText.textContent = this.timerList[this.timerIndex].title;
    this.close.classList.add('hidden');
    this.clock.style.stroke = 'blue';
    this.isTimerRunning = true;
    this.start.textContent = 'pause';
    this.stop.classList.remove('hidden');
  } else {
    //paused
    this.start.textContent = 'start';
    clearInterval(this.intervalID);
    this.isTimerRunning = false;
  }
  if (this.timerIndex == 0) {
    // first time running 
    this.totalTime.style.display = "none"
    this.removePictures()
    await this.appendPictures(this.timerList[this.timerIndex].UUID)
    // get first photos
  }
}
