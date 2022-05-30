import { Controller } from '@nestjs/common';
import {
    MessagePattern,
    RmqContext,
    Ctx,
    Payload,
} from '@nestjs/microservices';
import { Period } from '../../Domain/period.value-object';
import { CalendarEINA, PeriodCalendarEINA } from '../../Domain/calendarEINA.entity';
import { respond } from './rabbitmq';
import { createScheduleService } from 'src/Application/createSchedule.service';

@Controller()
export class GroupSubjectScheduleController {
    constructor(
        private readonly createScheduleService: createScheduleService,
    ) { }

    @MessagePattern('createSchedule')
    public async createSchedule(@Payload() data: any, @Ctx() context: RmqContext): Promise<Boolean> {
        const isCreated = await this.createScheduleService.createSchedule(data.groupType, data.groupNumber, data.teachingGroup, data.subjectIds, data.scheduleSlots);
        respond(context);
        return isCreated; 
    } 
}