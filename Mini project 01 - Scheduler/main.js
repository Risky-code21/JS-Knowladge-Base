import ScheduleController from "./controllers/ScheduleController.js";
import ScheduleRequest from "./request/FormRequestValidation.js";
import ScheduleView from "./views/ScheduleView.js";
import { DOM } from "./views/ScheduleView.js";

// Refactor #5 event delegation new
document.body.addEventListener("click", function (event) {
  // Membuat seleksi dengan satu listner global yang ditanamkan didalam body element, berfungsi untuk mengurangi beban engine dalam mengekskusi banyak listner di banyak element sebelumnya.
  // Show on form
  // Menggunakan methode closes untuk pengelolaan event bubbling, karena button berisi beberapa elemen html
  if (event.target.closest(`#${DOM.triggerFormCreate.id}`)) {
    ScheduleView.showForm(true);
  }

  // Show off form
  if (event.target === DOM.blackOverlay) {
    ScheduleView.showForm(false);
  }
});

// Flexible form submit event
DOM.flexibleForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formatedFormElement = new FormData(this);
  const formInputsValue = Object.fromEntries(formatedFormElement);
  let formErrors = ScheduleRequest.formValidation(formInputsValue);

  if (Object.keys(formErrors).length === 0) {
    const isSuccess = ScheduleController.create({ ...formInputsValue });

    if (isSuccess) {
      this.reset();
      ScheduleView.showForm(false);
    }
  } else {
    ScheduleView.showErrorMessage(formErrors);
  }
});

// Intial state for the web
ScheduleController.init();
