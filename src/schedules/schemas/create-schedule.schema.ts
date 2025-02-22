import * as JoiPipe from 'joi';

const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const createScheduleschema = JoiPipe.object({
  name: JoiPipe.string().required().not().empty(),
  description: JoiPipe.string(),
  ubrId: JoiPipe.number().required().not().empty(),
  isActive: JoiPipe.boolean().required().not().empty(),
  appointmentDuration: JoiPipe.number().required().not().empty(),
  shiftStartTime: JoiPipe.string()
    .pattern(timeFormatRegex)
    .required()
    .not()
    .empty(),
  shiftEndTime: JoiPipe.string()
    .pattern(timeFormatRegex)
    .required()
    .not()
    .empty(),
});
