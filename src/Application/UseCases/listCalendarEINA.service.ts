import { Injectable } from "@nestjs/common";
import { CalendarEINARepository } from "../../Domain/CalendarEINA/calendarEINA.repository";
import { CalendarEINAPeriod } from "../../Domain/CalendarEINA/calendarEINA.entity";
import { DayEINA } from '../../Domain/CalendarEINA/dayEINA.value-object';

@Injectable()
export class ListCalendarEINAService {
    constructor(
        private calendarEINARepository: CalendarEINARepository
    ) { }

    public async listCalendarEINA(iniCourseYear: number, period: CalendarEINAPeriod): Promise<Array<DayEINA>> {
        var calendar = await this.calendarEINARepository.findByIniYearAndPeriod(iniCourseYear, period);
        return calendar.getDays();
    }

}



