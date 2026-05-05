// Menggunakan metode ES6 module, yang dimana kita mulai mengunakan server dari node JS untuk menangani CORS dari website kita
import Alert from "../components/Alert.js";
import Confirmation from "../components/Confirmation.js";
import Schedule from "../models/Schedule.js";
import ScheduleRequest from "../request/FormRequestValidation.js";
import { HelperUI } from "../utils/Helper.js";
import ScheduleView from "../views/ScheduleView.js";
import { DOM } from "../views/ScheduleView.js";
import { HelperData } from "../utils/Helper.js";

export default class ScheduleController {
  static sortByTime = "Newest";
  static sortByCategory = "All";
  static currentTab = "All";
  // Controller property
  // Penggunaan object utama yang berfungsi untuk menangani pengambilan dan penyimpanan data yang ada didalam local storage
  static ScheduleStorage = {
    key: "ScheduleStorage",
    getData() {
      const rawData = JSON.parse(localStorage.getItem(this.key)) || [];

      // Reyhdration to make new object with same data that saved in local storage
      return rawData.map((data) => {
        return new Schedule(data);
      });
    },
    setData(data = []) {
      localStorage.setItem(this.key, JSON.stringify(data));
    },
  };

  // Caluculation total time that used by schedule
  // Membuat calucaltion mengembalikan object yang berisi hasil operasi yang diperlukan untuk penghitungan sistem dan penghitungan di sisi UI yang akan ditampilkan kepada pengguna
  static calculationTime(data) {
    const currentDataStorage = data || this.ScheduleStorage.getData();

    // Variable yang akan digunakan untuk perhitungan sistem, yang berisi jumlah akumulasi waktu dari semua jadwal
    const totalTimeSchedule = (currentDataStorage || []).reduce(
      (acc, schedule) => {
        return schedule.timeDoing + acc;
      },
      0,
    );

    // Variable yang akan ditampilkan kepada pengguna serta proses insialisasi dan manipulasinya, variable ini berisi sisa waktu yang berasal dari waktu dalam sheari, yaitu 960 dikurangi waktu yang telah dikonsumusi oleh jadwal keseluruhan
    let remindingTime = 960 - totalTimeSchedule;
    remindingTime = remindingTime < 0 ? 0 : remindingTime;

    return { totalTimeSchedule, remindingTime };
  }

  // Filter function yang digunakan untuk mengambil data berdasarkan tab yang sedang aktif saat ini ✅
  static filterDataByTab(schedulesData, currentActiveTab) {
    //  Data yang diberikan dan masih tergolong data mentah dalam lingkup function ini
    const rawData = schedulesData || [];

    // Kita olah data mentah jadwal tadi menggunakan fillter, dan memastikan bahwa data scedule dengan status yang tepat sesuai dengan data yang disimpan didalam option sajalah yang akan dikirim kedalam view.
    // Pengecualian, ketika tab yang aktif adalah tab All, maka kita tidak perlu melakukan penyaringan, dan cukup membuat conditional yang bisa menghasilkan nilai true untuk mengembalikan semua data walau data sedang difilter.
    const matureData = rawData.filter(
      (data) => currentActiveTab === "All" || data.status === currentActiveTab,
    );

    return matureData;
  }

  static calculationData(schedulesData) {
    const calcuationResult = {
      total: 0,
      on_progress: 0,
      done: 0,
    };

    const rawData = schedulesData || [];

    // Lakukan pengulangan untuk mengecek status di setiap data agar penambahan data bisa dilakukan sesuai dengan kategorinya masing-masing
    rawData.forEach((schedule) => {
      // Jika status data sama dengan on progress maka tambahkan hasil kalukasi on_progress
      if (schedule.status === "On progress") calcuationResult.on_progress++;
      // Jika status data sama dengan done maka tambahkan hasil kalukasi done
      else if (schedule.status === "Done") calcuationResult.done++;

      // Setelah pengecekan tadi, kalukasikan sebagai total jadwal, entah itu data dari status on progress ataupun done
      calcuationResult.total++;
    });

    return calcuationResult;
  }

