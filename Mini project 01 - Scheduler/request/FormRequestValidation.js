export default class ScheduleRequest {
  static formValidation(formInputs) {
    const errors = {};

    if (!formInputs.title || formInputs.title.trim() === "") {
      errors.title = "Title cannot be empty";
    }

    const timeDoing = Number(formInputs.timeDoing);

    if (!formInputs.timeDoing || formInputs.timeDoing.trim() === "") {
      errors.timeDoing = "Time doing cannot be empty";
    } else if (isNaN(timeDoing)) {
      errors.timeDoing = "Time doing must be a number";
    } else if (timeDoing <= 0) {
      errors.timeDoing = "Time doing must be more than 1 minute";
    }

    return errors;
  }
}
