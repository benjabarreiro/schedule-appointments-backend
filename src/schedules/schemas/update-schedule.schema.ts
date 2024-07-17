import * as JoiPipe from 'joi';

export const updateScheduleschema = JoiPipe.object({
  name: JoiPipe.string().optional(),
  description: JoiPipe.string().optional(),
  employeeId: JoiPipe.number().optional(),
});
