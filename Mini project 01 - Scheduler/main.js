import ScheduleController from "./controllers/ScheduleController.js";
import ScheduleView from "./views/ScheduleView.js";

document.addEventListener("DOMContentLoaded", function () {
  ScheduleController.initDataInToUI();
  ScheduleController.initDelegationController();
  ScheduleView.initDelegationView();
  ScheduleView.initSwipeBarMobile();
});
