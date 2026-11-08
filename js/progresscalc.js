const calcForm = document.querySelector("#calc-form");
const pagesInput = document.querySelector("#calc-pages");
const daysInput = document.querySelector("#calc-days");
const resetBtn = document.querySelector("#calc-reset");
const resultBox = document.querySelector("#calc-result");

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