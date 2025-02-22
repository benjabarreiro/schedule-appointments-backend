import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { ScheduleUnavailability } from './schedule-unavailability.entity';

@Injectable()
export class ScheduleUnavailabilityService {
  private scheduleUnavailabilityRepository: Repository<ScheduleUnavailability>;
  constructor(private readonly connection: Connection) {
    this.scheduleUnavailabilityRepository = connection.getRepository(
      ScheduleUnavailability,
    );
  }
  async createScheduleUnavailability(scheduleId: number, body) {
    try {
      const newScheduleUnavailability =
        await this.scheduleUnavailabilityRepository.create({
          unavailability_start_datetime: body.unavailabilityStartDatetime,
          unavailability_end_datetime: body.unavailabilityEndDatetime,
          schedule: { id: scheduleId },
        });
      await this.scheduleUnavailabilityRepository.save(
        newScheduleUnavailability,
      );

      return 'Schedule created succesfully';
    } catch (err) {
      throw err;
    }
  }
}
