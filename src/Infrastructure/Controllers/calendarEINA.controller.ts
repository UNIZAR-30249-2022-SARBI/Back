import { Controller } from '@nestjs/common';
import {
    MessagePattern,
    RmqContext,
    Ctx,
    Payload,
} from '@nestjs/microservices';
import { EditCalendarEINAService } from "../../Application/editCalendarEINA.service";
import { CreateCalendarEINAService } from "../../Application/createCalendarEINA.service";
import { ListCalendarEINAService } from "../../Application/listCalendarEINA.service";
import { DayEINA, DayEINAProps } from "../../Domain/dayEINA.entity";
import { DeleteCalendarEINAService } from "../../Application/deleteCalendarEINA.service";
import { Period } from '../../Domain/period.value-object';
import { CalendarEINA, PeriodCalendarEINA } from '../../Domain/calendarEINA.entity';
import { respond } from './rabbitmq';

@Controller()
export class CalendarEINAController {
    constructor(
        private readonly editCalendarEINAService: EditCalendarEINAService,
        private readonly createCalendarEINAService: CreateCalendarEINAService,
        private readonly listCalendarEINAService: ListCalendarEINAService,
        private readonly deleteCalendarEINAService: DeleteCalendarEINAService,
    ) { }

    @MessagePattern('createCalendarEINA')
    public async createDayEINA(@Payload() data: any, @Ctx() context: RmqContext): Promise<Boolean> {
        var isCreated
        if(data.periods)
            isCreated = await this.createCalendarEINAService.createCalendarEINA(data.periods.firstSemester, data.periods.secondSemester, data.periods.secondConvocatory, data.course, data.version);
        else
            isCreated = await this.createCalendarEINAService.createCalendarEINA(null, null, null, data.course, data.version);
        respond(context);
        return isCreated; 
    } 

    @MessagePattern('listAllCalendars')
    public async findAllCalendars(@Payload() data: any, @Ctx() context: RmqContext): Promise<Array<CalendarEINA>> {
        const calendars = await this.listCalendarEINAService.listCalendars();
        respond(context);
        return calendars;
    }

    @MessagePattern('listDaysByPeriodCalendarEINA')
    public async findDaysByPeriod(@Payload() data: any, @Ctx() context: RmqContext): Promise<Array<DayEINA>> {
        const days = await this.listCalendarEINAService.listDaysEINA(data.course, data.version, data.period);
        respond(context);
        return days;
    }

    @MessagePattern('listPeriodCalendarEINA')
    public async findByPeriods(@Payload() data: any, @Ctx() context: RmqContext): Promise<Array<Period>> {
        const periods = await this.listCalendarEINAService.listPeriodsCalendarEINA(data.course, data.version);
        respond(context);
        return Array.from(periods, ([name, value]) => ( value ));
    }
     
    @MessagePattern('deleteCalendarEINA')
    public async delete(@Payload() data: any, @Ctx() context: RmqContext): Promise<Boolean> {
        const isDeleted = await this.deleteCalendarEINAService.deleteCalendarEINA(data.course, data.version);  
        respond(context);
        return isDeleted;
    }

    @MessagePattern('editCalendarEINA')
    public async editPeriods(@Payload() data: any, @Ctx() context: RmqContext): Promise<Boolean> {
        const isEdited = await this.editCalendarEINAService.editCalenarEINA(data.periods.firstSemester, data.periods.secondSemester, data.periods.secondConvocatory, data.course, data.version);
        respond(context);
        return isEdited;
    }
    @MessagePattern('editDayEINA')
    public async editDayEINA(@Payload() data: any, @Ctx() context: RmqContext): Promise<Boolean> {
        const isEdited = await this.editCalendarEINAService.editDayEINA(data.day, data.course, data.version);
        respond(context);
        return isEdited;
    }
}
