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
  static showForm(showState = false) {
    let visiblity = showState;

    // Ada atau tidaknya elemen form bersumber dari variable visiblity, jika variablenya false maka form akan disembunyikan dari tampilan UI yang dilihat oleh pengguna. Oh iya, perubahaan ini dipengaruhi oleh penambahan dan penghapusan class yang dilakukan oleh toggle methode
    DOM.flexibleForm.classList.toggle("hidden", !visiblity);

    // Hal serupa terjadi juga pada elemen dibawah ini
    // Ini kondisi ketika variable visiblity bernilai false, elemen akan disembunikan dari layar pengguna
    DOM.blackOverlay.classList.toggle("invisible", !visiblity);
    DOM.blackOverlay.classList.toggle("opacity-0", !visiblity);

    // Ini kondisi ketika variable visiblity bernilai True, elemen akan ditampilkan pada layar pengguna
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
    // Memastikan text yang ada pada element yang menerima error sebelumnya dihapus, agar tidak ada penampilan pesan error yang janggal
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

  static editFormSet(data) {
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
}
