import CardSchedule from "../components/CardSchedule.js";
import ErrorIcon from "../components/Icons/ErrorIcon.js";

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
  alertSuccessUpdate: document.getElementById("alert-success-update"),
};

export default class ScheduleView {
  static ElementActive = null;
  static timeOutID = null;

  // Update UI
  static updateUI(scheduleData, remindingTime) {
    // Mengganti pengecualian menjadi array, agar tipe data tetap konsisten meski nantinya data yang dituju tidak menghasilkan data atau kosong, dia tetap mengembalikan array yang bisa di proses dan tidak menyebabkan error apa pun
    const data = scheduleData || [];

    // Fugsi untuk melakukan fillter schedule sesuai status dari section tempat schedule itu diletakan nantinya
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
  static showForm(showState) {
    if (showState) {
      // Cek apakah ada elemen yang aktif didalam blackoverlay saat ini
      // Jika ada kita non aktifkan element tersebut terlebih dahulu
      // Jika tidak ada kita langsung eksekusi visiblity form berdasarkan state yag diberikan oleh pemanggil fungsi
      this.ElementActive = "form";
      document.documentElement.style.overflow = "hidden";
      DOM.blackOverlay.classList.add("visible", "opacity-100");
      DOM.blackOverlay.classList.remove("hidden");
      DOM.flexibleForm.classList.remove("hidden");
    } else {
      if (this.ElementActive == "form") {
        this.ElementActive = null;
        document.documentElement.style.overflow = "auto";
        DOM.blackOverlay.classList.remove("visible", "opacity-100");
        DOM.blackOverlay.classList.add("hidden");
        DOM.flexibleForm.classList.add("hidden");
      }
    }
  }

  // Function untuk menampapilkan form create dan pengelolaan value dari inputnya
  static showCreateForm() {
    const currentId = DOM.flexibleForm.querySelector("#scheduleId").value;

    if (currentId) {
      DOM.flexibleForm.reset();
    }

    document.getElementById("create-button").classList.remove("hidden");
    document.getElementById("update-button").classList.add("hidden");
    this.showForm(true);
  }

  // Function untuk memanipulasi form mode menjadi mode update, perlu diperbaiki karena mode create masih terganggu
  static showEditForm(data) {
    // Metode seleksi hampir sama, kita reset form agar state value dari create ataupun edit sebelumnya bisa hilang
    DOM.flexibleForm.reset();

    // Kita petakan value baru berdasarkan data yang sedang diakses saat ini
    let scheduleData = data;

    DOM.flexibleForm.querySelectorAll("[name]").forEach((element) => {
      const fieldName = element.getAttribute("name");
      const value = scheduleData[fieldName];

      if (!value) return;

      element.value = value;
    });

    document.getElementById("create-button").classList.add("hidden");
    document.getElementById("update-button").classList.remove("hidden");
    this.showForm(true);
  }

  // Show alert berdasarkan kondisi dari si pemanggil function ini
  static showAlert(alertHTMLString, time = 2000) {
    // Nonaktifkan form element yang sebelumnya
    if (this.ElementActive === "form") {
      DOM.flexibleForm.classList.add("hidden");
    }

    if (this.ElementActive === null) {
      console.log("executed");
      document.documentElement.style.overflow = "hidden";
      DOM.blackOverlay.classList.add("visible", "opacity-100");
      DOM.blackOverlay.classList.remove("hidden");
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = alertHTMLString.trim();
    const alertElement = tempDiv.firstElementChild;

    DOM.blackOverlay.appendChild(alertElement);

    // Kita pastikan untuk mengurung setTimeout didalam sebuah variable, agar bisa di clear nantinya
    this.timeOutID = setTimeout(() => {
      document.documentElement.style.overflow = "auto";
      DOM.blackOverlay.classList.remove("visible", "opacity-100");
      DOM.blackOverlay.classList.add("hidden");
      alertElement.remove();
    }, time);
  }

  // Show confirmation
  static showConfirmation(confirmationHTMLString) {
    // pastikan tidak ada elemen yang tampil didalam blackoverlay
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = confirmationHTMLString.trim();
    const confirmationElement = tempDiv.firstChild;

    return new Promise((reslove) => {
      DOM.blackOverlay.classList.add("visible", "opacity-100");
      DOM.blackOverlay.classList.remove("hidden");
      DOM.blackOverlay.appendChild(confirmationElement);

      // Event delegation untuk mendapatkan tombol tutup dan tombol konfirmasi
      confirmationElement.addEventListener("click", function (event) {
        const option = event.target.closest("[data-option]");

        if (option) {
          const choice = option.getAttribute("data-option");

          if (choice === "true") {
            confirmationElement.remove();
            reslove(true);
          } else {
            DOM.blackOverlay.classList.remove("visible", "opacity-100");
            DOM.blackOverlay.classList.add("hidden");
            confirmationElement.remove();
            reslove(false);
          }
        }
      });
    });
  }

  // Show error validation
  static showErrorMessage(errors) {
    // Reinsialisation the content of the object
    // Memastikan text yang ada pada element yang menerima error sebelumnya dihapus, agar tidak ada penampilan pesan error yang janggal
    DOM.errorsElement.forEach((element) => (element.innerHTML = ""));

    //Set content error
    for (const key in errors) {
      const errorElement = document.getElementById(`error-${key}`);
      const errorMessage = errors[key];

      if (errorMessage) {
        errorElement.innerHTML = `${ErrorIcon()} ${errorMessage}`;
      } else {
        errorElement.innerHTML = "";
      }
    }
  }
}