  // Create function, function yang menjadi cikal bakal permulaan semua function CRUD yang sudah ada saat ini ✅
  // Aku telah melakukan perubahan pada nama parameter dan variable didalam function ini, agar kesan in, process, dan out datanya lebih terasa dengan baik ketika dibaca
  static create(scheduleFields) {
    // Mengembalikan return alert dan memberikan elemen form lagi
    if (!scheduleFields)
      return ScheduleView.showAlert({
        alertHTMLString: Alert({
          type: "error",
          headingText: "Failed to catch the fields",
          message:
            "An error occurred in catching the data, try again in a moment!.",
          buttonText: isSuccess.status ? "" : "Back to the form",
        }),
        isAutoClose: false,
        readTime: 0,
        elementWillShown: "form",
      });

    // Penamaan variable baru sebagai tempat sementara data baru sebelum dimasukan nantinya kedalam localstorage browser kita
    const newScheduleEntry = new Schedule({
      ...scheduleFields,
      timeDoing: Number(scheduleFields.timeDoing) || 0,
      preference: {
        categoryPreference: HelperUI.generateUniqueColorCategory(),
      },
    });

    // Memperbarui cara menyimpan data yang ambil dari local storage, agar proses pengambilan hanya dilakukan sekali, dan proses selanjutnya akan menggunakan data yang sudah diambil dari local storage sehingga tidak ada proses local storage yang tergolong redundan.
    const currentSchedulesData = this.ScheduleStorage.getData() || [];
    const newScheduleEntries = [...currentSchedulesData, newScheduleEntry];
    const timeStats = this.calculationTime(newScheduleEntries);

    // Tidak menggunakan reminding time dari proses caluculating pada fungsi sebelumnya, karena akan menghasilkan false setiap waktu sudah habis dan akan menghasilkan error pop up yang tidak akan terduga, dan bisa mengganggu pengguna
    if (timeStats.totalTimeSchedule <= 960) {
      this.ScheduleStorage.setData(newScheduleEntries);

      ScheduleView.updateUI({
        schedulesData: this.filterDataByTab(
          newScheduleEntries,
          this.currentTab,
        ),
        schedulesCategoryAmount: this.calculationData(newScheduleEntries),
        remindingTime: timeStats.remindingTime,
        currentActiveTab: this.currentTab,
      });

      ScheduleView.updateCategoryDropdown(this.initCategory());
      return {
        status: true,
        headingMessage: "Successfully created a schedule",
        bodyMessage: "Schedule creation was successful!",
      };
    }

    // Ketik total time schedules yang dihasilkan dari proses kalukasi melebihi 960 yang artinya waktu yang disediakan sudah digunakan secara total, atau sebutannya waktunya sudah habis. Pada blok ini kita akan menambahkan alert error untuk memperingat pengguna bahwa data tidak bisa dimasukan lagi karena waktu yang disediakan sudah habis digunakan.
    else {
      return {
        status: false,
        headingMessage: "Failed to make a schedule",
        bodyMessage:
          "An error occurred in creating the schedule data, try again in a moment!.",
      };
    }
  }

  // Trigger form edit
  static edit(elementId) {
    // filter data berdasarkan id yang didapat dari button
    const scheduleData = this.ScheduleStorage.getData().find((schedule) => {
      return schedule.secretIdentity == elementId;
    });

    const opperandData = {
      ...scheduleData,
      scheduleId: scheduleData.secretIdentity,
    };

    // Masukan data dari schedule yang di filter kedalam form update kita
    ScheduleView.showEditForm(opperandData);
  }

