import CardSchedule from "../components/CardSchedule.js";
import EmptyState from "../components/EmptyState.js";
import ErrorIcon from "../components/Icons/ErrorIcon.js";

export const DOM = {
  // Outer elemen atau element yang ada diluar blackoverlay dan akan selalu ada di tampilan layar kapan pun
  triggerFormCreate: document.getElementById("btn-create-form-trigger"),
  triggerSort: document.getElementById("btn-sort-form-trigger"),
  remainderTime: document.getElementById("reminder-time"),
  containerSchedule: document.getElementById("container-schedule"),

  // Inner element atau element yang berada didalam black overlay yang hanya aktif dikala tertentu saja
  blackOverlay: document.getElementById("black-overlay"),
  containerFlexibleForm: document.getElementById("container-form-flexible"),
  flexibleForm: document.getElementById("form-manipulation-flexible"),
  errorsElement: document.querySelectorAll(".error"),
};

export default class ScheduleView {
  // Pemisahan static properti sudah dilakukan berdasarkan kecepatan value didapatkan selama proses eksekusi ✅
  // !! Tipe #1 -- Properti yang sudah diberi nilai fixed bahkan sebelum eksekusi.
  // Static properti ini disebut static const propery (dinamain oleh diri sendiri 😹), yang artinya static properti ini sudah diberi nilai yang tidak pernah berganti bahkan sebelum dieksekusi, dan frekuensi digantinya paling kecil.

  // Properti ini digunakan untuk mentapkan timeline eksekusi dari setTimeout, karena rata-rata penggunaan setTimeOut kita berkaitan dengan manipulasi style dom. Satuan waktu yang digunakan yang menjadi value dari properti ini adalah milidetik. 🚨
  // Properti yang digunakan untuk membuat set waktu yang sesuai dengan durasi transisi yang kita berikan di file CSS
  static CSS_TRANSISTION_DURATION = 500;
  // Properti yang digunakan untuk membuat set waktu yang sesuai dengan durasi browser membuat element dalam fase creation
  static BROWSER_LOAD_ELEMENT_DURATION = 50;

  // !! Tipe #2 -- Ini masih abu-abu, karena urutan ini dibuat karena function ini menggunakan property dari Window object yang sudah ada pada saat proses eksekusi, kalau tidak dia akan memiliki kedudukan yang sama dengan static property dibawah.

  // Properti yang digunakan untuk handle swipe, untuk memastikan bahwa handle swipe listener hanya berjalan di saat ukuran layar sesuai dengan ukuran layar pada perangkat mobile. 📲
  static isMobile = () => window.innerWidth < 768;

  // !! Tipe #3 -- Ini adalah tipe property biasa, bisa dibilang mirip dengan let, nilainya memang ga nentu dan baru di assign kalau udah masuk proses didalam block function yang kita bikin.

  // Properti yang digunakan untuk mengatur keberlangsungan hidup modal didalam layar pengguna 🤖
  // Properti yang digunakan untuk menampung status aktif atau tidaknya elemen berdasarkan nama yang masuk kedalam properti ini
  static elementActive = null;
  // Properti yang digunakan untuk modal yang dimana modal itu memiliki masa aktif tak terbatas dan hanya bisa dihilangkan jika pengguna sudah memiliki opsi, biasanya dibantu dengan promise. Jika nantinya kita perlu resolve dari promise tersebut dimanipulasi oleh function luarnya seperti function close, ktta bisa menggunakan metode penangkapan seperti ini.
  static confirmationResolver = null;

  // Kelompok properti kedua yang digunakan untuk mengelola setTimeout selain properti utama yang berkaitan dengan timeline waktu setTimeout tadi.
  // Properti yang digunakan untuk menampung seluruh id dari setTimeout yang pernah dieksekusi atau istilah kerennya kalau kata ku "Timeout base" 😹😹
  static timeOutIDS = [];
  // Properti yang digunakan untuk menghapus semua id setTimeout yang ada didalam properti sebelumnya, ibaratnya mesin pembersih rumah yang akan melahap semua barang yang memang sudah tidak terpakai yaitu: setTimeout.
  // Secara teknis, function ini kita gunakan untuk menghapus refrensi setTimeout yang sudah selesai dieksekusi agar bisa dihapus oleh engine
  static clearAllTimeOut = function () {
    if (this.timeOutIDS.length > 0) {
      this.timeOutIDS.forEach((id) => {
        clearTimeout(id);
      });

      this.timeOutIDS = [];
    }
  };

