import Schedule from "../models/Schedule.js";
import { HelperUI } from "../utils/Helper.js";
import ScheduleView from "../views/ScheduleView.js";

export default class ScheduleController {
  // Controller property
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
  static calculationTime(data) {
    const currentDataStorage = data || this.ScheduleStorage.getData();
    const totalTimeSchedule = (currentDataStorage || []).reduce(
      (acc, schedule) => {
        return schedule.timeDoing + acc;
      },
      0,
    );

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

    // Refactor #1 membuat penyimpanan data dengan lebih rapi dan lebih efektif, agar proses berat dari parsing JSON di local storage tidak membebani V8 engine JS dan tidak menurunkan performa website
    const currentStorageData = this.ScheduleStorage.getData() || [];
    // Tetap masukan data yang sudah didefinisikan diatas, jika sebelumnya data berisi array berarti data akan ditambah data berikutnya (data baru) jika tidak berarti inserta data baru (data kosong dan baru dinsialisasi oleh data baru)
    let updatedStorage = [...currentStorageData, newSchedule];

    // Refactor #2 membuat function yang lebih optimal untuk mengelola sisa waktu harian dalam website
    const currentTime = this.calculationTime(updatedStorage);

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
  static delete() {
    this.ScheduleStorage.setData([]);
  }

  // Sorting
  static sorting(sortingMethode) {
    this.ScheduleStorage.getData();
  }

  static init() {
    const currentData = this.ScheduleStorage.getData();
    const currentTime = this.calculationTime();

    ScheduleView.updateUI(currentData, currentTime.remindingTime);
  }
}
