export default function Confirmation() {
  return `<div class="p-6 bg-[#1e1f20] rounded-xl flex flex-col gap-4 max-w-md">
        <header class="flex items-center gap-4">
          <div
            class="size-12 rounded-lg bg-blue-950 border border-blue-600"
          ></div>
          <div class="flex flex-col gap-1">
            <h2 class="text-xl font-semibold">Konfrimasi</h2>
            <p class="text-gray-400">Cek konfrimasi bro</p>
          </div>
        </header>
        <p class="text-gray-300 leading-relaxed">
          Gagal terhubung ke server. Periksa koneksi internet kamu dan coba
          lagi. Jika masalah berlanjut, hubungi support kami.
        </p>

        <div class="flex justify-end gap-4 mt-4">
          <button
            data-option="true"
            class="bg-white/5 rounded-lg px-4 py-2 font-medium transition-all hover:bg-white/10 duration-200"
          >
            Batalkan
          </button>

          <button
            data-option="false"
            class="bg-blue-600 rounded-lg px-4 py-2 font-medium transition-all hover:-translate-y-1 hover:bg-blue-900 duration-200"
          >
            Konfirmasi
          </button>
        </div>
      </div>`;
}
