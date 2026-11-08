const contactForm = document.querySelector("#contact-form");
const nameInput = document.querySelector("#contact-name");
const emailInput = document.querySelector("#contact-email");
const subjectInput = document.querySelector("#contact-subject");
const messageInput = document.querySelector("#contact-message");

const confirmModalElement = document.querySelector("#confirm-modal");
const confirmModal = new bootstrap.Modal(confirmModalElement);

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  document.querySelector("#confirm-name").textContent = nameInput.value.trim();
  document.querySelector("#confirm-email").textContent = emailInput.value.trim();
  document.querySelector("#confirm-subject").textContent = subjectInput.value.trim();
  document.querySelector("#confirm-message").textContent = messageInput.value.trim();

  confirmModal.show();
  contactForm.reset();
});