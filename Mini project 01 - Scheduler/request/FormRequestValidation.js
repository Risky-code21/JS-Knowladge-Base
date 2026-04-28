export default class ScheduleRequest {
  // Form validation sudah kini sudah diperbaki ✅
  // Form validation berfungsi untuk memeriksa kesesuaiaan nilai input yang diberikan oleh pengguna dengan nilai yang dibutuhkan untuk membuat atau mengupdate data dari jadwal yang sudah dibuat oleh pengguna sebelumnya
  // Form validation kini disertai komentar agar mudah dipelajari di masa depan, dan pemberian conditional untuk category, yang dimana jika pengguna ingin membuat category, pengguna harus memastikan category itu memiliki karakter dibawah atau sama dengan 12, tidak boleh lebih.
  static formValidation(formInputs) {
    // Membuat insialisasi object penampung errors yang akan dikembalikan untuk ditampilkan pada layar pengguna
    // Kosongkan key object agar proses checking key di controller tidak terus menghalangi eksekusi berikutnya
    const errors = {};

    // Pengecekan properti title atau nilai dari input title, agar memastikan bahwa input tidak kosong
    if (!formInputs.title || formInputs.title.trim() === "") {
      errors.title = "Title cannot be empty";
    }

    // Pengecekan tipe data, karena aku menggunakan tipe text pada input time doing, jadi harus dirubah dulu type datanya
    const timeDoing = Number(formInputs.timeDoing);

    // Pengecekan pada input time doing
    // Pengecekan pertama, mengecek apakah input time doing ini kosong atau tidak
    if (!formInputs.timeDoing || formInputs.timeDoing.trim() === "") {
      errors.timeDoing = "Time doing cannot be empty";
    }
    //  Pengecekan kedua, mengecek apakah input time doing ini berupa angka atau tidak
    else if (isNaN(timeDoing)) {
      errors.timeDoing = "Time doing must be a number";
    }

    // Pengecekan ketiga, menegcek apakah input time doing ini lebih kecil dari 0, misal pengguna iseng memasukan angka negatif, decimal atau angka unreal lainnya yang tidak masuk akal untuk sebuah input waktu
    else if (timeDoing <= 0) {
      errors.timeDoing = "Time doing must be more than 1 minute";
    }

    // Pengeckan pada input category
    // Pengecekan pertama, mengecek apakah input category kosong atau tidak
    if (!formInputs.category && formInputs.category.trim() === "") {
      errors.category = "Category cannot be empty";
    }
    // Pengecek kedua, mengecek apakah panjang karakter category melebihi batas maksimal karakter yaitu 12
    else if (formInputs.category.length > 12) {
      errors.category = "Maximum characters 12";
    }

    return errors;
  }
}
