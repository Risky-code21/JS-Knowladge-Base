import { HelperData } from "../utils/Helper.js";

export default class Schedule {
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

  get secretIdentity() {
    return this.#id;
  }

  markAsDone() {
    this.status = "Done";
  }

  // Convert all property if that take by JSON format
  // Magic methode
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