  // !! Lingkup function UI yang hanya bisa digunakan jika ada terusan data dari controller.
  // Update UI kini sudah diperbaik ✅
  // Function update UI kini lebih ringkas, dan tanpa logika filtering tambahan seperti sebelumnya.
  // Kekurangan yang masih aku rasakan saat membuat function ini adalah, monolitic rendering, yang dimana semua rendering dihold oleh function ini, bahkan data yang tidak perlu di load ulang setiap saat akan di load ulang ketika kita memanggil function monolitic rendering ini, mungkin jika diperbaiki ini akan memakan banyak waktu, jadi akan dijadikan refleksi belajar untuk persiapan react nantinya.
  static updateUI({
    schedulesData,
    remindingTime,
    currentActiveTab = "All",
  } = {}) {
    // Data yang telah diambil di controller sekarang akan dipetakan secara langsung kedalam card, karena sebelumnya sudah difilter didalam controller berdasarkan tab yang sedang akitf saat ini.
    // Kemungkinan nanti kita akan memisahkan data yang sudah di filter dengan data yang masih utuh atau membuat pengirim waktu dengan total waktu yang sudah dipakai
    const htmlCards = schedulesData.map((data) => CardSchedule(data)).join("");
    console.log(htmlCards);

    // Seleksi element tab yang sedang aktif sekarang berdasarkan state tab yang dikirim dari controller
    const currentTabElement = document.querySelector(
      `[data-tabs-option="${currentActiveTab}"]`,
    );

    DOM.remainderTime.textContent = `${remindingTime} Minutes`;

    // Kini function tracking tabs dipanggil juga disini untuk membuat insialisasi pertama agar tab pertama otomatis merujuk ke tab all
    this.trackingTabs(currentTabElement);

    DOM.containerSchedule.innerHTML = htmlCards || EmptyState();
  }

  // Function baru, tracking tabs 📲
  // Function tracking tabs, digunakan untuk memberikan state aktif dan default untuk element tabs, sekaligus memberikan indikator bahwa data dengan status tertentu sedang ditampilkan dilayar saat ini oleh js.
  static trackingTabs(tabElement) {
    const indicatorElement = document.getElementById("indicator-bar");

    // Kita pastikan setiap kali masuk kedalam function ini, kita refresh terlebih dahulu class penanda aktif pada tulisan tab agar semua tab netral, lalu kita mencari tab yang sesuai dengan tab aktif yang sudah kita seleksi dan diletakan di parameter oleh pemanggil function
    document.querySelectorAll(`[role="tab"]`).forEach((element) => {
      // Hapus class indikator agar netral
      element.setAttribute("aria-selected", false);
      element.classList.remove("text-slate-200");

      // Tambahkan class yang sudah dihapus dari semua elemen tadi, namun kali ini kita pastikan yang diberikan class adalah tab yang sudah kita seleksi sebagai tab active
      if (element === tabElement) {
        element.setAttribute("aria-selected", true);
        element.classList.add("text-slate-200");
      }
    });

    // Kita buat exception ketika tab element tidak ada, atau bisa juga digunakan untuk proses insialiasi awal yang secara otomatis menunjukan bahwa tab yang aktif akan selalu tab all
    if (!tabElement) {
      const exceptionElement = document.querySelector(
        `[data-tabs-option="All"]`,
      );

      indicatorElement.style.width = `${exceptionElement.offsetWidth}px`;
      indicatorElement.style.left = `${exceptionElement.offsetLeft}px`;
    }

    // Jika element tab tersedia, kita pastikan indikator slide sesuai dengan jarak dan memiliki ukuran yang sama denga tab active yang dipilih oleh pengguna saat ini
    else {
      indicatorElement.style.width = `${tabElement.offsetWidth}px`;
      indicatorElement.style.left = `${tabElement.offsetLeft}px`;
    }
  }

