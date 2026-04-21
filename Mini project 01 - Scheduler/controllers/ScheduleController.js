// Menggunakan metode ES6 module, yang dimana kita mulai mengunakan server dari node JS untuk menangani CORS dari website kita
import Alert from "../components/Alert.js";
import Confirmation from "../components/Confirmation.js";
import Schedule from "../models/Schedule.js";
import ScheduleRequest from "../request/FormRequestValidation.js";
import { HelperUI } from "../utils/Helper.js";
import ScheduleView from "../views/ScheduleView.js";
import { DOM } from "../views/ScheduleView.js";

export default class ScheduleController {
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
      return true;
    } else {
      return false;
    }
  }

  // Handle submit conditional
  static handleSubmit(formElement) {
    if (!formElement) return;

    // Lakukan format data berdasarkan input yang dikirim dari form tersebut
    const formatedFormElement = new FormData(formElement);

    // Konversi data input yang telah di format sebagai sebuah object, agar mudah di manipulasi
    const formInputsValue = Object.fromEntries(formatedFormElement);

    // Lakukan validasi pada input yang dimasukan
    let formErrors = ScheduleRequest.formValidation(formInputsValue);

    // Sesuai nama DOM element, yaitu: form flexible, artinya kita bisa menggunakan form ini untuk store (menyimpan data lama) dan create(menyimpan dan merubah data lama dengan perubahan baru)
    const currentId = formInputsValue["scheduleId"];

    // IsSuccess sekarang harus fleksibel, karena dia bisa berisi hasil eksekusi dari function create dan update, tergantung kondisinya nanti
    let isSuccess;

    if (Object.keys(formErrors).length === 0) {
      if (currentId) {
        // Menggunakan data yang sudah ada didalam local storage sebelumnya, lalu memilih data lama berdasarkan id dari input form, digunakan supaya bisa menjaga nilai properti yang tidak ada di form bisa tetap terjaga seperti sebelumnya
        const filterdSchedule = this.ScheduleStorage.getData().find(
          (schedule) => {
            if (schedule.secretIdentity == currentId) return schedule;
          },
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

        if (isSuccess) {
          formElement.reset();
          // ScheduleView.showForm(false);
          ScheduleView.showAlert(Alert("success"));
        } else {
          formElement.reset();
        }
      } else {
        isSuccess = this.create({ ...formInputsValue });
      }
    } else {
      ScheduleView.showErrorMessage(formErrors);
    }
  }

  // Delete
  // Coming soon
  static async delete(elementId) {
    const filteredData = this.ScheduleStorage.getData().filter(
      (schedule) => schedule.secretIdentity != elementId,
    );
    const choice = await ScheduleView.showConfirmation(Confirmation());
    const currentTime = this.calculationTime();

    if (choice) {
      this.ScheduleStorage.setData(filteredData);
      ScheduleView.updateUI(filteredData, currentTime.remindingTime);
      ScheduleView.showAlert(Alert("success"));
    }
  }

  static markAsDone() {}

  // Sorting
  // Coming soon
  static sorting(sortingMethode) {
    this.ScheduleStorage.getData();
  }

  // Init function
  // Init function digunakan untuk menginsialisasi UI saat website pertama kali dibuka kembali oleh pengguna
  // Bahas sedikit mengenai Boostraping konsep dengan function init ini
  static init() {
    const currentData = this.ScheduleStorage.getData();
    const currentTime = this.calculationTime();

    ScheduleView.updateUI(currentData, currentTime.remindingTime);
  }
}
