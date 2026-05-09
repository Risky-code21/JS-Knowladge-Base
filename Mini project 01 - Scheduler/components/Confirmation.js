export default function Confirmation() {
  return `<section role="dialog" aria-modal="true" aria-labelledby="conf-title" aria-describedby="conf-desc" class="modal-primary hidden">
            <div class="p-2 w-full flex md:hidden handle-bar" role="button" aria-label="swipe bar to close bottom sheets">
              <div class="w-12 h-2 bg-gray-600/50 rounded-full mx-auto mb-2"></div>
            </div>

            <div class="modal-icon-box h-auto p-6 w-fit text-orange-400 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-40"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <div class="flex flex-col items-center gap-1 px-4 text-center">
              <h2 id="conf-title" class="font-semibold text-xl">Confirm Deletion</h2>
              <p id="conf-desc" class="text-sm">Are you sure you want to delete this schedule?</p>
            </div>

            <div class="flex flex-col md:flex-row gap-4 w-full">
              <button type="button" data-option="false" class="btn-primary w-full md:w-1/2">
                Close
              </button>
              <button
                type="button"
                data-option="true"
                class="btn-primary w-full md:w-1/2 text-green-400"
              >
                Accept
              </button>
            </div>
          </section>`;
}
