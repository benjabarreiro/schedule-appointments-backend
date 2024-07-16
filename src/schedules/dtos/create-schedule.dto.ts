import { UpdateScheduleDto } from './update-schedule.dto';

export class CreateScheduleDto extends UpdateScheduleDto {
  businessId: number;
}
