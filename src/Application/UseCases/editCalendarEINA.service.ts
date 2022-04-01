import { Inject } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CalendarEINARepository } from "../../Domain/CalendarEINA/calendarEINA.repository";
import { CalendarEINA } from "../../Domain/CalendarEINA/calendarEINA.entity";
import { DayEINA, DayEINAProps } from '../../Domain/CalendarEINA/dayEINA.value-object';

@Injectable()
export class EditCalendarEINAService {
    constructor(
        private calendarEINARepository: CalendarEINARepository
    ) { }

    public async editDayEINA(props: DayEINAProps, course:string, version:number): Promise<Boolean> {
        let dayEINA = new DayEINA(props);
        let calendar: CalendarEINA = await this.calendarEINARepository.findByCourseAndVersion(course, version);
        this.calendarEINARepository.editDayEINA(dayEINA, calendar);
        return true;
    }

}



