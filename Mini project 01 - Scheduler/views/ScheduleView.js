import CardSchedule from "../components/CardSchedule.js";
import ErrorIcon from "../components/Icons/ErrorIcon.js";

export const DOM = {
  // Outer elemen atau element yang ada diluar blackoverlay dan akan selalu ada di tampilan layar kapan pun
  triggerFormCreate: document.getElementById("btn-create-form-trigger"),
  triggerSort: document.getElementById("btn-sort-form-trigger"),
  remainderTime: document.getElementById("reminder-time"),
  containerScheduleOnProgress: document.getElementById(
    "container-schedule-on-progresss",
  ),

  // Inner element atau element yang berada didalam black overlay yang hanya aktif dikala tertentu saja
  containerScheduleDone: document.getElementById("container-schedule-done"),
  blackOverlay: document.getElementById("black-overlay"),
  containerFlexibleForm: document.getElementById("container-form-flexible"),
  flexibleForm: document.getElementById("form-manipulation-flexible"),
  errorsElement: document.querySelectorAll(".error"),
};

export default class ScheduleView {
  // Static properti ini hanya digunakan untuk insiasi elemen yang notabanenya adalah elemen yang tidak mandiri untuk menangani transisi ataupun hal-hal yang berkaitan dengan design.
  static ElementActive = null;

  // Static properti yang dilakukan untuk mencatat id khusus yang dihasilakn dari WEB API setTimeout yang kemudian akan digunakan untuk membersihkan timeout agar tidak menurunkan performa dari website kita.
  static timeOutID = null;

  // Static method yang akan digunakan untuk melacak apakah device sudah berganti dari perangkat desktop ke perangkat mobile
  static isMobile = () => window.innerWidth < 768;
  // Static properi yang digunakan untuk meletakan nilai kordinat axis pada layar untuk responsivitas di perangkat mobile
  static startY = 0;
  static currentY = 0;

  // !! Fungsionalitas untuk insialisasi kedalam elemen DOM yang ada atau diseleksi
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

    // Update category filter UI
    // Update reminder time UI
    DOM.remainderTime.textContent = `${remindingTime} Minutes`;

    // Update card list UI
    DOM.containerScheduleOnProgress.innerHTML =
      filterdMappedSchedule("On progress");
    DOM.containerScheduleDone.innerHTML = filterdMappedSchedule("Done");
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

  // !! Fungsionalitas untuk menangani animasi didalam eloemen DOM, entah itu untuk elemen DOM saat berada didesktop device atau saat berada didevice lainnya

  // Insiasi event delegation untuk handle bar element yang digunakan untuk menutup form element di perangkat mobile yang memiliki tampilan bottom sheets
  static initFormTouchMobile() {
    // Event untuk insialisasi titik vertikal dari sentuhan jari kita saat swipe form dari kondisi sebelumnya yang sedang hilang
    DOM.blackOverlay.addEventListener("touchstart", (event) => {
      const handleBar = event.target.closest(".handle-bar");
      if (!handleBar || !this.isMobile()) return;

      // Kita ambil posisi y axis pada interaksi klik yang kita lakukan pertama kalinya saat swipe ini aktif
      this.startY = event.touches[0].clientY;

      // Hapus transition yang ada agar saat swipe, swipe yang kita lakukan tidak terganggu oleh animasi yang kita buat untuk perangkat desktop
      DOM.containerFlexibleForm.style.transition = "none";
    });

    // Event ketika kita melakukan drag pada element touch bar form
    DOM.blackOverlay.addEventListener("touchmove", (event) => {
      const handleBar = event.target.closest(".handle-bar");
      if (!handleBar || !this.isMobile()) return;

      const touchY = event.touches[0].clientY;
      this.currentY = touchY - this.startY;

      if (this.currentY > 0) {
        DOM.containerFlexibleForm.style.setProperty(
          "--drag-axisY",
          `${this.currentY}px`,
        );

        const opacity = 1 - this.currentY / 400;
        DOM.containerFlexibleForm.style.setProperty(
          "--drag-opacity",
          Math.max(opacity, 0),
        );
      }
    });

    // Event final ketika touch sudah dilepas oleh pengguna
    DOM.blackOverlay.addEventListener("touchend", (event) => {
      const handleBar = event.target.closest(".handle-bar");
      if (!handleBar || !this.isMobile()) return;

      DOM.containerFlexibleForm.style.transition = "all 0.5s ease-in-out";

      if (this.currentY > 150) {
        this.showForm(false);
        DOM.containerFlexibleForm.style.setProperty("--drag-axisY", "0px");
        DOM.containerFlexibleForm.style.setProperty("--drag-opacity", "1");
      } else {
        DOM.containerFlexibleForm.style.setProperty("--drag-axisY", "0px");
        DOM.containerFlexibleForm.style.setProperty("--drag-opacity", "1");
      }

      this.currentY = 0;
    });
  }

  // Visibility form setting
  static showForm(showState) {
    if (showState) {
      // Tetapkan state, karena elemen form ini tidak bisa membuat dirinya sendiri mempunyai class hidden, atau istilah lain dia itu tidak mandiri
      this.ElementActive = "form";

      DOM.containerFlexibleForm.style.transition = "all 0.5s ease-in-out";

      // Hapus class kaku sebelumnya. Class kaku disini maksudnya adalah class yang ketika diaplikasikan antara perpindahan state, tidak bisa diberikan animasi khusus yang halus
      document.documentElement.style.overflow = "hidden";
      DOM.blackOverlay.classList.remove("hidden");
      DOM.containerFlexibleForm.classList.remove("hidden");

      // Tetapkan class halus. Class halus adalah kebalikan dari class kaku, class halus lebih lunak dalam anggapan perpindahan antar state bisa diberikan animasi yang halus dan lembut
      setTimeout(() => {
        DOM.containerFlexibleForm.style.transform = "";
        DOM.blackOverlay.classList.add("visible", "opacity-100");
        DOM.containerFlexibleForm.classList.add("active-form");
      }, 10);
    } else {
      if (this.ElementActive == "form") {
        this.ElementActive = null;

        // Sembunyikan class halus sebelum kita benar-benar menetapkan class kaku lagi
        DOM.blackOverlay.classList.remove("visible", "opacity-100");
        DOM.containerFlexibleForm.classList.remove("active-form");

        // Tetapkan class kaku yang telah kita hapus sebelumnya
        setTimeout(() => {
          document.documentElement.style.overflow = "auto";
          DOM.containerFlexibleForm.style.transform = "";
          DOM.blackOverlay.classList.add("hidden");
          DOM.containerFlexibleForm.classList.add("hidden");
        }, 500);
      }
    }
  }

  // Show alert berdasarkan kondisi dari si pemanggil function ini
  static showAlert(alertHTMLString, time = 2000) {
    // Nonaktifkan form element yang sebelumnya
    if (this.ElementActive === "form") {
      DOM.containerFlexibleForm.classList.add("hidden");
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
        const option = event.target.target.closest("[data-option]");

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

  // Update category dropdown
  static updateCategoryDropdown(categories) {
    const categorySortOption = categories.map(
      (category) =>
        `<button data-sort-by-category="${category}" class="cursor-pointer px-4 py-2 rounded-md hover:bg-white/10 transition-all duration-200">${category}</button>`,
    );

    document.getElementById("dropdown-sort-category").innerHTML =
      categorySortOption.join("") || "";
  }
}
