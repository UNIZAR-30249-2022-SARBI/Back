import { Injectable } from "@nestjs/common";
import { CalendarEINA } from "../../Domain/CalendarEINA/calendarEINA.entity";
import { CalendarEINARepository } from "../../Domain/CalendarEINA/calendarEINA.repository";
import { PeriodsCalendarEINA, PeriodsCalendarEINAProps } from "../../Domain/CalendarEINA/periodsCalendarEINA.value-object";

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



