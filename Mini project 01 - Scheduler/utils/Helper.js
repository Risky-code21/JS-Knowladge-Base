export const HelperData = {
  // Convertion date helper
  convertionDate: (date) => {
    const convDate = new Date(date).toLocaleString("en-EN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return convDate;
  },
};

export const HelperUI = {
  // Generate random category color
  // Refactor #6 memindahkan function generate color otomatis untuk category ini agar pemanggilan di preference main class lebih rapi
  generateUniqueColorCategory() {
    const baseOfColor = [
      {
        name: "blue",
        border: "border-blue-600",
        background: "bg-blue-200",
        text: "text-blue-600",
      },
      {
        name: "green",
        border: "border-green-600",
        background: "bg-green-200",
        text: "text-green-600",
      },
      {
        name: "orange",
        border: "border-orange-600",
        background: "bg-orange-200",
        text: "text-orange-600",
      },
    ];

    const selectedColor =
      baseOfColor[Math.floor(Math.random() * baseOfColor.length)];

    return selectedColor;
  },
};
