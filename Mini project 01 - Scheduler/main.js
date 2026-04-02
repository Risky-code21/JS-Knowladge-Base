// todo --------------------------- Backend implementation

// Main array storage
let scheduleStroage = []; // change it to let, so it's easy to manipulate
let totalTimeInOneDay = 960; // Convertion time in minute

// Class template
class Schedule {
  // private id
  #id;

  constructor(information) {
    this.#id = Schedule.generateUniqId();
    this.title = information.title;
    this.description = information.description;
    this.timeDoing = information.timeDoing;
    this.category = information.category;
  }

  // fitur update data
  // ambil satu data yang sesuai dengan id yang ada, lalu edit elemen, kemudian buat array baru menggabungkan elemen yang telah di filter dengan elemen yang ada pada array sebelumnya dengan metode non mutating

  // fitur hapus data
  // ambil satu data yang sesuai dengan id yang ada, lalu hapus elemen yang sesuai yang ada pada array dengan metode slice atau non mutating lainnya

  // fitur mark as done
  // gunakan setter untuk mengganti status dari data schedule saat ini, hampir sama dengan update, kita harus melakukan filter terlebih dahulu, baru lah kita set data elemen pertama yang didapat

  // Generate unique id
  // When the instance of this class born, it will directly generate a unique id, because it called as value in private property id
  static generateUniqId() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueId;
    for (let i = 0; i < 20; i++) {
      // Generate uuid begin
      // Math random will run and always generate new random number, and the number will always rounded down with Math floor, and then the result will time with length of charcter
      // !! Math random always generate number in range 0 - 0.999
      uniqueId += characters.charAt(
        Math.floor(Math.random()) * characters.length,
      );
    }

    return uniqueId;
  }
}

class ManipulatedStorage {
  // Static function untuk menghapus semua data didalam array dan mengembalikan sisa waktu seperti semula
  static clearSchedule() {
    scheduleStroage = [];
  }
  // static function untuk melakukan sorting pada semua data yang ada pada array, entah itu berdasarkan category ataupun waktu pembuatan
  static sortingSchedule(sortingMethode) {
    scheduleStroage.toSorted(() => {});
  }
  // static function untuk menambahkan data schedule kedalam array storage
  static addSchedule(information) {
    // Create new instance from class schedule class
    const newSchedule = new Schedule(information);

    // Insert it as new element in scheduleStorage
    const updatedStorage = [...scheduleStroage, newSchedule];

    // Change refrence pointer array in Heap with new order element
    scheduleStroage = updatedStorage;
  }
}

// todo --------------------------- Frontend implementation
