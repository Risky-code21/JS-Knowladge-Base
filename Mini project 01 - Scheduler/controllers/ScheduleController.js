// Menggunakan metode ES6 module, yang dimana kita mulai mengunakan server dari node JS untuk menangani CORS dari website kita
import Schedule from "../models/Schedule.js";
import { HelperUI } from "../utils/Helper.js";
import ScheduleView from "../views/ScheduleView.js";

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

  // Delete
  // Coming soon
  static delete() {
    this.ScheduleStorage.setData([]);
  }

  // Sorting
  // Coming soon
  static sorting(sortingMethode) {
    this.ScheduleStorage.getData();
  }

  // Init function
  // Init function digunakan untuk menginsialisasi UI saat website pertama kali dibuka kembali oleh pengguna
  static init() {
    const currentData = this.ScheduleStorage.getData();
    const currentTime = this.calculationTime();

    ScheduleView.updateUI(currentData, currentTime.remindingTime);
  }
}