  // Function untuk menampapilkan form create dan pengelolaan value input ✅
  // Function ini digunakan untuk memastikan bahwa value dari form sebelumnya ketika mengakses form create tidak terbawa pada saat melakukan proses create data. hal ini sangat berguna agar data yang dikirim bisa tetap fokus ke tujuan akhirnya, misalnya create tujuan akhirnya membuat data schedule, sementara edit tujuan akhirnya memperbarui data schedule.
  static showCreateForm(element) {
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

  // !! Lingkup function UI yang hanya fokus kedalam pengelolaan smart animate agar bisa memberikan kesan UI dan UX yang mulus
  // Init event dari swipe bar untuk device mobile sudah diperbarui untuk bisa handle beragam elemen yang memiliki swipe bar nantinya ✅
  // Function ini berfungsi untuk membuat delegation event yang berkaitan dengan swipe, ya walaupun swipe event tidak benar-benar ada di JS, maka dari itu kita mereplikanya dengan menggabungkan 3 jenis event dari touch screen atau event yang dipengaruhi jika jari pengguna menekan layar. Ini berbeda dengan mouse event ya.
  static initSwipeBarMobile() {
    // Penampung elemen, dibuat fleksibel agar bisa diganti sesuai dengan element yang aktif saat ini
    let currentElement;

    // Dipindahkan dari awalnya merupakan properti static yang bisa diakses oleh semua function didalam class ini, sekarang hanya bisa diakses oleh function init swiper ini saja.
    let startY = 0;
    let currentY = 0;

    // !! Event listener #1
    // Proses insialisasi posisi awal saat pertama kali jari menyentuh layar handphone
    DOM.blackOverlay.addEventListener("touchstart", (event) => {
      // Mencari handle bar yang aktif saat ini
      const handleBar = event.target.closest(".handle-bar");

      // Pastikan element handle bar ada dan ukuran layar sekarang sudah sesuai dengan ukuran layar perangkat mobile
      if (!handleBar || !this.isMobile()) return;

      // Kita ambil posisi sentuhan jari pertama di layar, lalu kita jadikan sebagai posisi awal
      this.startY = event.touches[0].clientY;

      // Kita cek element yang mmenggunakan handle bar mana yang sedang aktif saat ini
      switch (this.elementActive) {
        case "form":
          currentElement = DOM.containerFlexibleForm;
          break;
        case "confirmation":
          currentElement = document.querySelector(".modal-primary");
          break;
      }

      // Matikan transisi dari element yang sudah didapatkan. Kenapa? Agar pada saat listener kedua nanti menjalankan prosesnya, interaksi tidak terhalang oleh delay transition yang sudah kita atur sebelumnya didalam file CSS atau inline CSS di file HTML ataupun JS component kita.
      currentElement.style.transition = "none";
    });

    // !! Event listener #2
    // Proses perpindahan elemen dari titik awal pada event pertama tadi menuju titik akhir pada event ketiga
    DOM.blackOverlay.addEventListener("touchmove", (event) => {
      const handleBar = event.target.closest(".handle-bar");
      if (!handleBar || !this.isMobile()) return;

      // Mengambil koordinat sentuhan baru, yang kemudian akan digunakan untuk membandingkan jarak
      const touchY = event.touches[0].clientY;
      // Membandingkan koordinat senuhan saat ini dan koordinat sentuhan pertama di event sebelumnya
      this.currentY = touchY - this.startY;

      // Jika jarak sentuhan sekarang lebih besar dari pada nol atau elemen masih bisa dilihat oleh mata pengguna
      if (this.currentY > 0) {
        // Kita rubah properti css yang ada di element ini agar mencipatkan efek slide yang realtime
        // Nantinya akan diberikan batas tertentu agar swipe tidak melebihi batas
        currentElement.style.setProperty("--drag-axisY", `${this.currentY}px`);

        // Melakukan operasi matematika untuk mencari nilai opacity berdasarkan koordinat sekarang
        // Cara kerjanya adalah, 400 sebagai angka batas scroll, kemudian koordinat akan dibagi oleh angka 400 tadi. Hasilnya akan menjadi sebuah pecahaan yang nilainya adalah nilai desimal dari 0 -1
        // Kemudian agar menjaga nilai tidak negatif jika hasil pembagian tadi lebih kecil daripada 1 (karena akan menyebabkan mines), kita membandingkan angka terbesar menggunakan methode max dari object Math. Cara kerjanya kita membandingkan 2 angka yang paling besar, antara angka operasi matematika tadi dengan angka 0 disana
        const opacity = 1 - this.currentY / 400;
        currentElement.style.setProperty(
          "--drag-opacity",
          Math.max(opacity, 0),
        );
      }
    });

    // !! Event listener #3
    // Event final ketika touch sudah dilepas oleh pengguna dan mencapai titik akhir
    DOM.blackOverlay.addEventListener("touchend", (event) => {
      const handleBar = event.target.closest(".handle-bar");
      if (!handleBar || !this.isMobile()) return;

      // Berikan animasi swipe agar swipe lebih halus
      currentElement.style.transition = "all 500ms ease-in-out";

      // Cek apakah koordinat sekarang lebih kecil dari 150, artinya elemen di swipe ke bawah untuk ditutup
      if (this.currentY > 150) {
        // Kita cek kembali element yang sedang aktif agar bisa mengeksekusi close functionnya sesuai jenis elementnya
        switch (this.elementActive) {
          case "form":
            this.showForm(false);
            break;
          case "confirmation":
            this.closeConfirmation({ resolveValue: false, withOverlay: true });
            break;
        }
      }

      // Jika tidak dibawah ambang batas swipe, kita kembalikan nilai variable seperti semula atau netralnya
      currentElement.style.setProperty("--drag-axisY", "0px");
      currentElement.style.setProperty("--drag-opacity", "1");

      // Seperti biasa, kita harus selalu mereset properti ataupun variable agar bisa digunakan kembali dengan bersih di iterasi berikutnya
      this.startY = 0;
      this.currentY = 0;
    });
  }

  // Show form function sudah diperbaiki ✅
  // Show form digunakan untuk membuat element form terlihat dan tersembunyi dari layar pengguna saat ini. Ini memuberikan pengguna kemudahan untuk memahami jika interaksi form terjadi kita hanya perlu fokus padanya, mengapa demikian, karena pengaktifan form otomatis mengaktifkan atau aku lebih suka menyebutnya sebagai membangkitkan black overlay elemen yang akan memblokir semua aksi yang ada dibawahnya dan bahkan scroll layar, agar pengguna bisa fokus pada interaksi form
  // Show form tidak disertai dengan function close form, karena show form adalah function yang memanipulasi sebuah form independen bukan form disposable (sekali pakai), jadi form sangat mudah dilacak dan dimanipulasi untuk ditampilkan atau untuk disembunyikan
  static showForm(showState = false) {
    // Memastikan form hanya bisa ditampilkan atau bisa ditutup berdasarkan kondisi-kondisi berikut, ini merupakan tahap guard UI debouncing kalau kata ku hehehe 😹😹😹
    if (showState === true) {
      if (this.elementActive !== null) return;
    } else {
      if (this.elementActive !== "form") return;
    }

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
        }, this.BROWSER_LOAD_ELEMENT_DURATION),
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
          }, this.CSS_TRANSISTION_DURATION),
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
    elementWillShown = null,
  } = {}) {
    // Penambahan guard Ui. Guard UI disini berfungsi untuk memastikan bahwa elemen alert tidak dibuat lebih dari satu kali. Hal ini untuk mencegah elemen alert yang berganda, karena pada dasarnya kita hanya butuh 1 alert diakhir setiap proses yang kita perlukan
    if (
      this.elementActive === "alert" &&
      document.querySelector(".modal-primary")
    )
      return;

    // Static methode yang telah dibuat untuk membantu menghapus semua refrensi ke hasil eksekusi dari setTimeout yang telah selesai dijalankan sebelumnya
    this.clearAllTimeOut();
    // Untuk melakukan pengecekan waktu lebih spesifik lagi, karena kita menggunakan 2 type alert, yang dimana dia bisa independent atau beridiri sendiri, dan bisa juga berdiri dengan bantuan dari elemen lain melalui black overlay
    let isIndependentAlert = false;

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
        }, this.CSS_TRANSISTION_DURATION),
      );
    }

    // Jika element yang active adalah element confirmation
    else if (this.elementActive === "confirmation") {
      document.querySelector(".modal-primary").classList.remove("active-modal");

      // Selang waktu beberapa detik, kita tambahkan class kaku, dan set default value dari properti element active
      this.timeOutIDS.push(
        setTimeout(() => {
          DOM.containerFlexibleForm.classList.add("hidden");
          this.elementActive = null;
        }, this.CSS_TRANSISTION_DURATION),
      );
    }

    // Anggapan jika element active kali ini adalah null atau kosong
    // Artinya alert perlu membangun black overlay secara mandiri, karena tidak disupport oleh elemen manapun
    // Seleksi ditambahkan, agar ketika element active dan modal active benar-benar null saja yang bisa melakukan aksi ini, guna menghindari pembangunan ulang black overlay untuk elemen alert yang non auto close
    else if (this.elementActive === null && this.modalActive === null) {
      document.documentElement.style.overflow = "hidden";
      DOM.blackOverlay.classList.remove("hidden");

      // Jika alert berdiri sendiri kita set independent statenya menjadi true agar bisa digunakan untuk mengatur waktu di setTimeout lebih spesifik lagi dan tidak saling berbenturan dengan un independent alert
      isIndependentAlert = true;

      // Tetap berikan jedakan transisi ketika element black overlay berpindah dari class kaku ke class halus
      this.timeOutIDS.push(
        setTimeout(() => {
          DOM.blackOverlay.classList.add("visible", "opacity-100");
        }, this.BROWSER_LOAD_ELEMENT_DURATION),
      );
    }

    // Fase creation
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = alertHTMLString.trim();
    const alertElement = tempDiv.firstElementChild;

    // Sebelumnya ide ini aku tolak, karena pemikiran ku tidak nyampe untuk menjadikan properti ini sebagai guard ☺️☺️
    // Sekarang kita wajib set element active ini sesuai dengan element yang ingin kita muneuclkan atau manipulasi nantinya agar kita bisa membuat guard untuk menghindari masalah seperti double creation, debouncing (menastikan satu interaksi terselesaikan dahulu sebelum interaksi lainnya dijalankan atau dieksekusi), dan lainnya.
    this.elementActive = "alert";
    DOM.blackOverlay.appendChild(alertElement);

    // Kemudian jalankan animasi kedatangan dari alertnya
    this.timeOutIDS.push(
      setTimeout(
        () => {
          alertElement.classList.remove("hidden");
        },

        // Penggunaan variable state independent tadi, agar kita bisa memberikan waktu tunggu yang sesuai dengan bagaimana type alert yang kita ingin tampilkan kepada pengguna
        isIndependentAlert ? 0 : this.CSS_TRANSISTION_DURATION,
      ),
    );

    this.timeOutIDS.push(
      setTimeout(() => {
        alertElement.classList.add("active-modal");
      }, this.BROWSER_LOAD_ELEMENT_DURATION),
    );

    // Animasi yang akan diberikan ketika autoclose bernilai true, defaultnya tidak auto close
    if (isAutoClose) {
      this.timeOutIDS.push(
        // Hapus class halus pada element alert dan black overlay terlebih dahulu supaya animasi yang tampil dilayar mulus
        setTimeout(() => {
          alertElement.classList.remove("active-modal");
          DOM.blackOverlay.classList.remove("visible", "opacity-100");
        }, readTime + this.CSS_TRANSISTION_DURATION),
      );

      // Setelah class halus dihapus barulah kita tambahkan class, style, dan beberapa fungsionalitas yang kasar dan tidak bisa diberikan transisi yang halus seperti pada class sebelumnya
      this.timeOutIDS.push(
        setTimeout(
          () => {
            document.documentElement.style.overflow = "auto";
            DOM.blackOverlay.classList.add("hidden");
            alertElement.remove();

            // Biasakan set kembali state ke default valuenya setelah digunakan, agar bisa digunakan kembali hehe..
            this.elementActive = null;
          },
          readTime + this.CSS_TRANSISTION_DURATION * 2,
        ),
      );
    } else {
      // Jika mode auto close tidak dinyalakan, maka alert akan otomatis memiliki button yang akan memiliki listener seperti yang telah dibuat dibawah ini. Fungsi listener ini adalah, untuk mengetahui bagaimana cara kita menutup alert yang telah kita buat. Apakah kita perlu menutupnya secara permanen dengan black overlay? Atau kita perlu menutup alertnya saja dan kemudian memunculkan elemen lainnya setelah itu, tanpa mengorbankan black overlaynya?
      alertElement.addEventListener("click", (event) => {
        // Event bubbling yang digunakan untuk mencari button close pada alert
        if (event.target.closest(".alert-show-off")) {
          // Jika kita memerlukan kemunculan element baru setelah alert dihilangkan, maka kita bisa mengirim sinyal seperti ini kepada function close alert serta mengirim jenis elemen apa yang ingin dimunculkan kembali
          if (elementWillShown) {
            this.closeALert({
              nextElement: elementWillShown,
              withOverlay: false,
            });
          }

          // Jika kita hanya ingin menutup alert tanpa tambahan element lainnya setelah itu
          else {
            this.closeALert({ nextElement: null, withOverlay: true });
          }
        }
      });
    }
  }

  // Close alert, function baru 📲
  // Function ini digunakan untuk handle bagaimana cara alert perlu di tutup, apakah kita perlu menutup seluruh alert dan black overlay secara total atau kita sisakan black overlay setelah penutupan alert dan kemudian akan menampilkan elemen baru lagi?
  static closeALert({ nextElement = null, withOverlay = true } = {}) {
    // Kita ambil element alert yang sedang aktif saat ini dilayar
    const currentAlert = document.querySelector(".modal-primary");

    // Jika element alert tidak ada kita hentikan proses agar proses dibawah tidak berjalan
    if (!currentAlert) return;

    // Lingkup untuk menutup atau menyembunyikan alert kita
    currentAlert.classList.remove("active-modal");

    this.timeOutIDS.push(
      setTimeout(() => {
        currentAlert.remove();
      }, this.CSS_TRANSISTION_DURATION),
    );

    // Lingkup kondisi apakah black overlay perlu di tutup juga dalam proeses penutupan alert ini
    // Jika kita ingin menutup element alert secara penuh termasuk dengan blackoverlaynya juga
    if (withOverlay) {
      DOM.blackOverlay.classList.remove("visible", "opacity-100");

      this.timeOutIDS.push(
        setTimeout(() => {
          document.documentElement.style.overflow = "auto";
          DOM.blackOverlay.classList.add("hidden");

          this.elementActive = null;
        }, this.CSS_TRANSISTION_DURATION),
      );
    }

    // Jika kita ingin menutup alert, namun setelah itu tidak menutup black overlaynya dan kemudian memunculkan element baru untuk iterasi selanjutnya berdasarkan kondisi parameter next element yang diberikan
    else {
      // Jika kita ingin memunculkan elemen form
      if (nextElement === "form") {
        this.timeOutIDS.push(
          setTimeout(() => {
            DOM.containerFlexibleForm.classList.remove("hidden");
            this.elementActive = "form";
          }, this.CSS_TRANSISTION_DURATION),
        );

        this.timeOutIDS.push(
          setTimeout(() => {
            DOM.containerFlexibleForm.classList.add("active-form");
          }, this.BROWSER_LOAD_ELEMENT_DURATION + this.CSS_TRANSISTION_DURATION),
        );
      }

      // Elemen lainya akan didefinisikan lebih lanjut jika memang diperlukan untuk pengembangan berikutnya 👉
    }
  }

  // Show confirmation sudah diperbaiki ✅
  // Penggunaan guard UI pertama kali di function ini. Guard UI digunakan untuk memberikan pencegahan agar function yang notabanenya adalah sebuah factory UI function yang menghasilkan UI tidak menghasilkan UI dari jumlah yang telah ditentukan dalam kerangka kerja
  // Penerusan state local menjadi state global yang mudah dikelola dan mudah dimanipulasi oleh function lainnya, contohnya saat pengaplikasian close confirmation untuk menutup confirmation element yang dihasilkan oleh element ini.
  static showConfirmation(confirmationHTMLString) {
    // Guard mulltiple creation element
    // Jika element aktif masih ditandai sebagai "confirmation" ataupun elemen confirmation belum dihapus dan masih ada dilayar, maka kita tidak izinkan function ini dieksekusi, lalu kita lempar inversi dari return yang diharapkan atau hal yang bisa membatalkan eksekusi function lebih dalam.
    // Kenapa harus diquery selector dengan class ".modal-primary"? Karena element di black overlay yang aktif hanyalah elemen dengan class tersebut saat confirmation aktif, alias hanya confirmation saja yang ada.
    if (
      this.elementActive === "confirmation" ||
      DOM.blackOverlay.querySelector(".modal-primary")
    ) {
      return Promise.resolve(false);
    }

    // Set elemen active saat ini, untuk mengaktifkan guard ui yang telah dipasang sebelumnya
    this.elementActive = "confirmation";

    // Bersihkan timeout yang sudah selesai dijalankan agar tidak membebani engine
    this.clearAllTimeOut();

    // fase creation untuk element confirmation
    // Kita buat penampungan div khusus untuk element confirmation nantinya
    const tempDiv = document.createElement("div");
    // Kemudian kita saring string yang berasal dari param yang berisi string html, agar spasi yang tidak dibutuhkan tidak ikut masuk, dan kita tambahkan string yang sudah bersih kedalam element div yang telah dibuat sebagai child element dari div tersebut.
    tempDiv.innerHTML = confirmationHTMLString.trim();
    // Kemudian  kita ambil child element pertama dari div yang sudah kita buat tadi, yang akan merujuk ke element confirmation
    const confirmationElement = tempDiv.firstChild;
    // Kita masukan confirmation element tadi kedalam elemen black overlay sebagai child element
    DOM.blackOverlay.appendChild(confirmationElement);

    // Penghapusan class dan style kaku dari element-element penyokong (documentElement, black overlay) dan confirmation elemnt itu sendiri
    DOM.blackOverlay.classList.remove("hidden");
    confirmationElement.classList.remove("hidden");
    document.documentElement.style.overflow = "hidden";

    // Pasang class halus  setelah fase creation selesai
    this.timeOutIDS.push(
      setTimeout(() => {
        DOM.blackOverlay.classList.add("visible", "opacity-100");
        confirmationElement.classList.add("active-modal");
      }, this.BROWSER_LOAD_ELEMENT_DURATION),
    );

    // Kembalikan sebuah promise agar confirmation bisa bertahan lama di layar sampai pengguna memilih salah satu opsi diantara "ya" atau "tidak" nantinya
    return new Promise((resolve) => {
      // Kita teruskan resolve yang kita miliki di promise saat ini agar bisa dimanipulasi lebih lanjut oleh function close confirmation, karena kalau kita manipulasi dari luar tapi cara penutup confirmation mengharuskan kita mengembalikan resolve promise dari dalam itu akan sangat susah. Ibaratnya mendapatkan jerami yang dijatuhkan di tumpukan jarum.
      // Penggunaan static properti nantinya akan digunakan seperti function untuk insialisasi nilainya, karena dia terinject oleh resolve yang memang adalah function
      this.confirmationResolver = resolve;

      // Membuat function delegation sementara pada black overlay untuk handle elemen yang diklik disaat confirmation element ini aktif
      const clickHandler = (event) => {
        // Menentuk elemen DOM yang perlu diklik untuk aksi selanjutnya
        // Disini kita hanya menargetkan dua elemen, yaitu elemen option yang diseleksi dengan atribut data option, dan elemen overlay yang menjadi pembungkus confirmation sekaligus menjadi event click outside ketika pengguna mengklik diluar modal utama
        const clickOption = event.target.closest("[data-option]");
        const clickOutside = event.target === DOM.blackOverlay;

        // Kita pastikan proses dibawah tidak dieksekusi sebelum benar-benar mendapatkan elemen yang dituju sekaligus tidak menghapus listener yang telah ditanamkan pada blackoverlay
        if (!clickOption && !clickOutside) return;

        // Kondisi ketika kita menekan black overlay elemen atau click outside yang sudah kita bahas tadi
        if (clickOutside) {
          this.closeConfirmation({ resolveStatus: false, withOverlay: true });
        }

        // Kondisi ketika kita menekan elemen option, dan kemudian kita ambil value rahasia yang disimpan oleh masing-masing option agar bisa meneruskan resolve yang benar kedalam function selanjutnya
        if (clickOption) {
          const userChoice = clickOption.getAttribute("data-option");

          // Ketika pilihan true atau artinya setuju untuk melakukan aksi saat ini yang dipilih
          if (userChoice === "true") {
            this.closeConfirmation({ resolveStatus: true, withOverlay: false });
          }

          // Ketika pilihan true atau artinya setuju untuk melakukan aksi saat ini yang dipilih
          else {
            this.closeConfirmation({ resolveStatus: false, withOverlay: true });
          }
        }

        //  Catatan penting, bahwa clear listener hanya boleh diberikan ketika nilai yang kita perlukan sudah didapatka, karena proses sudah tidak diblokir oleh kondisi pertama itu artinya nilai berhasil didapatkan dan kita tinggal menghapus listener yang sudah kita buat didalam elemen black overlay agar tidak memperberat kinerja sistem yang kita buat
        DOM.blackOverlay.removeEventListener("click", clickHandler);
      };

      // Jangan khwatir, jika function handler mengembalikan return seperti kondisi pertama tadi, dia tidak akan menghapus listener dibawah ini, karena penghapusan listener hanya terjadi jika nilai yang dibutuhkan sudah didapatkan
      DOM.blackOverlay.addEventListener("click", clickHandler);
    });
  }

  // Close confirmation, function baru 📲
  // Dipisah karena selain merupakan disposable elemen (elemen sekali pakai) function show confirmation juga mewajibkan mengembalikan sebuah resolve yang sulit dikelola secara internal function, maka dari itu lahir lah function close confirmation dan static properti untuk mengatur state dari resolve secara global
  static closeConfirmation({ resolveStatus, withOverlay = true } = {}) {
    // Kita seleksi elemen terlebih dahulu sebelum kita memberikan animasi penutup
    const currentConfirmation = document.querySelector(".modal-primary");

    // Jika elemen yang di seleksi tidak ada, maka kita batalkan eksekusi function ini
    if (!currentConfirmation) return;

    // Jika pemanggil tidak membutuhkan black overlay yang sudah diaktifkan oleh confirmation, kita tutup saja overlay tersebut
    if (withOverlay) {
      DOM.blackOverlay.classList.remove("visible", "opacity-100");
    }

    // Jika pemanggil membutuhkan black overlay yang sudah diaktifkan oleh confirmation, kita tidak perlu menutup black overlay tersebut, dan ketika modal berikutnya tampil, dia hanya perlu menampilkan dirinya saja.
    currentConfirmation.classList.remove("active-modal");

    // Kita pastikan setiap timeout yang kita miliki dimasukan kedalam array timeOutIDS supaya bisa dibersihkan secara massal nantinya oleh engine JS dan menghindari penumpukan timeout yang sudah selesai, karena biasanya settimeout yang sudah tidak terpakai akan berserakan dan mengendap didalam memory yang bisa menurukan performa website.
    this.timeOutIDS.push(
      setTimeout(() => {
        // Keberlanjutan dari kondisi withoverlay yang sudah kita bahas diatas sebelum block kondisi ini.
        if (withOverlay) {
          document.documentElement.style.overflow = "auto";
          DOM.blackOverlay.classList.add("hidden");
        }
        currentConfirmation.classList.add("hidden");
        currentConfirmation.remove();

        // Pastikan untuk mengosongkan status element aktif sekarang menjadi null, agar guard UI di elemen lain tidak terganggu dan tetap bisa berjalan lancar.
        this.elementActive = null;

        // Kita memastikan bahwa resolve hanya diberikan dan diset ulang ketika time out ini sudah selesai, agar proses penerpan class kaku dan penerapan resolve ke function delete tidak bentrok secara UI, karena function delete juga mengeluarkan alert berdasarkan resolve yang diteruskan dari function ini
        if (this.confirmationResolver !== null) {
          this.confirmationResolver(resolveStatus);

          this.confirmationResolver = null;
        }
      }, this.CSS_TRANSISTION_DURATION),
    );
  }

  // Show message selesai untuk sementara ✅
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

  // Fixed untuk sementara ✅
  // Akan diperbaiki lagi pada pengembangan fitur sort by setelah fitur CRUD ⚠️
  static initChoosenOption(selectionMethode, attributeName) {
    const options = document.querySelectorAll(".dropdown-option");

    if (!options) return;

    options.forEach((option) => {
      option.classList.remove("active-option");

      if (option.getAttribute(attributeName) === selectionMethode) {
        option.classList.add("active-option");
      }
    });
  }

  // Akan diperbaiki lagi pada pengembangan fitur sort by setelah fitur CRUD ⚠️
  // Ingat berikan bottom sheets mode pada cara pemilahan opsi jika sudah masuka kedalam perbaikan
  static showDropDown({
    showState = false,
    dropDownElement,
    dropDownAttributeSelection,
    currentMethodeSelected = "All",
  } = {}) {
    if (!dropDownElement) return;

    this.initChoosenOption(currentMethodeSelected, dropDownAttributeSelection);

    if (showState) {
      dropDownElement.classList.remove("hidden");

      this.timeOutIDS.push(
        setTimeout(() => {
          dropDownElement.classList.add("active-dropdown");
        }, this.BROWSER_LOAD_ELEMENT_DURATION),
      );
    } else {
      dropDownElement.classList.remove("active-dropdown");

      this.timeOutIDS.push(
        setTimeout(() => {
          dropDownElement.classList.add("hidden");
        }, this.CSS_TRANSISTION_DURATION),
      );
    }
  }

  // Update category dropdown
  // Akan diperbaiki lagi pada pengembangan fitur sort by setelah fitur CRUD ⚠️
  static updateCategoryDropdown(categories) {
    const categorySortOption = categories.map(
      (category) =>
        `<button data-sort-by-category="${category}" class="dropdown-option">
            <!-- Label option -->
            <span>
              ${category}  
            </span>

            <!-- Circle status -->
            <div class="cicle-status"></div>
        </button>`,
    );

    document.getElementById("dropdown-sort-category").innerHTML =
      categorySortOption.join("") || "";
  }

  // Function baru untuk handle delegation 📲
  // Function yang digunakan untuk mengelola event delegation yang hanya dikhususkan untuk view atau manipulasi styling murni tanpa data tambahan yang dimasukkan kedalam UI. Ini adalah bentuk dari concern separated.
  static initDelegationView() {
    // Menambahkan delegation di body element yang khusus untuk menangani perubahan yang berkait dengan design atau UI.
    // Disini kita sengaja menggunakan if dengan syntax dasarnya (disertai else if) untuk menangani banyak kemungkinan di delegation yang mungkin akan terjadi. !! Ini penting. agar memori hanya menjalankan block kondisi sampai block kondisi yang sesuai didapatkan, dan bukan secara satu persatu secara menyeluruh
    document.body.addEventListener("click", (event) => {
      // Ketika yang diklik merupakan button create ataupun anak dari button tersebut yang akan memicu event bubbling
      if (event.target.closest(`#${DOM.triggerFormCreate.id}`)) {
        this.showCreateForm();
      }

      // Ketika yang diklik adalah element black overlay dan harus 1 element yang cocok, tidak ada event bubbling disini
      else if (event.target === DOM.blackOverlay) {
        // Pastikan elemen yang sedang aktif saat black overlay ditekan adalah "form" untuk menutup form tersebut
        if (this.elementActive === "form") {
          this.showForm(false);
        }
      }
    });
  }
}
