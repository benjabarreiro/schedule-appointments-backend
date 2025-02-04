import * as JoiPipe from 'joi';

export const createScheduleschema = JoiPipe.object({
  name: JoiPipe.string().required().not().empty(),
  description: JoiPipe.string(),
  ubrId: JoiPipe.number().required().not().empty(),
  isActive: JoiPipe.boolean().required().not().empty(),
});
