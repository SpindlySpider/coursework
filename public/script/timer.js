
function startTimer() {
  // make sure can only be called once
  console.log('timer');
  const timerContainer = document.querySelector('#timerContainer');
  const timerText = timerContainer.querySelector('h1');
  const timerInput = timerContainer.querySelector('input');
  let index = timerInput.value;
  const intervalID = setInterval(function () {
    console.log('running', timerInput.value * 1000);
    timerText.textContent = `${index -= 1}`;
    if (timerText.textContent === 0) {
      clearInterval(intervalID);
    }
  }, 1000,
  );
}
const button = document.querySelector('#timerButton');
button.addEventListener('click', startTimer);
