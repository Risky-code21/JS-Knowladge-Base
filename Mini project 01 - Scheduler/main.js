import ScheduleController from "./controllers/ScheduleController.js";
import ScheduleRequest from "./request/FormRequestValidation.js";
import ScheduleView from "./views/ScheduleView.js";
import { DOM } from "./views/ScheduleView.js";

// Refactor #5 event delegation new
document.body.addEventListener("click", function (event) {
  const cardSelected = event.target.closest("[data-card-edit]");
  // Membuat seleksi dengan satu listner global yang ditanamkan didalam body element, berfungsi untuk mengurangi beban engine dalam mengekskusi banyak listner di banyak element sebelumnya.
  // Show on form
  // Menggunakan methode closes untuk pengelolaan event bubbling, karena button berisi beberapa elemen html
  if (event.target.closest(`#${DOM.triggerFormCreate.id}`)) {
    ScheduleView.showForm(true);
  }
  if (cardSelected) {
    const cardId = cardSelected.getAttribute("data-card-edit");
    ScheduleController.edit(cardId);
  }

  // Show off form
  if (event.target === DOM.blackOverlay) {
    ScheduleView.showForm(false);
  }
});

// Flexible form submit event
DOM.flexibleForm.addEventListener("submit", function (event) {
  event.preventDefault();
  ScheduleController.handleSubmit(this);
});

// Intial state for the web
ScheduleController.init();
