import { HelperData } from "../utils/Helper.js";

export default function CardSchedule(informationCard) {
  let preferenceCard = informationCard.preference.categoryPreference;
  return `  <article
    class="card-container"
    id="${informationCard.secretIdentity}"
    aria-labelledby="title-${informationCard.title}"
  >
    <!-- Header -->
    <header
      class="p-4 border-b border-white/[0.1] flex justify-between items-center"
    >
      <p class="card-category">${informationCard.category}</p>
      <p class="inline-flex gap-2 place-items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
            clip-rule="evenodd"
          />
        </svg>

        <span>${informationCard.formattedTime}</span>
      </p>
    </header>

    <!-- Content -->
    <div class="p-4 pb-6">
      <h3 class="w-full truncate">${informationCard.title}</h3>
      <p class="w-full">${informationCard.description}</p>
    </div>

    <!-- Footer -->
    <footer
      class="p-4 border-t border-white/[0.1] flex justify-between items-center"
    >
      <!-- Created at -->
      <p class="inline-flex gap-2 place-items-center">
        <span>${HelperData.convertionDate(informationCard.createdAt)}</span>
      </p>

      <!-- Action buttons -->
      <div class="inline-flex gap-2 place-items-center">
        <!-- Button delete -->
        <button
          class="btn-primary rounded-full p-4 text-red-400"
          data-card-delete="${informationCard.secretIdentity}"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-4"
          >
            <path
              fill-rule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <!-- Button update -->
        <button
          class="btn-primary rounded-full p-4 text-blue-400"
          data-card-edit="${informationCard.secretIdentity}"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-4"
          >
            <path
              d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z"
            />
          </svg>
        </button>

        <!-- Button mark as done -->
        <button
          class="btn-primary rounded-full p-4 text-green-400"
          data-card-mark="${informationCard.secretIdentity}"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-4"
          >
            <path
              fill-rule="evenodd"
              d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </footer>
  </article>`;
}

function conditionalButton(cardStatus, identity) {
  if (cardStatus == "On progress") {
    return ` <button
                  class="cursor-pointer p-2 border border-green-600 rounded-full text-green-600 bg-green-200 text-sm"
                  aria-label="Mark as done schedule button trigger"
                  title="Mark as done this schedule"
                  data-card-mark="${identity}"
                >
                  <!-- Check icon fot the button -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-4"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>`;
  } else {
    return ` <button
                  class="cursor-pointer p-2 border border-orange-600 rounded-full text-orange-600 bg-orange-200 text-sm"
                  aria-label="Mark as done schedule button trigger"
                  title="Mark as undone this schedule"
                  data-card-unmark="${identity}"
                >
                  <!-- Check icon fot the button -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-4"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>`;
  }
}
