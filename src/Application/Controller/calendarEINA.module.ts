import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CalendarEINAController } from "./calendarEINA.controller";
import { DayEINAModel } from "../../Domain/CalendarEINA/dayEINA.model";
import { CalendarEINAFactory } from "../../Domain/CalendarEINA/calendarEINA.factory";
import { CreateCalendarEINAService } from "../UseCases/createCalendarEINA.service";
import { EditCalendarEINAService } from "../UseCases/editCalendarEINA.service";
import { CalendarEINARepository } from "../../Domain/CalendarEINA/calendarEINA.repository";
import { ListCalendarEINAService } from "../UseCases/listCalendarEINA.service";
import { DeleteCalendarEINAService } from "../UseCases/deleteCalendarEINA.service";


@Module({
    imports: [SequelizeModule.forFeature([DayEINAModel])],
    providers: [CreateCalendarEINAService, EditCalendarEINAService, CalendarEINAFactory, CalendarEINARepository, ListCalendarEINAService, DeleteCalendarEINAService],
    controllers: [CalendarEINAController]
})
export class CalendarEINAModule { }