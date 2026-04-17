import CardSchedule from "../components/CardSchedule.js";
import IconAlert from "../components/IconALert.js";

export const DOM = {
  blackOverlay: document.getElementById("black-overlay"),
  triggerFormCreate: document.getElementById("btn-create-form-trigger"),
  triggerSort: document.getElementById("btn-sort-form-trigger"),
  flexibleForm: document.getElementById("form-manipulation-flexible"),
  remainderTime: document.getElementById("reminder-time"),
  containerScheduleOnProgress: document.getElementById(
    "container-schedule-on-progresss",
  ),
  containerScheduleDone: document.getElementById("container-schedule-done"),
  errorsElement: document.querySelectorAll(".error"),
};

export default class ScheduleView {
  // Update UI
  static updateUI(scheduleData, remindingTime) {
    const data = scheduleData || [];

    const filterdMappedSchedule = (status) =>
      data
        .filter((schedule) => {
          return schedule.status == status;
        })
        .map((schedule) => {
          return CardSchedule(schedule);
        })
        .join("");

    // Update reminder time UI
    DOM.remainderTime.textContent = `${remindingTime} Minutes`;

    // Update card list UI
    DOM.containerScheduleOnProgress.innerHTML =
      filterdMappedSchedule("On progress");
    DOM.containerScheduleDone.innerHTML = filterdMappedSchedule("Done");
  }

  // Visibility form setting
  static showForm(showState = false) {
    let visiblity = showState;

    DOM.flexibleForm.classList.toggle("hidden", !visiblity);

    DOM.blackOverlay.classList.toggle("invisible", !visiblity);
    DOM.blackOverlay.classList.toggle("opacity-0", !visiblity);

    DOM.blackOverlay.classList.toggle("visible", visiblity);
    DOM.blackOverlay.classList.toggle("opacity-100", visiblity);

    if (!visiblity) {
      document.documentElement.style.overflow = "auto";
    } else {
      document.documentElement.style.overflow = "hidden";
    }
  }

  // Show error validation
  static showErrorMessage(errors) {
    // Reinsialisation the content of the object
    DOM.errorsElement.forEach((element) => (element.innerHTML = ""));

    //Set content error
    for (const key in errors) {
      const errorElement = document.getElementById(`error-${key}`);
      const errorMessage = errors[key];

      if (errorMessage) {
        errorElement.innerHTML = `${IconAlert()} ${errorMessage}`;
      } else {
        errorElement.innerHTML = "";
      }
    }
  }
}
