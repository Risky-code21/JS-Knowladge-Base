import ScheduleController from "./controllers/ScheduleController.js";
import Schedule from "./models/Schedule.js";
import ScheduleRequest from "./request/FormRequestValidation.js";
import ScheduleView from "./views/ScheduleView.js";
import { DOM } from "./views/ScheduleView.js";

// Refactor #5 event delegation new
document.body.addEventListener("click", function (event) {
  const editButton = event.target.closest("[data-card-edit]");
  const deleteButton = event.target.closest("[data-card-delete]");
  // Membuat seleksi dengan satu listner global yang ditanamkan didalam body element, berfungsi untuk mengurangi beban engine dalam mengekskusi banyak listner di banyak element sebelumnya.
  // Show on form
  // Menggunakan methode closes untuk pengelolaan event bubbling, karena button berisi beberapa elemen html
  if (event.target.closest(`#${DOM.triggerFormCreate.id}`)) {
    ScheduleView.showCreateForm();
  }

  if (editButton) {
    const cardId = editButton.getAttribute("data-card-edit");
    ScheduleController.edit(cardId);
  }

  if (deleteButton) {
    const cardId = deleteButton.getAttribute("data-card-delete");
    ScheduleController.delete(cardId);
  }

  // Show off form
  if (event.target === DOM.blackOverlay) {
    if (ScheduleView.ElementActive === "form") {
      ScheduleView.showForm(false);
    }
  }
});

// Flexible form submit event
DOM.flexibleForm.addEventListener("submit", function (event) {
  event.preventDefault();
  ScheduleController.handleSubmit(this);
});

// Intial state for the web
ScheduleController.init();
