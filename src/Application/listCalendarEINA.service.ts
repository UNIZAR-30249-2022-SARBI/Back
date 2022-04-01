import { Injectable } from "@nestjs/common";
import { CalendarEINARepository } from "../Domain/calendarEINA.repository";
import { CalendarEINAPeriod } from "../Domain/calendarEINA.entity";
import { DayEINA } from '../Domain/dayEINA.value-object';

@Injectable()
export class ListCalendarEINAService {
    constructor(
        private calendarEINARepository: CalendarEINARepository
    ) { }

    public async listCalendarEINA(course: string, version: number, period: CalendarEINAPeriod): Promise<Array<DayEINA>> {
        var calendar = await this.calendarEINARepository.findByCourseAndVersion(course, version);
        var daysEINA = new Array<DayEINA>();

        if (calendar) {
            daysEINA = await this.calendarEINARepository.findDaysByCalendarEINA(calendar);
            calendar.days = daysEINA;
            daysEINA = calendar.getDaysOfPeriod(period)
        }

        return daysEINA;
    }

}



