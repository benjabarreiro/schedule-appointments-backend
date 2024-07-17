import * as JoiPipe from 'joi';

export const createScheduleschema = JoiPipe.object({
  name: JoiPipe.string().required().not().empty(),
  description: JoiPipe.string(),
  employeeId: JoiPipe.number().required().not().empty(),
  businessId: JoiPipe.number().required().not().empty(),
});
