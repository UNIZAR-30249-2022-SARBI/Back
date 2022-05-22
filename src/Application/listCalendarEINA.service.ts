import { Injectable } from "@nestjs/common";
import { CalendarEINARepository } from "../Domain/calendarEINA.repository";
import { CalendarEINA, PeriodCalendarEINA } from "../Domain/calendarEINA.entity";
import { DayEINA } from '../Domain/dayEINA.entity';
import { Period } from "../Domain/period.value-object";

@Injectable()
export class ListCalendarEINAService {
    constructor(
        private calendarEINARepository: CalendarEINARepository
    ) { }

    public async listCalendars(): Promise<Array<CalendarEINA>> {
        var arrayCalendars = await this.calendarEINARepository.findAll();
        return arrayCalendars;
    }

    public async listDaysEINA(course: string, version: number, period: PeriodCalendarEINA): Promise<Array<DayEINA>> {
        var calendar = await this.calendarEINARepository.findByCourseAndVersion(course, version);
        var daysEINA = new Array<DayEINA>();

        if (calendar) {
            daysEINA = await this.calendarEINARepository.findDaysByCalendarEINA(calendar);
            calendar.days = daysEINA;
            daysEINA = calendar.getDaysOfPeriod(period)
        }
        return daysEINA;
    }

    public async listPeriodsCalendarEINA(course: string, version: number): Promise<Map<PeriodCalendarEINA, Period>> {
        var periods = new Map<PeriodCalendarEINA, Period>();
        var calendar = await this.calendarEINARepository.findByCourseAndVersion(course, version);
        if (calendar) {
            periods = calendar.periods
        }
        return periods;
    }
}



