// todo --------------------------- Backend implementation

// Model schedule represented by class Schedule
class Schedule {
  #id;

  constructor(information) {
    this.#id = Helper.generateUniqueId();
    this.title = information.title;
    this.description = information.description;
    this.timeDoing = parseInt(information.timeDoing);
    this.category = information.category;
    this.status = "On progress";
    this.createdAt = Helper.convertionDate(Date.now());
    this.preference = { categoryPreference: generateUniqueColorCategory() };
  }

  get secretIdentity() {
    return this.#id;
  }

  markAsDone() {
    this.status = "Done";
  }
}

// Controller
class ScheduleController {
  // Controller property
  static ScheduleStorage = {
    key: "ScheduleStorage",
    getData() {
      return JSON.parse(localStorage.getItem(this.key));
    },
    setData(data = []) {
      localStorage.setItem(this.key, JSON.stringify(data));
    },
  };

  static totalTimeInOneDay = 960;

  static calculationRemindingTime() {
    const totalTimeSchedule = (this.ScheduleStorage.getData() || []).reduce(
      (acc, schedule) => {
        return schedule.timeDoing + acc;
      },
      0,
    );
    console.log(totalTimeSchedule);

    const reminding = 960 - totalTimeSchedule;

    this.totalTimeInOneDay = reminding < 0 ? 0 : reminding;

    return this.totalTimeInOneDay;
  }

  static massiveDelete() {
    this.ScheduleStorage.setData([]);
  }

  // Sorting
  static sortingSchedule(sortingMethode) {
    this.ScheduleStorage.getData();
  }

  // todo --> Need refactor
  // Create
  static createSchedule(information) {
    const newSchedule = new Schedule(information);
    let updatedStorage = [];

    if (this.ScheduleStorage.getData()) {
      updatedStorage = [...this.ScheduleStorage.getData(), newSchedule];
    } else {
      updatedStorage = [newSchedule];
    }

    const checkRemindingTime = updatedStorage.reduce((acc, schedule) => {
      return schedule.timeDoing + acc;
    }, 0);

    if (checkRemindingTime <= 960) {
      this.ScheduleStorage.setData(updatedStorage);

      this.updateListCard();
      return true;
    } else {
      // Pop up will be here
      return false;
    }
  }

  // todo --> Need refactor
  static updateListCard() {
    this.calculationRemindingTime();
    DOM.remainderTime.textContent = `${this.totalTimeInOneDay} Minutes`;
    console.log(this.totalTimeInOneDay);

    const filterdMappedSchedule = (status) =>
      (this.ScheduleStorage.getData() || [])
        .filter((schedule) => {
          return schedule.status == status;
        })
        .map((schedule) => {
          return cardScheduleComponent(schedule);
        })
        .join("");

    let onProgressCard = [];
    let doneCard = [];

    if (!this.ScheduleStorage.getData()) {
      return;
    }

    onProgressCard = filterdMappedSchedule("On progress");
    doneCard = filterdMappedSchedule("Done");

    DOM.containerScheduleOnProgress.innerHTML = onProgressCard;
    DOM.containerScheduleDone.innerHTML = doneCard;
  }
}

// Helper
const Helper = {
  // Generate unique id helper
  generateUniqueId: () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueId = "";
    for (let i = 0; i < 20; i++) {
      uniqueId += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return uniqueId;
  },

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

// View or familiar with DOM in js
function generateUniqueColorCategory() {
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
}

function cardScheduleComponent(informationCard) {
  let preferenceCard = informationCard.preference.categoryPreference;

  return `<article
            class="max-w-full rounded-md bg-[#1e1f20] border border-[#e3e3e3]/10"
            aria-labelledby="title-${informationCard.secretIdentity}"
          >
            <!-- Header card schedule -->
            <header
              class="flex justify-between items-center p-4 border-b border-[#e3e3e3]/10 font-semibold"
            >
              <p
                class="border ${preferenceCard.border} rounded-full ${preferenceCard.text} ${preferenceCard.background} px-4 py-1"
              >
                ${informationCard.category}
              </p>
              <p aria-label="Estimation time doing: 120 minutes">${informationCard.timeDoing} Minutes</p>
            </header>

            <!-- Main content of card -->
            <div class="p-4 border-b border-[#e3e3e3]/10">
              <!-- Title -->
              <!-- !! Update, use h1 element once in our html file, in sub elemen use smaller heading then h1, lika: h2, h3, and soon -->
              <h2 class="text-2xl font-semibold mb-2" id="title-${informationCard.id}">
                ${informationCard.title}
              </h2>
              <!-- Description -->
              <p>
              ${informationCard.description}
              </p>
            </div>

            <!-- Footer card -->
            <footer class="p-4 flex justify-between items-center">
              <!-- Day created -->
              <!-- !! Update, use time for text that represent a date, or spesific time -->
              <time datetime="2026-04-03" class="text-sm opacity-40"
                >${informationCard.createdAt}</time
              >

              <!-- CTA container -->
              <div class="flex gap-2">
                <!-- Button delete -->
                <button
                  class="cursor-pointer p-2 border border-red-600 rounded-full text-red-600 bg-red-200 text-sm"
                  aria-label="Delete schedule button trigger"
                  title="Delete this schedule"
                >
                  <!-- Trash icon for the button -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-4"
                    id="trash-icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>

                <!-- Button update -->
                <button
                  class="cursor-pointer p-2 border border-blue-600 rounded-full text-blue-600 bg-blue-200 text-sm"
                  aria-label="Edit schedule button trigger"
                  title="Edit this schedule"
                >
                  <!-- Pencil icon for the button -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-4"
                  >
                    <path
                      d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z"
                    />
                  </svg>
                </button>

                <!-- Button mark as done -->
                <button
                  class="cursor-pointer p-2 border border-green-600 rounded-full text-green-600 bg-green-200 text-sm"
                  aria-label="Mark as done schedule button trigger"
                  title="Mark as done this schedule"
                >
                  <!-- Check icon fot the button -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-4"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </footer>
          </article>`;
}

// Dom element object
const DOM = {
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

// Show flexible form
DOM.triggerFormCreate.addEventListener("click", function () {
  showForm(true);
});

// event delegetion
DOM.blackOverlay.addEventListener("click", function (event) {
  if (event.target === DOM.blackOverlay) {
    showForm(false);
  }
});

function formValidation(formInputs) {
  const errors = {};

  if (!formInputs.title || !formInputs.title.trim() === "") {
    errors.title = "Title cannot be empty";
  }

  if (!formInputs.timeDoing || isNaN(formInputs.timeDoing)) {
    if (formInputs.timeDoing <= 0) {
      errors.timeDoing = "Time doing must be more than 1 minute";
    } else {
      errors.timeDoing = "Time doing must be a number.";
    }
  }

  return errors;
}

function showForm(showState = false) {
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

// Flexible form submit event
DOM.flexibleForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const form = new FormData(this);
  const formInputsValue = Object.fromEntries(form);

  const iconAlert = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
</svg>
`;
  const formErrors = formValidation(formInputsValue);

  if (Object.keys(formErrors).length === 0) {
    const isSucces = ScheduleController.createSchedule({ ...formInputsValue });
    if (isSucces) {
      this.reset();
      showForm(false);
    }
  } else {
    for (key in formErrors) {
      const errorElement = document.getElementById(`error-${key}`);

      if (errorElement) {
        errorElement.innerHTML = `${iconAlert} ${formErrors[key]}`;
      }
    }
  }
});

// Intial state for the web
ScheduleController.updateListCard();
