import CheckedIcon from "./Icons/CheckedIcon.js";
import ErrorIcon from "./Icons/ErrorIcon.js";

const uiFragmentBase = {
  success: {
    icon: CheckedIcon(20),
    defaultHeadingText: "Berhasil memperbarui data yang kamu buat",
    defaultMessage:
      "Data berhasil dirubah, silahkan kembali untuk melihat perubahan",
  },
  error: {
    icon: ErrorIcon(20),
    defaultHeadingText: "Maaf, ada masalah!",
    defaultMessage: "Terjadi kesalahan pada proses yang anda lakukan",
  },
  warning: {
    icon: ErrorIcon(),
    defaultHeadingText: "Waspada, sistem bisa terbobol!",
    defaultMessage: "Pastikan kamu sudah yakin untuk menghapus data ini",
  },
};

export default function AlertError(
  type = "success",
  headingText = "",
  message = [],
) {
  const fragmentSelected = uiFragmentBase[type];

  return `<div
        class="bg-[#1e1f20] p-6 flex flex-col justify-center items-center rounded-xl max-w-md space-y-4"
      >
      ${fragmentSelected.icon}
        <header
          class="flex flex-col items-center justify-center gap-4 text-center"
        >
          <h2 class="text-2xl font-semibold">${headingText ? headingText : fragmentSelected.defaultHeadingText}</h2>
        </header>

        <div class="space-y-2 p-4 bg-black/30 rounded-lg pb-6">
          <p></p>
          <ul class="list-disc px-4">
          ${
            message.length > 0
              ? message.map((text) => text)
              : fragmentSelected.defaultMessage
          }
          </ul>
        </div>
      </div>`;
}