  // Update
  static update(elementId, updatedData) {
    // Melakukan mapping untuk memasikan data yang sedang di update sekarang sudah diedit tidak akan tertimpa dengan data lamanya

    const newData = this.ScheduleStorage.getData().map((schedule) => {
      return schedule.secretIdentity == elementId ? updatedData : schedule;
    });

    // Buat array baru berdasarkan data yang telah di maping ditambah 1 data hasil dari update data sebelumnya
    // const newData = [...filteredData, updatedData];
    console.log(newData);
    const currentTime = this.calculationTime(newData);

    if (currentTime.totalTimeSchedule <= 960) {
      this.ScheduleStorage.setData(newData);

      ScheduleView.updateUI(newData, currentTime.remindingTime);
      ScheduleView.updateCategoryDropdown(this.initCategory());
      return true;
    } else {
      return false;
    }
  }

  // Handle submit yang sudah diperbarui ✅
  // Handle submit digunakan untuk membuat 1 form memiliki 2 sifat transaksi yang fleksibel, yaitu: create dan update data
  // Handle submit kini sudah memiliki fallback yang lebih rapi dan pemisahan tanggung jawab antara pemroses di latar belakang dan penampil ke UI
  static handleSubmit(formElement) {
    // Fallback untuk langsung membatalkan aksi jika form element tidak ditemukan, dan sekaligus memberikan alert error custom
    if (!formElement) return ScheduleView.showAlert(Alert({ type: "error" }));

    // Lakukan format data berdasarkan input yang dikirim dari form tersebut
    const formatedFormElement = new FormData(formElement);

    // Konversi data input yang telah di format sebagai sebuah object, agar mudah di manipulasi
    const formInputsValue = Object.fromEntries(formatedFormElement);

    // Lakukan validasi pada input yang dimasukan
    let formErrors = ScheduleRequest.formValidation(formInputsValue);

    // Membatalkan aksi dibawahnya jika ada error dalam proses validasi di request
    if (Object.keys(formErrors).length > 0) {
      return ScheduleView.showErrorMessage(formErrors);
    }

    // Sesuai nama DOM element, yaitu: form flexible, artinya kita bisa menggunakan form ini untuk store (menyimpan data lama) dan create(menyimpan dan merubah data lama dengan perubahan baru)
    const currentId = formInputsValue["scheduleId"];

    // IsSuccess sekarang harus fleksibel, karena dia bisa berisi hasil eksekusi dari function create dan update, tergantung kondisinya nanti
    let isSuccess = false;
    let alertInformation = {
      type: "",
      headingText: "",
      message: "",
      buttonText: "",
    };

    // Proses update
    if (currentId) {
      // Menggunakan data yang sudah ada didalam local storage sebelumnya, lalu memilih data lama berdasarkan id dari input form, digunakan supaya bisa menjaga nilai properti yang tidak ada di form bisa tetap terjaga seperti sebelumnya
      const filterdSchedule = this.ScheduleStorage.getData().find(
        (schedule) => schedule.secretIdentity === currentId,
      );

      // Membuat data untuk di opper kedalam update function, kita menggunakan spread operator dari 2 array data, yang pertama dari data sebelumnya yang di fillter, dan kemudian array data dari input, yang akan menimpan nilai dari data lama sesuai properti yang tersedia didalamnya, dan kemudian yang terakhir melakukan casting time doing, agar yang disimpan dari input tetap sebuah nomer
      const mappedObject = {
        ...filterdSchedule,
        ...formInputsValue, // noted kesalaan operand id yang dimana masih menggunakan id public dari input form bukan private
        timeDoing: Number(formInputsValue.timeDoing) || 0,
      };

      // Tambahkan metode untuk merubahnya menjadi instance dari class
      const opperandData = new Schedule(mappedObject);

      isSuccess = this.update(currentId, opperandData);

      // Siapkan informasi yang akan diteruskan ke alert nantinya
      alertInformation = {
        type: isSuccess ? "success" : "error",
        headingText: isSuccess
          ? "Successfully updated schedule"
          : "Failed to update schedule",
        message: isSuccess
          ? "Successfully updated schedule data! Check the main page for changes."
          : "An error occurred in updating the schedule data, try again in a moment!.",
        buttonText: isSuccess ? "" : "Back to the form",
      };
    } else {
      formElement.reset();
      isSuccess = this.create({ ...formInputsValue });

      // Siapkan informasi yang akan diteruskan ke alert nantinya
      alertInformation = {
        type: isSuccess.status ? "success" : "error",
        headingText: isSuccess.headingMessage,
        message: isSuccess.bodyMessage,
        buttonText: isSuccess.status ? "" : "Back to the form",
      };
    }

    // Fase penerusan ke layar pengguna
    if (isSuccess) {
      formElement.reset();

      // Opperand telah diperbarui menjadi sebuah object
      ScheduleView.showAlert({
        alertHTMLString: Alert(alertInformation),
        isAutoClose: true,
        readTime: 4000,
      });
    } else {
      // Memastikan bahwa ketika gagal form tidak direset dan pemnerian manual close pada alert agar pengguna bisa membaca pesan kesalahan sebelum menutup alertnya dan bisa melakukan iterasi kembali setelahnya
      // Pembaruan sistem alert, kali ini alert sudah bisa menggunakan metode manual close untuk menutup alert tersebut dan bisa membangkitkan elemen lainnya ataupun elemen dari iterasi sebelumnya sesuai jenis elemen yang diberikan pada argumen elemen will shown ✅
      ScheduleView.showAlert({
        alertHTMLString: Alert(alertInformation),
        isAutoClose: false,
        readTime: 0,
        elementWillShown: "form",
      });
    }
  }

