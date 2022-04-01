import { Controller } from '@nestjs/common';
import {
    MessagePattern,
    RmqContext,
    Ctx,
    Payload,
} from '@nestjs/microservices';
import { EditCalendarEINAService } from "../UseCases/editCalendarEINA.service";
import { CreateCalendarEINAService } from "../UseCases/createCalendarEINA.service";
import { ListCalendarEINAService } from "../UseCases/listCalendarEINA.service";
import { DayEINA, DayEINAProps } from "../../Domain/CalendarEINA/dayEINA.value-object";
import { DeleteCalendarEINAService } from "../UseCases/deleteCalendarEINA.service";

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
        const isCreated = await this.createCalendarEINAService.createCalendarEINA(data.periods, data.course, data.version);
        this.respond(context);
        return isCreated; 
    } 

    @MessagePattern('listPeriodCalendarEINA')
    public async findById(@Payload() data: any, @Ctx() context: RmqContext): Promise<Array<DayEINA>> {
        const days = await this.listCalendarEINAService.listCalendarEINA(data.course, data.version, data.period);
        this.respond(context);
        return days;
    }

    @MessagePattern('deleteCalendarEINA')
    public async delete(@Payload() data: any, @Ctx() context: RmqContext): Promise<Boolean> {
        const isDeleted = await this.deleteCalendarEINAService.deleteCalendarEINA(data.course, data.version);  
        this.respond(context);
        return isDeleted;
    }

    @MessagePattern('editDayEINA')
    public async edit(@Payload() data: any, @Ctx() context: RmqContext): Promise<Boolean> {
        const isEdited = await this.editCalendarEINAService.editDayEINA(data.day, data.course, data.version);
        this.respond(context);
        return isEdited;
    }

    private respond(@Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();
        channel.ack(orginalMessage);
    }
}
