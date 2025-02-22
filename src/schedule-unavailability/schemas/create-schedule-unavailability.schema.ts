import * as JoiPipe from 'joi';

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export const createScheduleUnavailabilitySchema = JoiPipe.object({
  unavailabilityStartDatetime: JoiPipe.string()
    .pattern(datetimeRegex)
    .required()
    .not()
    .empty(),
  unavailabilityEndDatetime: JoiPipe.string()
    .pattern(datetimeRegex)
    .required()
    .not()
    .empty()
    .custom((value, helpers) => {
      const { unavailabilityStartDatetime } = helpers.state.ancestors[0]; // Get start datetime from the object
      if (!unavailabilityStartDatetime)
        return helpers.error('any.invalid', {
          message: 'unavailabilityStartDatetime must exist',
        });

      const startDate = new Date(unavailabilityStartDatetime);
      const endDate = new Date(value);

      if (endDate <= startDate) {
        return helpers.error('any.invalid', {
          message:
            'unavailabilityEndDatetime must be after unavailabilityStartDatetime',
        });
      }
      return value;
    }),
});