  // Delete function
  // Perlu perbaikan sistem opperand param ke alert function dan penetapan alert yang lebih diperjelas ⚠️
  static async delete(elementId) {
    const filteredData = this.ScheduleStorage.getData().filter(
      (schedule) => schedule.secretIdentity != elementId,
    );
    const choice = await ScheduleView.showConfirmation(Confirmation());
    const currentTime = this.calculationTime();

    const alertInformation = {
      type: "success",
      headingText: "Successfully created a schedule",
      message: "Schedule creation was successful!",
      buttonText: "",
    };

    if (choice) {
      this.ScheduleStorage.setData(filteredData);

      ScheduleView.updateUI(filteredData, currentTime.remindingTime);
      ScheduleView.updateCategoryDropdown(this.initCategory());
      ScheduleView.showAlert({
        alertHTMLString: Alert(alertInformation),
        isAutoClose: true,
        readTime: 4000,
      });
    }
  }

  // Mark as done
  // Akan diperbaiki lagi pada pengembangan fitur sort by setelah fitur CRUD ⚠️
  static markUnMarkDone(elementId) {
    const mappedData = this.ScheduleStorage.getData().map((schedule) =>
      schedule.secretIdentity == elementId ? schedule.markAsDone() : schedule,
    );
    const remindingTime = this.calculationTime();

    this.ScheduleStorage.setData(mappedData);

    ScheduleView.showAlert(Alert("success"));
    ScheduleView.updateUI(mappedData, remindingTime.remindingTime);
  }

