
function startTimer(){
  //make sure can only be called once 
  console.log("timer");
  let timerContainer = document.querySelector("#timerContainer");
  let timerText = timerContainer.querySelector("h1");
  let timerInput = timerContainer.querySelector("input");
  let index = timerInput.value;
  let intervalID = setInterval(function(){
    console.log("running",timerInput.value*1000);
    timerText.textContent = `${index -= 1}`;
    if(timerText.textContent == 0){
      clearInterval(intervalID);
    }
  },1000
  );
}
let button = document.querySelector("#timerButton");
button.addEventListener("click",startTimer);
