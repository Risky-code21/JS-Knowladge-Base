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
  // Properti untuk filter data ataupun sort data yang ada
  static sortByTime = "Newest";
  static sortByCategory = "All";
  static currentTab = "All";

  /**
   * (Inggris)
   * Object local storge (Buatan sendiri) agar transaksi ke localstorage lebih mudah
   */
  static ScheduleStorage = {
    key: "ScheduleStorage",
    getData() {
      const rawData = JSON.parse(localStorage.getItem(this.key)) || [];

      // Membuat reyhdration untuk membangkitkan data bertipe JSON yang sebelumnya disimpan dilocal storage menjadi instance dari class
      return rawData.map((data) => {
        return new Schedule(data);
      });
    },
    setData(data = []) {
      localStorage.setItem(this.key, JSON.stringify(data));
    },
  };

  /**
   * (Inggris)
   * Untuk memuat event delegation UI yang memerlukan akses data dari controller
   */
  static initListenerController() {
    // Perbaiki di issue sort nantinya
    const dropDownTime = document.getElementById("drop-down-time");
    document.body.addEventListener("click", (event) => {
      // Pengelolaan event bubbling dengan seleksi awal
      const dropDownTimeOption = event.target.closest("[data-sort-by-time]");
      const tabsOption = event.target.closest("[data-tabs-option]");
      const editButton = event.target.closest("[data-card-edit]");
      const deleteButton = event.target.closest("[data-card-delete]");
      const markAsDoneButton = event.target.closest("[data-card-mark]");
      const unmarkDoneButton = event.target.closest("[data-card-unmark]");

      // Pengelolaan dropdown dan opsinya yang akan digunakan untuk melakukan sorting
      // Pengelolaan dropdown dari button yang mentrigger kemunculannya
      if (event.target.closest(`#${DOM.triggerSortTimeButton.id}`)) {
        if (!dropDownTime) return;
        const isCurrentlyOpen = !dropDownTime.classList.contains("hidden");

        ScheduleView.showDropDown({
          showState: !isCurrentlyOpen,
          dropDownElement: dropDownTime,

          // Kemungkinan dipengembangan sort, kita akan menghilangkan param ini, karena ketidak perluan kita menginsialisasi ulang opsi yang dipilih saat membuka dan menutup jadwal
          dropDownAttributeSelection: "data-sort-by-time",
          currentMethodeSelected: this.sortByTime,
        });
      }

      // Pengelolaan dropdown sort by time untuk bagian opsi
      else if (dropDownTimeOption) {
        const attributVal =
          dropDownTimeOption.getAttribute("data-sort-by-time");

        this.sortBy(attributVal, null);
        ScheduleView.updateChoosenOption(attributVal, "data-sort-by-time");
      }

      // Pengelolaan tabs option dan pertukaran state antara tabs option yang aktif
      else if (tabsOption) {
        const tabSelected = tabsOption.getAttribute("data-tabs-option");

        if (!tabSelected) this.currentTab = "All";

        this.currentTab = tabSelected;
        const currentScheduleData = this.ScheduleStorage.getData();
        const currentTabElement = document.querySelector(
          `[data-tabs-option="${this.currentTab}"]`,
        );

        ScheduleView.renderTabs(currentTabElement);
        ScheduleView.renderCards(
          this.filterDataByTab(currentScheduleData, this.currentTab),
          this.currentTab,
        );
      }

      // Pengelolaan button transaksi update dan delete
      // Pengelolaan button untuk update schedule data yang ada
      else if (editButton) {
        const cardId = editButton.getAttribute("data-card-edit");
        this.edit(cardId);
      }

      // Pengelolaan button untuk delete schedule data yang ada
      else if (deleteButton) {
        const cardId = deleteButton.getAttribute("data-card-delete");
        this.delete(cardId);
      }

      // Pengelolaan penandaan status jadwal
      // Pengelolaan button untuk menandai schedule yang dipilih sebagai schedule yang telah selesai dilakukan
      else if (markAsDoneButton) {
        const cardId = markAsDoneButton.getAttribute("data-card-mark");
        this.markUnMarkDone(cardId);
      }

      // Pengelolaan button untuk menandai schedule yang sudah selesai menjadi schedule yang belum selesai kembali
      else if (unmarkDoneButton) {
        const cardId = unmarkDoneButton.getAttribute("data-card-unmark");
        this.markUnMarkDone(cardId);
      }

      // Kondisi yang paling mudah diakses oleh pengguna, harus dipisah dari kondisi element lain yang lumayan susah diakses
      // Pengelolaan show pada dropdown sort time agar otomatis tertutup jika klik diluar elemen yang berkaitan ataupun di body element
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

    DOM.flexibleFormElement.addEventListener("submit", (event) => {
      // Memastikan bahwa ketika event submit terjadi tidak melakukan event bubbling yang bisa merfresh halaman dan mengganggu animasi yang sudah kita temukan sebelumnya.
      event.preventDefault();

      // Kenapa tidak menggunakan konsep this untuk dilempar pada parameter? Karena this disini kita digunakan  untuk mengakses method pada class yang kita gunakan saat ini, sementara opperand form kita teruskan menggunakan event.target karena otomatis setelah event terjadi, target yang diambil oleh event adalah element tersebut.
      this.handleSubmit(event.target);
    });
  }

  /**
   * (Inggris)
   * Untuk insialisasi elemen UI dengan data yang sudah ada
   */
  static initDataInToUI() {
    const currentSchedulesData = this.ScheduleStorage.getData();
    const calcStats = this.calculateAllStats();
    const statsAmountEntries = {
      totalAmount: calcStats.totalSchedule,
      onProggressAmount: calcStats.onProgressSchedule,
      doneAmount: calcStats.doneSchedule,
    };

    // Akan ditambahkan param untuk mengelola choosen option awal nantinya didalam dropdown option
    ScheduleView.overallUpdateUI({
      filtredSchedulesData: this.filterDataByTab(
        currentSchedulesData,
        this.currentTab,
      ),
      schedulesDataQuantity: statsAmountEntries,
      timeReminding: calcStats.remindingTime,
      currentActiveTab: this.currentTab,
      currentCategories: this.calcCategory(),
    });
  }

  /**
   * (Inggris)
   * Untuk menangani event submit yang dihasilkan oleh flexible form untuk menghandle 2 jenis transaksi
   * @param {HTMLElement} formElement
   * @returns
   */
  static handleSubmit(formElement) {
    // Melakukan pengecekan pada elemen form, untuk menghindari hilangnya element
    if (!formElement) return ScheduleView.showAlert(Alert({ type: "error" }));

    // Memformat isi input yang didapat dari form, dan kemudian digunakan untuk validasi
    const formatedFormElement = new FormData(formElement);
    const formInputsValue = Object.fromEntries(formatedFormElement);
    let formErrors = ScheduleRequest.formValidation(formInputsValue);

    // Pengecekan hasil validation input berdasarkan panjang dari array errors, jika lebih dari 0 maka ada error
    if (Object.keys(formErrors).length > 0) {
      return ScheduleView.showErrorMessage(formErrors);
    }
    // Insialisasi untuk proses percabangan selanjutnya antara transaksi create dan update
    const currentId = formInputsValue["scheduleId"];
    const timeDoingInMinutes =
      Number(formInputsValue.timeDoingHours * 60) +
      Number(formInputsValue.timeDoingMinutes);
    let isSuccess = {
      status: false,
      headingMessage: "",
      bodyMessage: "",
    };
    let alertInformation = {
      type: "",
      headingText: "",
      message: "",
      buttonText: "",
    };

    // Form akan menjadi update form ketika input hidden id terisi oleh id schedule
    if (currentId) {
      const filterdSchedule = this.ScheduleStorage.getData().find(
        (schedule) => schedule.secretIdentity === currentId,
      );
      const mappedObject = {
        ...filterdSchedule,
        ...formInputsValue,
        timeDoing: Number(timeDoingInMinutes) || 0,
      };
      const opperandData = new Schedule(mappedObject);

      // Membuat operand selanjutnya untuk alert
      isSuccess = this.update(currentId, opperandData);
      alertInformation = {
        type: isSuccess.status ? "success" : "error",
        headingText: isSuccess.headingMessage
          ? "Successfully updated schedule"
          : "Failed to update schedule",
        message: isSuccess.bodyMessage
          ? "Successfully updated schedule data! Check the main page for changes."
          : "An error occurred in updating the schedule data, try again in a moment!.",
        buttonText: isSuccess.status ? "" : "Back to the form",
      };
    }

    // Jika input hidden id kosong, maka form akan menjadi form create
    else {
      formElement.reset();
      isSuccess = this.create({
        ...formInputsValue,
        timeDoing: timeDoingInMinutes,
      });

      // Membuat operand selanjutnya untuk alert
      alertInformation = {
        type: isSuccess.status ? "success" : "error",
        headingText: isSuccess.headingMessage,
        message: isSuccess.bodyMessage,
        buttonText: isSuccess.status ? "" : "Back to the form",
      };
    }

    // Pengelolaan alert yang akan ditampilkan kelayar
    if (isSuccess.status === true) {
      formElement.reset();
      ScheduleView.showAlert({
        alertHTMLString: Alert(alertInformation),
        isAutoClose: true,
        readTime: 4000,
      });
    } else {
      ScheduleView.showAlert({
        alertHTMLString: Alert(alertInformation),
        isAutoClose: false,
        readTime: 0,
        elementWillShown: "form",
      });
    }
  }

  /**
   * (Inggris)
   * Untuk mengkalkulasi semua data yang dibutuhkan dalam pertumbuhan stats yang ada
   * @param {Array} schedulesData
   * @returns
   */
  static calculateAllStats(schedulesData) {
    // Melakukan pengecekan data untuk menghindari error dini
    const rawData = schedulesData || this.ScheduleStorage.getData() || [];

    // Melakukan reduce berdasarkan data sebelumnya untuk melengkapi beberapa properti pada object untuk dilemparkan ke pengelolaan stats nantinya
    const statsResult = rawData.reduce(
      (acc, schedule) => {
        acc.totalTimeUsed += schedule.timeDoing;

        acc.totalSchedule++;

        if (schedule.status === "On progress") {
          acc.onProgressSchedule++;
        } else if (schedule.status === "Done") {
          acc.doneSchedule++;
        }

        return acc;
      },

      // Object reduce
      {
        totalTimeUsed: 0,
        totalSchedule: 0,
        onProgressSchedule: 0,
        doneSchedule: 0,
        remindingTime: 0,
      },
    );

    const remindingTime = 960 - statsResult.totalTimeUsed;
    statsResult.remindingTime = remindingTime < 0 ? 0 : remindingTime;

    return statsResult;
  }

  /**
   *
   * @param {Array} schedulesData
   * @param {String} currentActiveTab
   * @returns
   */
  static filterDataByTab(schedulesData, currentActiveTab) {
    const rawData = schedulesData || [];
    const matureData = rawData.filter(
      (data) => currentActiveTab === "All" || data.status === currentActiveTab,
    );

    return matureData;
  }

  /**
   * (Inggris)
   * Untuk menghitung  jumlah category unik yang sudah ada saat ini
   * @returns
   */
  static calcCategory() {
    const currentData = this.ScheduleStorage.getData();

    // Membuat set berdasarkan kategori unik, untuk menghindari duplikat category
    const categoryExist = new Set(
      currentData.map((data) => data.category).filter(Boolean),
    );

    return [...categoryExist];
  }

  /**
   * (Inggris)
   * Untuk membuat data object baru
   * @param {Object} scheduleFields
   * @returns
   */
  static create(scheduleFields) {
    if (!scheduleFields)
      // Mengembalikan alert error
      return ScheduleView.showAlert({
        alertHTMLString: Alert({
          type: "error",
          headingText: "Failed to catch the fields",
          message:
            "An error occurred in catching the data, try again in a moment!.",
          buttonText: "Back to the form",
        }),
        isAutoClose: false,
        readTime: 0,
        elementWillShown: "form",
      });

    // Fase pembuatan opperand data yang akan dilempar kesetiap function khusus didalam UI nantinya
    const newScheduleEntry = new Schedule({
      ...scheduleFields,
      timeDoing: Number(scheduleFields.timeDoing) || 0,
      preference: {
        categoryPreference: HelperUI.generateUniqueColorCategory(),
      },
    });

    const currentSchedulesData = this.ScheduleStorage.getData() || [];
    const newScheduleEntries = [...currentSchedulesData, newScheduleEntry];
    const calcStats = this.calculateAllStats(newScheduleEntries);
    const oldCategories = this.calcCategory();
    const statsAmountEntries = {
      totalAmount: calcStats.totalSchedule,
      onProggressAmount: calcStats.onProgressSchedule,
      doneAmount: calcStats.doneSchedule,
    };

    if (calcStats.totalTimeUsed <= 960) {
      // Update data di local storage sebelumnya
      this.ScheduleStorage.setData(newScheduleEntries);

      const newCategories = this.calcCategory();

      // Penerusan hasil kalkulasi ke beberapa function
      ScheduleView.renderStats(statsAmountEntries, calcStats.remindingTime);
      ScheduleView.renderCards(
        this.filterDataByTab(newScheduleEntries, this.currentTab),
        this.currentTab,
      );

      // Memastikan kategori hanya diupdate jika ada kategori baru
      if (oldCategories.length !== newCategories.length) {
        ScheduleView.updateCategoryDropdown(newCategories);
      }

      // Pengembalian object untuk membuat pesan alert
      return {
        status: true,
        headingMessage: "Successfully created a schedule",
        bodyMessage: "Schedule creation was successful!",
      };
    } else {
      // Pengembalian object untuk membuat pesan alert
      return {
        status: false,
        headingMessage: "Failed to make a schedule",
        bodyMessage:
          "An error occurred in creating the schedule data, try again in a moment!.",
      };
    }
  }

  /**
   * (Inggris)
   * Untuk menginsialisasi form dengan nilai yang ada pada data schedule yang dipilih
   * @param {String} elementId
   */
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

  /**
   * (Inggris)
   * Untuk update data sesuai data schedule yang dipilih sebelumnya
   * @param {*} elementId
   * @param {*} updatedData
   * @returns
   */
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

      ScheduleView.overallUpdateUI(newData, currentTime.remindingTime);
      ScheduleView.updateCategoryDropdown(this.calcCategory());
      return true;
    } else {
      return false;
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

      ScheduleView.overallUpdateUI(filteredData, currentTime.remindingTime);
      ScheduleView.updateCategoryDropdown(this.calcCategory());
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
    ScheduleView.overallUpdateUI(mappedData, remindingTime.remindingTime);
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

    ScheduleView.overallUpdateUI(procesesData, remindingTime.remindingTime);
  }
}
