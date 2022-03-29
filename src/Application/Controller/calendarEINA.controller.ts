import { DayEINAModel } from "../../Domain/CalendarEINA/dayEINA.model";
import { CalendarEINAService } from "../UseCases/calendarEINA.service";
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
import { PeriodsCalendarEINA } from "./calendarEINA.types";
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
    public async createDayEINA(@Payload() periods: PeriodsCalendarEINA, @Ctx() context: RmqContext): Promise<Boolean> {
       // console.log("received", JSON.stringify(periods))
        const isCreated = await this.createCalendarEINAService.createCalendarEINA(periods);
        this.respond(context);
        return isCreated;
    }
    @MessagePattern('listPeriodCalendarEINA')
    public async findById(@Payload() data: any, @Ctx() context: RmqContext): Promise<Array<DayEINA>> {
        const days = await this.listCalendarEINAService.listCalendarEINA(data.year, data.period);
        this.respond(context);
        console.log("Sending    "+ JSON.stringify(days))
        return days;
    }
    @MessagePattern('deleteCalendarEINA')
    public async delete(@Payload() year: any, @Ctx() context: RmqContext): Promise<Boolean> {
        console.log("Sending    " + JSON.stringify(year));

        const isDeleted = await this.deleteCalendarEINAService.deleteCalendarEINA(year);  
        this.respond(context);
        console.log("Sending    " + JSON.stringify(isDeleted));
        return isDeleted;
    }
    @MessagePattern('editDayEINA')
    public async edit(@Payload() data: DayEINAProps, @Ctx() context: RmqContext): Promise<Boolean> {
        console.log("Sending    " + JSON.stringify(data));
        const isEdited = await this.editCalendarEINAService.editDayEINA(data);
        this.respond(context);
        console.log("Sending    " + JSON.stringify(isEdited));
        return isEdited;
    }
    /*
    @MessagePattern('fetchAll')
    public async fetchAll(@Payload() data: any, @Ctx() context: RmqContext): Promise<string[]> {
        const days = await this.calendarEINAService.findAll();
        this.respond(context);
        return days.map(day => { return day.toJSON();});
    }

    @MessagePattern('findById')
    public async findById(@Payload() data: any, @Ctx() context: RmqContext): Promise<string> {
        const day = await this.calendarEINAService.findOne(data.id);
        this.respond(context);
        return day.toJSON();
    }
    */
    private respond(@Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();
        channel.ack(orginalMessage);
    }
}