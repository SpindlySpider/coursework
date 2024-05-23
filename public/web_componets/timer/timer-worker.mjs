// messages to send back to main thread
const messageType = {
  STARTTIMER: "start-timer",
  PAUSETIMER: "pause-timer",
  STARTTIMERFIRST: "start-timer-first",
  TIMERSTOPPED: "timer-stopped",
  COUNTDOWN: "countdown",
  COUNTDOWNFINISH: "countdown-finish",
  SETLIST: "set-list",
  CHANGEEXCERISE: "change-excerise",
  UPDATEMILISECONDS: "update-miliseconds",
  UPDATESECONDS: "update-seconds",
}
let timeRunning = false
let intervalID;
let miliseconds = 0
let seconds = 0
let index = 0
let durationList = []



function setDurationList(list) {
  durationList = list
}

async function incrementTimer() {
  if (
    durationList[index].duration === seconds) {
    if (durationList.length - index > 1) {
      // switch over to next activity
      index++;
      self.postMessage({ type: messageType.CHANGEEXCERISE, payload: index })
      seconds = 0;
      miliseconds = 0
    } else {
      // end the timer
      stopTimer()
      console.log('finished');
      return
    }
  }
  if (miliseconds % 1000 === 0) {
    seconds++;
    self.postMessage({ type: messageType.UPDATESECONDS, payload: seconds })
  }
  miliseconds += 100
  self.postMessage({ type: messageType.UPDATEMILISECONDS, payload: miliseconds })
}

function startTimer() {
  if (!timeRunning) {
    console.log("starting timer")
    intervalID = setInterval(incrementTimer, 100);
    self.postMessage({ type: messageType.STARTTIMER })
    timeRunning = true;
  } else {
    self.postMessage({ type: messageType.PAUSETIMER })
    clearInterval(intervalID);
    timeRunning = false;
  }
  if (this.timerIndex == 0) {
    // first time running 
    self.postMessage({ type: messageType.STARTTIMERFIRST })
  }
}



function countdownStart() {
  let counter = 3
  intervalID = setInterval(() => {
    console.log(counter)
    if (counter > 0) self.postMessage({ type: messageType.COUNTDOWN, payload: counter })
    else {
      self.postMessage({ type: messageType.COUNTDOWNFINISH })
      clearInterval(intervalID)
    }
    counter--
    // counter = counter-1
  }, 1000)
}

async function handleMainThreadMessage(event) {
  const { type, payload } = event.data

  switch (type) {
    case messageType.COUNTDOWN:
      countdownStart()
      break;
    case messageType.SETLIST:
      console.log("in web worker set list", payload)
      setDurationList(payload)
      break;
    case messageType.STARTTIMER:
      console.log("starting timer in web worker")
      startTimer()
      break
  }
}

function stopTimer() {
  clearInterval(intervalID);
  seconds = 0;
  this.isTimerRunning = false;
  self.postMessage({ type: messageType.TIMERSTOPPED })
}

self.addEventListener("message", handleMainThreadMessage)
self.postMessage({ message: "hi im working lol" })
