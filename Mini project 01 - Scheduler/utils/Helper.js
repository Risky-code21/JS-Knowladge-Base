import ErrorIcon from "../components/Icons/ErrorIcon.js";
import { DOM } from "../views/ScheduleView.js";

export const HelperData = {
  // Convertion date helper
  convertionDate: (date) => {
    const convDate = new Date(date).toLocaleString("en-EN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return convDate;
  },
};

export const HelperUI = {
  // Generate random category color
  // Refactor #6 memindahkan function generate color otomatis untuk category ini agar pemanggilan di preference main class lebih rapi
  generateUniqueColorCategory() {
    const baseOfColor = [
      {
        name: "blue",
        border: "border-blue-600",
        background: "bg-blue-200",
        text: "text-blue-600",
      },
      {
        name: "green",
        border: "border-green-600",
        background: "bg-green-200",
        text: "text-green-600",
      },
      {
        name: "orange",
        border: "border-orange-600",
        background: "bg-orange-200",
        text: "text-orange-600",
      },
    ];

    const selectedColor =
      baseOfColor[Math.floor(Math.random() * baseOfColor.length)];

    return selectedColor;
  },

  renderTimeStats(timeUsed, timeReminding) {
    if (timeReminding == null || isNaN(timeReminding)) return;

    // Opperand kedalam UI time used
    const timeUsedHours = Math.floor(timeUsed / 60);
    const timeUsedMinutes = timeUsed % 60;

    // Opperand kedalam UI time remining
    const remindingHours = Math.floor(timeReminding / 60);
    const remindingMinutes = timeReminding % 60;

    DOM.timeUsedHoursDisplay.textContent = timeUsedHours;
    DOM.timeUsedMinutesDisplay.textContent = timeUsedMinutes;
    DOM.remindingDisplay.innerHTML = `
      ${ErrorIcon("size-4")} 
      <span class="text-inherit shrink-0">
        ${timeReminding <= 0 ? "Your daily time is up!" : `${remindingHours} Hours ${remindingMinutes} Minutes remaining!`}
      </span>
    `;
  },
};
