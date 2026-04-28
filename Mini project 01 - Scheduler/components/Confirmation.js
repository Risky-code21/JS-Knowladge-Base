export default function Confirmation() {
  // return `<div class="p-6 bg-[#1e1f20] rounded-xl flex flex-col gap-4 max-w-md">
  //       <header class="flex items-center gap-4">
  //         <div
  //           class="size-12 rounded-lg bg-blue-950 border border-blue-600"
  //         ></div>
  //         <div class="flex flex-col gap-1">
  //           <h2 class="text-xl font-semibold">Konfrimasi</h2>
  //           <p class="text-gray-400">Cek konfrimasi bro</p>
  //         </div>
  //       </header>
  //       <p class="text-gray-300 leading-relaxed">
  //         Gagal terhubung ke server. Periksa koneksi internet kamu dan coba
  //         lagi. Jika masalah berlanjut, hubungi support kami.
  //       </p>

  //       <div class="flex justify-end gap-4 mt-4">
  //         <button
  //           data-option="false"
  //           class="bg-white/5 rounded-lg px-4 py-2 font-medium transition-all hover:bg-white/10 duration-200"
  //         >
  //           Batalkan
  //         </button>

  //         <button
  //           data-option="true"
  //           class="bg-blue-600 rounded-lg px-4 py-2 font-medium transition-all hover:-translate-y-1 hover:bg-blue-900 duration-200"
  //         >
  //           Konfirmasi
  //         </button>
  //       </div>
  //     </div>`;

  return `<div class="modal-primary hidden">
            <!-- Bar handler untuk swipe diperangkat mobile -->
            <div class="p-2 flex md:hidden handle-bar" tabindex="-1">
              <div class="w-12 h-2 bg-gray-600/50 rounded-full mx-auto mb-2"></div>
            </div>

            <!-- Alert icon box -->
            <div class="modal-icon-box h-auto p-6 w-fit text-orange-400 rounded-full ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-40"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <!-- Alert title and description -->
            <div class="flex flex-col items-center gap-1 px-4 text-center">
              <h4 class="font-semibold text-xl">Confirm Deletion</h4>
              <p class="text-sm">Are you sure you want to delete this schedule?</p>
            </div>

            <!-- Action button, to close or to accept -->
            <div class="flex flex-col md:flex-row gap-4 w-full">
              <button data-option="false" class="btn-primary w-full md:w-1/2">
                Close
              </button>
              <button
                data-option="true"
                class="btn-primary w-full md:w-1/2 text-green-400"
              >
                Accept
              </button>
            </div>
          </div>`;
}
