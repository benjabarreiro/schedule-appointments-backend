export class CreateScheduleDto {
  name: string;
  description: string;
  ubrId: number;
  isActive: boolean;
  appointmentDuration: number;
  shiftStartTime: string;
  shiftEndTime: string;
}
