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
  static elementActive = null;

  // Sebuah properti baru untuk mengambil state dari resolve local agar bisa dimanipulasi oleh blok diluarnya
  static confirmationResolver = null;

  // !! Perlu diperbaiki untuk fugsi close alert
  static modalActive = null;

  // Static properti yang dilakukan untuk mencatat id khusus yang dihasilakn dari WEB API setTimeout yang kemudian akan digunakan untuk membersihkan timeout agar tidak menurunkan performa dari website kita.
  static timeOutIDS = [];
  // Static properti yang akan digunakan ketika permulaan eksekusi function yang memiliki proses setTimeout didalamnya
  static clearAllTimeOut = function () {
    if (this.timeOutIDS.length > 0) {
      this.timeOutIDS.forEach((id) => {
        clearTimeout(id);
      });

      this.timeOutIDS = [];
    }
  };

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

    let currentElement;

    DOM.blackOverlay.addEventListener("touchstart", (event) => {
      const handleBar = event.target.closest(".handle-bar");
      if (!handleBar || !this.isMobile()) return;

      // Kita ambil posisi y axis pada interaksi klik yang kita lakukan pertama kalinya saat swipe ini aktif
      this.startY = event.touches[0].clientY;

      // Hapus transition yang ada agar saat swipe, swipe yang kita lakukan tidak terganggu oleh animasi yang kita buat untuk perangkat desktop
      if (this.elementActive === "form") {
        currentElement = DOM.containerFlexibleForm;
      } else if (this.elementActive === "confirmation") {
        currentElement = document.querySelector(".modal-primary");
      }

      currentElement.style.transition = "none";
    });

    // Event ketika kita melakukan drag pada element touch bar form
    DOM.blackOverlay.addEventListener("touchmove", (event) => {
      const handleBar = event.target.closest(".handle-bar");
      if (!handleBar || !this.isMobile()) return;

      const touchY = event.touches[0].clientY;
      this.currentY = touchY - this.startY;

      if (this.currentY > 0) {
        currentElement.style.setProperty("--drag-axisY", `${this.currentY}px`);

        const opacity = 1 - this.currentY / 400;
        currentElement.style.setProperty(
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
        if (this.elementActive === "form") {
          this.showForm(false);
        } else if (this.elementActive === "confirmation") {
          this.closeConfirmation(false, true);
        }
        currentElement.style.setProperty("--drag-axisY", "0px");
        currentElement.style.setProperty("--drag-opacity", "1");
      } else {
        currentElement.style.setProperty("--drag-axisY", "0px");
        currentElement.style.setProperty("--drag-opacity", "1");
      }

      this.currentY = 0;
    });
  }

  // Visibility form setting
  static showForm(showState) {
    this.clearAllTimeOut();

    if (showState) {
      // Tetapkan state, karena elemen form ini tidak bisa membuat dirinya sendiri mempunyai class hidden, atau istilah lain dia itu tidak mandiri
      this.elementActive = "form";

      DOM.containerFlexibleForm.style.transition = "all 0.5s ease-in-out";

      // Hapus class kaku sebelumnya. Class kaku disini maksudnya adalah class yang ketika diaplikasikan antara perpindahan state, tidak bisa diberikan animasi khusus yang halus
      document.documentElement.style.overflow = "hidden";
      DOM.blackOverlay.classList.remove("hidden");
      DOM.containerFlexibleForm.classList.remove("hidden");

      // Tetapkan class halus. Class halus adalah kebalikan dari class kaku, class halus lebih lunak dalam anggapan perpindahan antar state bisa diberikan animasi yang halus dan lembut
      this.timeOutIDS.push(
        setTimeout(() => {
          DOM.containerFlexibleForm.style.transform = "";
          DOM.blackOverlay.classList.add("visible", "opacity-100");
          DOM.containerFlexibleForm.classList.add("active-form");
        }, 10),
      );
    } else {
      if (this.elementActive == "form") {
        this.elementActive = null;

        // Sembunyikan class halus sebelum kita benar-benar menetapkan class kaku lagi
        DOM.blackOverlay.classList.remove("visible", "opacity-100");
        DOM.containerFlexibleForm.classList.remove("active-form");

        // Tetapkan class kaku yang telah kita hapus sebelumnya
        this.timeOutIDS.push(
          setTimeout(() => {
            document.documentElement.style.overflow = "auto";
            DOM.containerFlexibleForm.style.transform = "";
            DOM.blackOverlay.classList.add("hidden");
            DOM.containerFlexibleForm.classList.add("hidden");
          }, 500),
        );
      }
    }
  }

  // Show alert sudah diperbaiki ✅
  // Show alert digunakan untuk mengelola feedback setelah serangkaian proses yang dilakukan oleh pengguna, hal ini sekaligus mempercantik UI dan mempertegas UX yang ingin disampaikan kepada pengguna, serta meminimkan ambiguitas kepada user
  // Show alert kini sudah bisa membedakan kapan dia harus membangun black overlay elemennya sendiri ataupun menggunakan dependensi dari element lain, sudah mendukung fitur auto close dan manual close, pengelolaan setTimeout yang lebih rapi secara keterbacaan dan pengelolaan oleh sistem
  static showAlert({
    alertHTMLString,
    isAutoClose = true,
    readTime = 2000,
  } = {}) {
    // Static methode yang telah dibuat untuk membantu menghapus semua refrensi ke hasil eksekusi dari setTimeout yang telah selesai dijalankan sebelumnya
    this.clearAllTimeOut();

    // Untuk menangkap element alert yang active sebelumnya, agar bisa diaktifkan dan dinonaktifkan jika menggunakan isAutoClose dalam keadaan false
    let alertElement;

    // Waktu eksekusi timeout standar untuk alert custom saat ini
    // Waktu minimum transisi yang biasanya dibutuhkan oleh properti transition CSS
    const CSS_TRANSITION_TIME = 500;
    // Waktu minimum yang biasanya dibutuhkan untuk penghapusan class atau pembuatan sebuah element DOM oleh browser, akan kita jadikjan selisih antara perubahan state element, yang dimana elementnya biasanya berada pada fase sembunyi menuju tampil
    const BROWSER_LOAD_TIME = 50;

    // Lakukan checking terlebih dahulu pada element active saat ini, jika ada element active, maka set waktunya sesuai waktu transisi CSS
    const ELEMENT_LOAD_TIME =
      this.elementActive === null ? 0 : CSS_TRANSITION_TIME;

    // Selisih waktu yang diberikan antara load element awal, sebelum diberikan class transisi lanjutan
    const ELEMENT_SHOW_TIME = ELEMENT_LOAD_TIME + BROWSER_LOAD_TIME;

    // Selang waktu yang diberikan pada element untuk ditampilkan ke layar sebelum class transisinya dihapus atau diset ke defaultnya
    const ELEMENT_HIDE_TIME = ELEMENT_LOAD_TIME + readTime;

    // Selang waktu yang diberikan untuk menghapus element secara total ataupun menambahkan class kaku seperti hidden dan sejenisnya kepada elemen DOM yang dipilih
    const ELEMENT_DESTROY_TIME = ELEMENT_HIDE_TIME + BROWSER_LOAD_TIME;

    // Pengecekan black overlay
    // Untuk memastikan apakah element alert saat ini menggunakan dependensi blackoverlay dari elemen sebelumnya atau dia membangkitkan elemen black overlay secara manual

    // !! Element active disini adalah, element yang memberikan dependensi blackoverlay aktif kepada alert, jadi alert tidak perlu membangkitkan elemen black overlay secara manual, dan ini sekaligus menghilangkan transisi kedap-kedip yang mengganggu ketika black overlay diaktifkan dan kemudian dinonaktifkan
    // Jika element yang active adalah element form
    if (this.elementActive === "form") {
      // Kita hapus class halus
      DOM.containerFlexibleForm.classList.remove("active-form");

      // Selang waktu beberapa detik, kita tambahkan class kaku, dan set default value dari properti element active
      this.timeOutIDS.push(
        setTimeout(() => {
          DOM.containerFlexibleForm.classList.add("hidden");
          this.elementActive = null;
        }, ELEMENT_LOAD_TIME),
      );
    }

    // Jika element yang active
    else if (this.elementActive === "confirmation") {
      // Kurang lebihnya alurnya akan sama seperti pada form, cuman beda dicara penangkapan elementnya, karena pada confirmation sendiri kita akan menggunakan static class baru yang sekaligus akan berhubungan dengan alert ketika dia mode independen
    }

    // Anggapan jika element active kali ini adalah null atau kosong
    // Artinya alert perlu membangun black overlay secara mandiri, karena tidak disupport oleh elemen manapun
    // Seleksi ditambahkan, agar ketika element active dan modal active benar-benar null saja yang bisa melakukan aksi ini, guna menghindari pembangunan ulang black overlay untuk elemen alert yang non auto close
    else if (this.elementActive === null && this.modalActive === null) {
      document.documentElement.style.overflow = "hidden";
      DOM.blackOverlay.classList.remove("hidden");

      // Tetap berikan jedakan transisi ketika element black overlay berpindah dari class kaku ke class halus
      this.timeOutIDS.push(
        setTimeout(() => {
          DOM.blackOverlay.classList.add("visible", "opacity-100");
        }, ELEMENT_LOAD_TIME),
      );
    }

    // Fase creation conditonal
    // Fase creation disini sekarang dibagi menjadi dua, ini digunakan untuk mendukung keberlangsungan auto close ataupun manual close nantinya yang akan kita tambahkan pada alert ini

    // Ini dia static properti yang baru yang akan digunakan untuk melacak apakah ada modal yang sedang aktif
    // Jika modal null maka kita harus buat ulang element alert dari awal
    if (this.modalActive === null) {
      // Fase creation yang sama persis seperti sebelumnya
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = alertHTMLString.trim();
      alertElement = tempDiv.firstElementChild;
      DOM.blackOverlay.appendChild(alertElement);

      // Fallback jika elemen alert belum mempunyai hardcoded id bawaan, kita berikan dia sebuah id unique
      if (!alertElement.id) {
        alertElement.id = `alert-${Date.now()}`;
      }

      // Sekarag kita akan ambil id dari alert element untuk disimpan ke static properti yang sudah kita buat tadi
      this.modalActive = alertElement.id;

      // Kemudian jalankan animasi kedatangan dari alertnya
      this.timeOutIDS.push(
        setTimeout(() => {
          alertElement.classList.remove("hidden");
        }, ELEMENT_LOAD_TIME),
      );

      this.timeOutIDS.push(
        setTimeout(() => {
          alertElement.classList.add("active-modal");
        }, ELEMENT_SHOW_TIME),
      );
    }

    // Jika modal tersedia, kita ambil id yang sudah tertanam dan kita set alert element menjadi hasil seleksi DOM berdasarkan id tersebut
    else {
      alertElement = document.getElementById(`${this.modalActive}`);

      // Kita tidak perlu menjalankan animasi dari alert lagi, karena sekarang alert sudah terbuka dan sedang tampil di layar pengguna
    }

    // Animasi yang akan diberikan ketika autoclose berniali true, defaultnya tidak auto close
    if (isAutoClose) {
      this.timeOutIDS.push(
        // Hapus class halus pada element alert dan black overlay terlebih dahulu supaya animasi yang tampil dilayar mulus
        setTimeout(() => {
          alertElement.classList.remove("active-modal");
          DOM.blackOverlay.classList.remove("visible", "opacity-100");

          // Setelah selang waktu tertentu, tetapkan semua class dan style kaku
          // Hapus element alert karena dia hanya bersifat sementara, agar tidak merusaka element permanent seperti form nantinya
        }, ELEMENT_HIDE_TIME),
      );

      this.timeOutIDS.push(
        setTimeout(() => {
          document.documentElement.style.overflow = "auto";
          DOM.blackOverlay.classList.add("hidden");
          alertElement.remove();

          // Set kembali static properti sebelumnya, agar tidak mengganggu iterasi berikutnya
          this.modalActive = null;
        }, ELEMENT_DESTROY_TIME),
      );
    }
  }

  // Show confirmation
  static showConfirmation(confirmationHTMLString) {
    // pastikan tidak ada elemen yang tampil didalam blackoverlay
    if (
      this.elementActive === "confirmation" ||
      DOM.blackOverlay.querySelector(".active-modal")
    ) {
      // Tolak mentah-mentah eksekusi klik kedua dengan mengembalikan Promise bernilai 'false' (dianggap batal)
      return Promise.resolve(false);
    }

    this.elementActive = "confirmation";

    this.clearAllTimeOut();

    // Load class kasar
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = confirmationHTMLString.trim();
    const confirmationElement = tempDiv.firstChild;
    DOM.blackOverlay.appendChild(confirmationElement);

    DOM.blackOverlay.classList.remove("hidden");
    confirmationElement.classList.remove("hidden");
    document.documentElement.style.overflow = "hidden";

    // Load class halus
    this.timeOutIDS.push(
      setTimeout(() => {
        DOM.blackOverlay.classList.add("visible", "opacity-100");
        confirmationElement.classList.add("active-modal");
      }, 50),
    );

    return new Promise((resolve) => {
      this.confirmationResolver = resolve;

      const clickOutSide = (event) => {
        if (event.target == DOM.blackOverlay) {
          cleanListener();
          this.closeConfirmation(false, true);
        }
      };

      const clickOptions = (event) => {
        const option = event.target.closest("[data-option]");
        if (!option) return;
        cleanListener();

        const choice = option.getAttribute("data-option");
        if (choice === "true") {
          this.confirmationResolver(true);
        } else {
          this.closeConfirmation(false, true);
        }
      };

      const cleanListener = () => {
        DOM.blackOverlay.removeEventListener("click", clickOutSide);
        confirmationElement.removeEventListener("click", clickOptions);
      };

      DOM.blackOverlay.addEventListener("click", clickOutSide);
      confirmationElement.addEventListener("click", clickOptions);
    });
  }

  static closeConfirmation(resolveStatus, withOverlay = false) {
    const currentConfirmation = document.querySelector(".active-modal");

    if (withOverlay) {
      DOM.blackOverlay.classList.remove("visible", "opacity-100");
    }

    currentConfirmation.classList.remove("active-modal");

    this.timeOutIDS.push(
      setTimeout(() => {
        if (withOverlay) {
          document.documentElement.style.overflow = "auto";
          DOM.blackOverlay.classList.add("hidden");
        }
        currentConfirmation.classList.add("hidden");
        currentConfirmation.remove();

        this.elementActive = null;
      }, 550),
    );

    if (this.confirmationResolver !== null) {
      this.confirmationResolver(resolveStatus);

      this.confirmationResolver = null;
    }
  }

  // Show message final ✅
  // Show message digunakan untuk menampilkan kesalahan input berdasarkan nilai yang diberikan pada user ke input tertentu, tujuannya hampir sama dengan alert untuk memberikan kejelasan pada pengguna agar bisa memasukan input yang tepat serta meningkatkan UX
  static showErrorMessage(errors) {
    // Reinsialisation the content of the object
    // Memastikan text yang ada pada element yang menerima error sebelumnya dihapus, agar tidak ada penampilan pesan error yang janggal
    DOM.errorsElement.forEach((element) => (element.innerHTML = ""));

    //Set content error
    for (const key in errors) {
      const errorElement = document.getElementById(`error-${key}`);
      const errorMessage = errors[key];

      if (errorMessage) {
        // Menggunakan reusable icon yang classnya sekarang bisa di custom
        errorElement.innerHTML = `${ErrorIcon("size-4")} ${errorMessage}`;
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