  // Sorting
  // sorting by time
  // Akan diperbaiki lagi pada pengembangan fitur sort by setelah fitur CRUD ⚠️
  static sortBy(timeType = "", categoryType = "") {
    let procesesData = this.ScheduleStorage.getData();
    const remindingTime = this.calculationTime();

    // Default adalah newest, namun jika berganti maka akan berganti ke oldest atau jika ingin semantic ke DB kita bisa rubah menjadi konsep ascending dan descending
    this.sortByTime = timeType || this.sortByTime;

    // Default All yang akan menampilkan semua data yang ada didalam local storage nantinya
    this.sortByCategory = categoryType || this.sortByCategory;

    // Fiilter berdasarkan category yang dipilih pengguna
    if (this.sortByCategory && this.sortByCategory != "All") {
      procesesData = procesesData.filter(
        (data) => data.category == this.sortByCategory,
      );
    }

    // Urutkan berdasarkan waktu pembuatan
    // Ralat!! kita akan menggunakan methode to sort, karena jika kita tidak memiliki kategori, maka fiilter method tidak akan berfungsi disana, yang artinya tidak akan ada array baru yang berisi salinan dari array data asli
    if (this.sortByTime == "Newest") {
      procesesData = procesesData.toSorted((a, b) => b.createdAt - a.createdAt);
    } else {
      procesesData = procesesData.toSorted((a, b) => a.createdAt - b.createdAt);
    }

    ScheduleView.updateUI(procesesData, remindingTime.remindingTime);
  }

  static initCategory() {
    const currentData = this.ScheduleStorage.getData();
    const categoryExist = new Set(
      currentData.map((data) => data.category).filter(Boolean),
    );

    return [...categoryExist];
  }

  // Init function
  // Init function digunakan untuk menginsialisasi UI saat website pertama kali dibuka kembali oleh pengguna
  // Bahas sedikit mengenai Boostraping konsep dengan function init ini
  static initDataInToUI() {
    const currentScheduleData = this.ScheduleStorage.getData();
    const timeStats = this.calculationTime();

    ScheduleView.updateUI({
      schedulesData: this.filterDataByTab(currentScheduleData, this.currentTab),
      schedulesCategoryAmount: this.calculationData(currentScheduleData),
      remindingTime: timeStats.remindingTime,
      currentActiveTab: this.currentTab,
    });
    ScheduleView.updateCategoryDropdown(this.initCategory());
  }

