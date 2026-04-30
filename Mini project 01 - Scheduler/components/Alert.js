import CheckedIcon from "./Icons/CheckedIcon.js";
import ErrorIcon from "./Icons/ErrorIcon.js";

// Merupakan object yang akan digunakan ketika pesan yang dikirim dari si pemanggil function ini tidak diberikan secara eksplisit, atau dengan kata ganti yang lebih mudahnya, ini adalah fallback pesan agar pesan tidak benar-benar kosong saat pesan tidak diberikan.
const uiFallbackBase = {
  success: {
    icon: CheckedIcon("size-40 text-green-400"),
    defaultHeadingText: "The process was successful",
    defaultMessage: "The process was successfully executed smoothly",
  },
  error: {
    icon: ErrorIcon("size-40 text-red-400"),
    defaultHeadingText: "Sorry, there's a problem!",
    defaultMessage:
      "An Sorry, there's a problem!the process you were carrying out",
  },
};

// Alert error kini menggunakan param destructuring agar bisa memberikan custon value pada nilai object yang kosong, seperti pada type
export default function Alert({
  type = "success",
  headingText,
  message,
  buttonText,
} = {}) {
  // Gunakan object sebelumnya sesuai type dari alert yang dipilih, defaultnya adalah alert success, yang artinya variable ini akan memiliki refrensi nilai dari object pada properti success nantinya
  const fragmentSelected = uiFallbackBase[type];

  // Fragment penyusun informasi yang akan disimpan didalam alert
  // Menggunakan param null coelishing, untuk memastikan nilai default hanya diberikan jika nilai param kosong
  const title = headingText ?? fragmentSelected.defaultHeadingText;
  const desc = message ?? fragmentSelected.defaultMessage;
  const isButtonShow = Boolean(buttonText);

  return `<div class="modal-primary hidden">
    <!-- Alert icon box -->
    <div class="modal-icon-box p-6 rounded-full">
      ${fragmentSelected.icon}
    </div>

    <!-- Alert title and description -->
    <div class="flex flex-col items-center gap-2 px-4 text-center">
      <!-- Title -->
      <h3 class="font-semibold text-lg md:text-xl">${title}</h3>

      <!-- Description -->
      <p class="text-sm">${desc}</p>
    </div>

    <!-- Button to close -->
    <button class="btn-primary w-full alert-show-off ${isButtonShow ? "inline-flex" : "hidden"}">${buttonText}</button>
  </div>`;
}
