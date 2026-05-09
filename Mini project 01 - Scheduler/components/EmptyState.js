export default function EmptyState(message) {
  return `<div
            class="bg-primary col-span-full w-full mx-auto text-center p-8 flex flex-col gap-4 justify-center items-center rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.02)]" aria-label="empty data warning for selected states"
          >
            <!-- Icon empty state -->
            <div class="neumorph-raised h-auto p-6 w-fit  rounded-full" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-40"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>

            <!-- Message empty state -->
            <div class="flex flex-col gap-2">
              <h3>Empty schedule data warning!</h3>
              <p>${message || "There are no schedules available for this status."}</p>
            </div>

            <!-- Button create -->
            <button class="btn-primary btn-create" type="button">
              <!-- Icon button -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-4"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                  clip-rule="evenodd"
                />
              </svg>

              <span>Create</span>
            </button>
          </div>`;
}
