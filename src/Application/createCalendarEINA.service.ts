import { Injectable } from "@nestjs/common";
import { CalendarEINARepository } from "../Domain/calendarEINA.repository";
import { PeriodsCalendarEINA, PeriodsCalendarEINAProps } from "../Domain/periodsCalendarEINA.value-object";
import { CalendarEINA } from "../Domain/calendarEINA.entity";

@Injectable()
export class CreateCalendarEINAService {
    constructor(
        private calendarEINARepository: CalendarEINARepository
    ) { }

    public async createCalendarEINA(periodsProps: PeriodsCalendarEINAProps, course: string, version: number): Promise<Boolean> {
        var periods = new PeriodsCalendarEINA(periodsProps);
        var calendarEINA = new CalendarEINA(null, course, version, periods);
        calendarEINA.fillDaysEINA();
        await this.calendarEINARepository.save(calendarEINA);
        return true;
    }
}



