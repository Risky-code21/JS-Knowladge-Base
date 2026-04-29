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

  // Create
  // Implementasi create sebagai trigger form, dan store sebagai handler untuk menyimpan data di local storage
  static create(information) {
    // addition #1 Menghentikan eksekusi function jika information kosong
    if (!information) return;

    const newSchedule = new Schedule({
      ...information,
      timeDoing: Number(information.timeDoing) || 0,
      preference: {
        categoryPreference: HelperUI.generateUniqueColorCategory(),
      },
    });

    // Memperbarui cara menyimpan data yang ambil dari local storage, agar proses pengambilan hanya dilakukan sekali, dan proses selanjutnya akan menggunakan data yang sudah diambil dari local storage
    const currentStorageData = this.ScheduleStorage.getData() || [];
    const updatedStorage = [...currentStorageData, newSchedule];
    const currentTime = this.calculationTime(updatedStorage);

    // Tidak menggunakan reminding time dari proses caluculating pada fungsi sebelumnya, karena akan menghasilkan false setiap waktu sudah habis dan akan menghasilkan error pop up yang tidak akan terduga, dan bisa mengganggu pengguna
    if (currentTime.totalTimeSchedule <= 960) {
      this.ScheduleStorage.setData(updatedStorage);

      ScheduleView.updateUI(updatedStorage, currentTime.remindingTime);
      ScheduleView.updateCategoryDropdown(this.initCategory());
      return true;
    } else {
      // Pop up will be here
      return false;
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
  // Perlu perbaikan form yang otomatis terisi ulang ketika pengguna mengalami error ⚠️
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
        buttonText: isSuccess ? "" : "Back to the dasboard",
      };
    } else {
      formElement.reset();
      isSuccess = this.create({ ...formInputsValue });

      // Siapkan informasi yang akan diteruskan ke alert nantinya
      alertInformation = {
        type: isSuccess ? "success" : "error",
        headingText: isSuccess
          ? "Successfully created a schedule"
          : "Failed to make a schedule",
        message: isSuccess
          ? "Schedule creation was successful!"
          : "An error occurred in creating the schedule data, try again in a moment!.",
        buttonText: isSuccess ? "" : "Back to the dasboard",
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
      // !! Mungkin diakhir kita pikirkan lagi agar bisa mengembalikan form setelah alert error ini muncul, karena alert baru didesign untuk langsung tutup dan tidak bisa memunculkan form lagi, alias satu arah
      // Memastikan bahwa ketika gagal form tidak direset dan pemnerian manual close pada alert agar pengguna bisa membaca pesan kesalahan sebelum menutup alertnya dan bisa melakukan iterasi kembali setelahnya
      ScheduleView.showAlert({
        alertHTMLString: Alert(alertInformation),
        isAutoClose: false,
        readTime: 4000,
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
  static init() {
    const currentData = this.ScheduleStorage.getData();
    const currentTime = this.calculationTime();

    ScheduleView.updateUI(currentData, currentTime.remindingTime);
    ScheduleView.updateCategoryDropdown(this.initCategory());
  }
}
