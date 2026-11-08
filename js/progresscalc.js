// Progress calculator section
const calcForm = document.querySelector("#calc-form");
const pagesInput = document.querySelector("#calc-pages");
const daysInput = document.querySelector("#calc-days");
const resetBtn = document.querySelector("#calc-reset");
const resultBox = document.querySelector("#calc-result");

// Reading test section
const testStartBtn = document.querySelector("#test-start");
const testStopBtn = document.querySelector("#test-stop");
const testPassage = document.querySelector("#test-passage");
const testPlaceholder = document.querySelector("#test-placeholder");
const testTimer = document.querySelector("#test-timer");
const testResult = document.querySelector("#test-result");

function showMessage(message, isError) {
  resultBox.innerHTML = message;
  resultBox.classList.remove("d-none");

  if (isError === true) {
    resultBox.classList.remove("alert-success");
    resultBox.classList.add("alert-danger");
  } else {
    resultBox.classList.remove("alert-danger");
    resultBox.classList.add("alert-success");
  }
}

calcForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (pagesInput.value === "" || daysInput.value === "") {
    showMessage("Please fill in both fields.", true);
    return;
  }

  const pages = Number(pagesInput.value);
  const days = Number(daysInput.value);

  if (pages < 1 || days < 1) {
    showMessage("Pages and days must both be at least 1.", true);
    return;
  }

  if (Number.isInteger(pages) === false || Number.isInteger(days) === false) {
    showMessage("Please enter whole numbers only.", true);
    return;
  }

  const pagesPerDay = Math.ceil(pages / days);

  showMessage(`You need to read <strong>${pagesPerDay}</strong> page(s) a day to finish a ${pages}-page book in ${days} day(s).`, false);
});

resetBtn.addEventListener("click", function () {
  calcForm.reset();
  resultBox.classList.add("d-none");
});

// Reading test section

let testStartTime = null;
let testTimerId = null;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let secondsText = String(seconds);
  if (seconds < 10) {
    secondsText = "0" + secondsText;
  }

  return minutes + ":" + secondsText;
}

function updateTimer() {
  const elapsedSeconds = Math.floor((Date.now() - testStartTime) / 1000);
  testTimer.textContent = formatTime(elapsedSeconds);
}

testStartBtn.addEventListener("click", function () {
  testStartTime = Date.now();

  testResult.classList.add("d-none");
  testPlaceholder.classList.add("d-none");
  testPassage.classList.remove("d-none");
  testTimer.textContent = "0:00";

  testStartBtn.disabled = true;
  testStopBtn.disabled = false;

  testTimerId = setInterval(updateTimer, 1000);
});

testStopBtn.addEventListener("click", function () {
  clearInterval(testTimerId);

  const elapsedSeconds = (Date.now() - testStartTime) / 1000;

  testPassage.classList.add("d-none");
  testPlaceholder.classList.remove("d-none");
  testStartBtn.disabled = false;
  testStopBtn.disabled = true;

  testResult.classList.remove("d-none");

  if (elapsedSeconds < 7) {
    testResult.innerHTML = "That was very quick! Please read the whole page, then try again.";
    return;
  }

  const pagesPerHour = Math.round(3600 / elapsedSeconds);
  const shownSeconds = Math.round(elapsedSeconds);
  
  testResult.innerHTML =
    "You read 1 page in <strong>" + formatTime(shownSeconds) +
    "</strong>. Your reading speed is about <strong>" + pagesPerHour +
    "</strong> page(s) per hour.";
});