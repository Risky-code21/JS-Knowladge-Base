import ScheduleController from "./controllers/ScheduleController.js";
import Schedule from "./models/Schedule.js";
import ScheduleRequest from "./request/FormRequestValidation.js";
import ScheduleView from "./views/ScheduleView.js";
import { DOM } from "./views/ScheduleView.js";

// Refactor #5 event delegation new
document.body.addEventListener("click", function (event) {
  const editButton = event.target.closest("[data-card-edit]");
  const deleteButton = event.target.closest("[data-card-delete]");
  const markAsDoneButton = event.target.closest("[data-card-mark]");
  const unmarkDoneButton = event.target.closest("[data-card-unmark]");
  const sortBtnByTime = event.target.closest("[data-sort-by-time]");
  const sortBtnByCategory = event.target.closest("[data-sort-by-category]");
  // Membuat seleksi dengan satu listner global yang ditanamkan didalam body element, berfungsi untuk mengurangi beban engine dalam mengekskusi banyak listner di banyak element sebelumnya.
  // Show on form
  // Menggunakan methode closes untuk pengelolaan event bubbling, karena button berisi beberapa elemen html
  if (event.target.closest(`#${DOM.triggerFormCreate.id}`)) {
    ScheduleView.showCreateForm();
  }

  // Show off form
  if (event.target === DOM.blackOverlay) {
    if (ScheduleView.ElementActive === "form") {
      ScheduleView.showForm(false);
    }
  }

  // Edit button dan fungsionalitasnya
  if (editButton) {
    const cardId = editButton.getAttribute("data-card-edit");
    ScheduleController.edit(cardId);
  }

  // Delete button dan fungsionalitasnya
  if (deleteButton) {
    const cardId = deleteButton.getAttribute("data-card-delete");
    ScheduleController.delete(cardId);
  }

  // Mark as done button dan fungsionalitasnya
  if (markAsDoneButton) {
    const cardId = markAsDoneButton.getAttribute("data-card-mark");
    ScheduleController.markUnMarkDone(cardId);
  }

  // Un mark button dan fungsionalitasnya
  if (unmarkDoneButton) {
    const cardId = unmarkDoneButton.getAttribute("data-card-unmark");
    ScheduleController.markUnMarkDone(cardId);
  }

  // Sort by time button dan fungsionalitasnya
  if (sortBtnByTime) {
    const sortBy = sortBtnByTime.getAttribute("data-sort-by-time");
    ScheduleController.sortBy(sortBy, "");
  }

  // Sort by category button dan fungsionalitasnya
  if (sortBtnByCategory) {
    const sortBy = sortBtnByCategory.getAttribute("data-sort-by-category");
    ScheduleController.sortBy("", sortBy);
  }
});

// Flexible form submit event
DOM.flexibleForm.addEventListener("submit", function (event) {
  event.preventDefault();
  ScheduleController.handleSubmit(this);
});

ScheduleView.initFormTouchMobile();

// Intial state for the web
ScheduleController.init();
