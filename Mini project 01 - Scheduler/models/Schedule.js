import { HelperData } from "../utils/Helper.js";

export default class Schedule {
  // Private methode
  #id;

  constructor(information) {
    // Refactor #3 menggunakan rando UUID dari cryptography untuk membuat unique id yang lebih aman, dan tentnya prosesnya lebih ngebut.
    this.#id = information.id || crypto.randomUUID();
    this.title = information.title;
    this.description = information.description;
    this.timeDoing = information.timeDoing;
    this.category = information.category;
    this.status = information.status || "On progress";
    this.createdAt =
      information.createdAt || HelperData.convertionDate(Date.now());
    this.preference = information.preference;
  }

  // Getter methode
  // Digunakan untuk mengambil properti private dari class ini
  get secretIdentity() {
    return this.#id;
  }

  // Mark as done
  // Digunakan untuk mengganti status dari yang defaultnya "On proggres" menjadi "Done" untuk menandai jadwal sebagai selesai
  markAsDone() {
    this.status == "Done"
      ? (this.status = "On progress")
      : (this.status = "Done");
    return this;
  }

  // Convert all property if that take by JSON format
  // Magic methode, setiap function JSON stringfy dipanggil, instance yang dijadikan data akan membuat object baru yang berisi pemetaan data baru sebagai berikut, ini memungkinkan kita untuk menjaga keberlangsungan ID lama yang telah dibuat sebelumnya dalam data
  toJSON() {
    return {
      // Cek keamanan id jika langsung di paparkan begitu saja di local storage
      id: this.secretIdentity,
      title: this.title,
      description: this.description,
      timeDoing: this.timeDoing,
      category: this.category,
      status: this.status,
      createdAt: this.createdAt,
      preference: this.preference,
    };
  }
}
