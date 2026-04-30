import ScheduleController from "./controllers/ScheduleController.js";
import ScheduleView from "./views/ScheduleView.js";

// Menggunakan arrow function pada listner sebagai sebuah callback. Walaupun tidak menggunakan konsep this, ini untuk konsistensi karena beberapa listener dibawahnya juga menggunakan arrow function.
document.addEventListener("DOMContentLoaded", () => {
  ScheduleController.initDataInToUI();
  ScheduleController.initDelegationController();
  ScheduleView.initDelegationView();
  ScheduleView.initSwipeBarMobile();
});
