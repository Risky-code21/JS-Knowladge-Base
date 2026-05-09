export default function EmptyState(message) {
  return `<div
            class="bg-primary col-span-full w-full mx-auto text-center p-8 flex flex-col gap-2 justify-center items-center rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.02)]" aria-label="empty data warning for selected states"
          >
            <!-- Icon empty state -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-36"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <!-- Message empty state -->
            <p>${message || "There are no schedules available for this status."}</p>
          </div>`;
}
