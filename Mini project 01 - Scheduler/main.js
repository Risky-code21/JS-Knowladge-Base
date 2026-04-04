// todo --------------------------- Backend implementation

// Main array storage
let scheduleStroage = []; // change it to let, so it's easy to manipulate
let totalTimeInOneDay = 960; // Convertion time in minute

// Template component card schedule
function cardScheduleComponent(informationCard) {
  return `<article
            class="max-w-full rounded-md bg-[#1e1f20] border border-[#e3e3e3]/10"
            aria-labelledby="title-${informationCard.secretIdentity}"
          >
            <!-- Header card schedule -->
            <header
              class="flex justify-between items-center p-4 border-b border-[#e3e3e3]/10 font-semibold"
            >
              <p
                class="border border-green-600 rounded-full text-green-600 bg-green-200 px-4 py-1"
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

// Class template
class Schedule {
  // private id
  #id;

  constructor(information) {
    this.#id = Schedule.generateUniqId();
    this.title = information.title;
    this.description = information.description;
    this.timeDoing = parseInt(information.timeDoing);
    this.category = information.category;
    this.status = "On progress";
    this.createdAt = Schedule.convertionDate(Date.now());
  }

  // fitur update data
  // ambil satu data yang sesuai dengan id yang ada, lalu edit elemen, kemudian buat array baru menggabungkan elemen yang telah di filter dengan elemen yang ada pada array sebelumnya dengan metode non mutating

  // fitur hapus data
  // ambil satu data yang sesuai dengan id yang ada, lalu hapus elemen yang sesuai yang ada pada array dengan metode slice atau non mutating lainnya

  // fitur mark as done
  // gunakan setter untuk mengganti status dari data schedule saat ini, hampir sama dengan update, kita harus melakukan filter terlebih dahulu, baru lah kita set data elemen pertama yang didapat

  // Generate unique id
  // When the instance of this class born, it will directly generate a unique id, because it called as value in private property id

  get secretIdentity() {
    return this.#id;
  }

  static convertionDate(date) {
    const convDate = new Date(date).toLocaleString("en-EN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return convDate;
  }
  static generateUniqId() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueId = "";
    for (let i = 0; i < 20; i++) {
      // Generate uuid begin
      // Math random will run and always generate new random number, and the number will always rounded down with Math floor, and then the result will time with length of charcter
      // !! Math random always generate number in range 0 - 0.999
      uniqueId += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    console.log(uniqueId);
    return uniqueId;
  }
}

class ManipulatedStorage {
  // Static function untuk menghapus semua data didalam array dan mengembalikan sisa waktu seperti semula
  static clearSchedule() {
    scheduleStroage = [];
  }
  // static function untuk melakukan sorting pada semua data yang ada pada array, entah itu berdasarkan category ataupun waktu pembuatan
  static sortingSchedule(sortingMethode) {
    scheduleStroage.toSorted(() => {});
  }
  // static function untuk menambahkan data schedule kedalam array storage
  static addSchedule(information) {
    // Create new instance from class schedule class
    const newSchedule = new Schedule(information);

    // Insert it as new element in scheduleStorage
    const updatedStorage = [...scheduleStroage, newSchedule];

    // Cek hasil reduce agar semua jadwal tidak melebihi waktu yang ditentukan
    const checkRemindingTime = updatedStorage.reduce((acc, schedule) => {
      return schedule.timeDoing + acc;
    }, 0);

    // Change refrence pointer array in Heap with new order element
    if (checkRemindingTime < 960) {
      scheduleStroage = updatedStorage;
      totalTimeInOneDay -= newSchedule.timeDoing;

      this.updateListCard();
      return true;
    } else {
      // Pop up disini
      return false;
    }
  }

  static updateListCard() {
    remainderTime.textContent = `${totalTimeInOneDay} Minutes`;

    const filterdMappedSchedule = (status) =>
      scheduleStroage
        .filter((schedule) => {
          return schedule.status == status;
        })
        .map((schedule) => {
          return cardScheduleComponent(schedule);
        })
        .join("");

    const onProgressCard = filterdMappedSchedule("On progress");
    console.log(onProgressCard);
    const doneCard = filterdMappedSchedule("Done");

    // Timpa daftar lama
    containerScheduleOnProgress.innerHTML = onProgressCard;
    containerScheduleDone.innerHTML = doneCard;
  }
}

// todo --------------------------- Frontend implementation
// Ambil semua elemen yang terkait
// Penghias
const blackOverlay = document.getElementById("black-overlay");

// Button trigger form create
const triggerFormCreate = document.getElementById("btn-create-form-trigger");
const triggerSort = document.getElementById("btn-sort-form-trigger");

// Form dan input
const flexibleForm = document.getElementById("form-manipulation-flexible");

// Main element penampung halaman
// remainderTime
const remainderTime = document.getElementById("reminder-time");
// penampungSchedule dari setiap section
const containerScheduleOnProgress = document.getElementById(
  "container-schedule-on-progresss",
);

const containerScheduleDone = document.getElementById(
  "container-schedule-done",
);

// show flexible form
function showFlexibleForm() {
  // Hapus class default dari masing-masing element
  flexibleForm.classList.remove("hidden");
  blackOverlay.classList.remove("invisible", "opacity-0");

  // Tambahkan class show atau class animasi
  blackOverlay.classList.add("visible", "opacity-100");
}

// Handle submit form
function submitForm(formElement) {}

// Main flow create
// Button trigger ditekan
// Muncul form create
triggerFormCreate.addEventListener("click", showFlexibleForm);

// Pengguna mengisi semua field atau input yang ada di form create tersebut kemudian submit
flexibleForm.addEventListener("submit", function (event) {
  // Menonaktifkan aksi default form
  event.preventDefault();

  // Ambil semua input yang ada didalam form
  const form = new FormData(this);
  const formInputsValue = Object.fromEntries(form);

  // Tambahkan element kedalam array storage
  const isSucces = ManipulatedStorage.addSchedule({ ...formInputsValue });
  console.log(isSucces);

  if (isSucces) {
    this.reset();

    // Hapus class default dari masing-masing element
    this.classList.add("hidden");
    blackOverlay.classList.add("invisible", "opacity-0");

    // Tambahkan class show atau class animasi
    blackOverlay.classList.remove("visible", "opacity-100");
  }
});

// Lalu step terakhir data jadwal ditampilkan berdasarkan sectionnya
ManipulatedStorage.updateListCard();
