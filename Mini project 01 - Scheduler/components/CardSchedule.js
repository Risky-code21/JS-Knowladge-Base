export default function CardSchedule(informationCard) {
  let preferenceCard = informationCard.preference.categoryPreference;
  return `<article
            id="${informationCard.secretIdentity}"
            class="max-w-full rounded-md bg-[#1e1f20] border border-[#e3e3e3]/10"
            aria-labelledby="title-${informationCard.title}"
          >
            <!-- Header card schedule -->
            <header
              class="flex justify-between items-center p-4 border-b border-[#e3e3e3]/10 font-semibold"
            >
              <p
                class="border ${preferenceCard.border} rounded-full ${preferenceCard.text} ${preferenceCard.background} px-4 py-1"
              >
                ${informationCard.category}
              </p>
              <p aria-label="Estimation time doing: 120 minutes">${informationCard.timeDoing} Minutes</p>
            </header>

            <!-- Main content of card -->
            <div class="p-4 border-b border-[#e3e3e3]/10">
              <!-- Title -->
              <!-- !! Update, use h1 element once in our html file, in sub elemen use smaller heading then h1, lika: h2, h3, and soon -->
              <h2 class="text-2xl font-semibold mb-2" id="title-${informationCard.id}">
                ${informationCard.title}
              </h2>
              <!-- Description -->
              <p>
              ${informationCard.description}
              </p>
            </div>

            <!-- Footer card -->
            <footer class="p-4 flex justify-between items-center">
              <!-- Day created -->
              <!-- !! Update, use time for text that represent a date, or spesific time -->
              <time datetime="2026-04-03" class="text-sm opacity-40"
                >${informationCard.createdAt}</time
              >

              <!-- CTA container -->
              <div class="flex gap-2">
                <!-- Button delete -->
                <button
                  class="cursor-pointer p-2 border border-red-600 rounded-full text-red-600 bg-red-200 text-sm"
                  aria-label="Delete schedule button trigger"
                  title="Delete this schedule"
                  data-card-delete="${informationCard.secretIdentity}"
                >
                  <!-- Trash icon for the button -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-4"
                    id="trash-icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>

                <!-- Button edit -->
                <button
                  class="cursor-pointer p-2 border border-blue-600 rounded-full text-blue-600 bg-blue-200 text-sm"
                  aria-label="Edit schedule button trigger"
                  title="Edit this schedule"
                  data-card-edit="${informationCard.secretIdentity}"
                >
                  <!-- Pencil icon for the button -->
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

                <!-- Render conditional mark and unmark button -->
                ${conditionalButton(informationCard.status, informationCard.secretIdentity)}
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