  // Function baru, function delegation untuk controller 📲
  // Membuat delegation untuk controller, agar element yang dikhususkan untuk mengelola UI sekaligus memerlukan opperand atau kehadiran data untuk melakukan iterasi selanjutnya dengan aman.
  static initDelegationController() {
    const dropDownTime = document.getElementById("drop-down-time");
    // Menambahkan event delegation di element body, agar lebih hemat memory. Karena kita hanya memasang listener di satu element tunggal dan element tersebut sudah mencakup semua elemen yang bisa dan perlu kita manipulasi untuk keberlangsungan sistem kita.
    document.body.addEventListener("click", (event) => {
      // Kita lakukan seleksi element agar event bubbling yang dilakukan oleh method closest bisa berjalan dengan baik dan bisa mengakses element yang ingin dituju walau yang diakses merupakan child dari element yang memiliki properti yang digunakan untuk seleksi.
      const editButton = event.target.closest("[data-card-edit]");
      const deleteButton = event.target.closest("[data-card-delete]");
      const markAsDoneButton = event.target.closest("[data-card-mark]");
      const unmarkDoneButton = event.target.closest("[data-card-unmark]");
      const dropDownTimeOption = event.target.closest("[data-sort-by-time]");
      const tabsOption = event.target.closest("[data-tabs-option]");

      // const dropDownCategoryOption = event.target.closest("");

      // Menggunakan if dan else if, ketimbangan jejeran pasukan if
      // Untuk menghemat memori, karena ketika kondisi yang tepat sudah ditemukan maka kondisi lainnya yang tidak memenuhi syarat akan otomatis diabaikan dan tidak diperiksa oleh engine JS (V8)
      // !! Pembedaan lingkup delegation dan bubbling
      // !! Lingkup pertama spesific selector, digunakan untuk delegation dan bubbling yang dimana elemen untuk triggernya ini sulit dicapai yang artinya elemen nya lebih spesifik dari pada elemen di jenis kedua.
      if (editButton) {
        const cardId = editButton.getAttribute("data-card-edit");
        this.edit(cardId);
      }

      // Delete button dan fungsionalitasnya
      else if (deleteButton) {
        const cardId = deleteButton.getAttribute("data-card-delete");
        this.delete(cardId);
      }

      // Mark as done button dan fungsionalitasnya
      // Akan diperbaiki lagi pada pengembangan fitur sort by setelah fitur CRUD ⚠️
      else if (markAsDoneButton) {
        const cardId = markAsDoneButton.getAttribute("data-card-mark");
        this.markUnMarkDone(cardId);
      }

      // Un mark button dan fungsionalitasnya
      // Akan diperbaiki lagi pada pengembangan fitur sort by setelah fitur CRUD ⚠️
      else if (unmarkDoneButton) {
        const cardId = unmarkDoneButton.getAttribute("data-card-unmark");
        this.markUnMarkDone(cardId);
      }

      // Testing dropdown time
      // Akan diperbaiki lagi pada pengembangan fitur sort by setelah fitur CRUD ⚠️
      else if (event.target.closest(`#${DOM.triggerSort.id}`)) {
        if (!dropDownTime) return;
        const isCurrentlyOpen = !dropDownTime.classList.contains("hidden");

        ScheduleView.showDropDown({
          showState: !isCurrentlyOpen,
          dropDownElement: dropDownTime,
          dropDownAttributeSelection: "data-sort-by-time",
          currentMethodeSelected: this.sortByTime,
        });
      }

      // Klik per option delegation
      // Akan diperbaiki lagi pada pengembangan fitur sort by setelah fitur CRUD ⚠️
      else if (dropDownTimeOption) {
        const attributVal =
          dropDownTimeOption.getAttribute("data-sort-by-time");

        this.sortBy(attributVal, null);
        ScheduleView.initChoosenOption(attributVal, "data-sort-by-time");
      }

      // Tabs option delegation
      // Untuk action didalam tab setelah  tahap insialisasi pertama kali oleh init function
      else if (tabsOption) {
        const tabSelected = tabsOption.getAttribute("data-tabs-option");

        if (!tabSelected) this.currentTab = "All";

        this.currentTab = tabSelected;

        const currentScheduleData = this.ScheduleStorage.getData();
        const timeStats = this.calculationTime();

        ScheduleView.updateUI({
          schedulesData: this.filterDataByTab(
            currentScheduleData,
            this.currentTab,
          ),
          remindingTime: timeStats.remindingTime,
          currentActiveTab: this.currentTab,
        });
      }

      // !! Lingkup keudua general big selector, digunakan untuk delegation dan bubbling yang dimana elemen untuk triggernya ini lebih mudah untuk dicapai, karena dia hampir mempunyai satu cakupan layar yang dimana itu mustahil untuk dihindari.
      if (
        dropDownTime &&
        !dropDownTime.classList.contains("hidden") &&
        !event.target.closest(`#${DOM.triggerSort.id}`) &&
        !event.target.closest("#drop-down-time")
      ) {
        ScheduleView.showDropDown({
          showState: false,
          dropDownElement: dropDownTime,
          dropDownAttributeSelection: "data-sort-by-time",
          currentMethodeSelected: this.sortByTime,
        });
      }
    });

    // Event pada form, sengaja tidak di jadikan event delegation karena event submit hanya diperuntukan khusus untuk mengelola satu form dan bukan untuk mengelola element besar seperti event listener "click".
    DOM.flexibleForm.addEventListener("submit", (event) => {
      // Memastikan bahwa ketika event submit terjadi tidak melakukan event bubbling yang bisa merfresh halaman dan mengganggu animasi yang sudah kita temukan sebelumnya.
      event.preventDefault();

      // Kenapa tidak menggunakan konsep this untuk dilempar pada parameter? Karena this disini kita digunakan  untuk mengakses method pada class yang kita gunakan saat ini, sementara opperand form kita teruskan menggunakan event.target karena otomatis setelah event terjadi, target yang diambil oleh event adalah element tersebut.
      this.handleSubmit(event.target);
    });
  }
}
