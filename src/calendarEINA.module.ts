import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CalendarEINAController } from "./Infrastructure/Controllers/calendarEINA.controller";
import { DayEINAModel } from "./Infrastructure/Models/dayEINA.model";
import { CreateCalendarEINAService } from "./Application/createCalendarEINA.service";
import { EditCalendarEINAService } from "./Application/editCalendarEINA.service";
import { CalendarEINARepository } from "./Domain/calendarEINA.repository";
import { ListCalendarEINAService } from "./Application/listCalendarEINA.service";
import { DeleteCalendarEINAService } from "./Application/deleteCalendarEINA.service";
import { CalendarEINAModel } from "./Infrastructure/Models/calendarEINA.model";


@Module({
    imports: [SequelizeModule.forFeature([DayEINAModel, CalendarEINAModel])],
    providers: [CreateCalendarEINAService, EditCalendarEINAService, CalendarEINARepository, ListCalendarEINAService, DeleteCalendarEINAService],
    controllers: [CalendarEINAController]
})
export class CalendarEINAModule { }