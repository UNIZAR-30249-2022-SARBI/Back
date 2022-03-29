import { Injectable } from "@nestjs/common";
import { CalendarEINAPeriod } from "../../Domain/CalendarEINA/calendarEINA.entity";
import { CalendarEINAFactory } from "../../Domain/CalendarEINA/calendarEINA.factory";
import { CalendarEINARepository } from "../../Domain/CalendarEINA/calendarEINA.repository";
import { PeriodsCalendarEINA } from "../Controller/calendarEINA.types";

@Injectable()
export class CreateCalendarEINAService {
    constructor(
        private calendarEINAFactory: CalendarEINAFactory,
        private calendarEINARepository: CalendarEINARepository
    ) { }

    public async createCalendarEINA(periods: PeriodsCalendarEINA): Promise<Boolean> {
        const iniCourseYear = new Date(periods.startFirstSemester).getFullYear();
        var calendar = this.calendarEINAFactory.create(CalendarEINAPeriod.FIRST_QUARTER, periods.startFirstSemester, periods.endFirstSemester, iniCourseYear);
        await this.calendarEINARepository.add(calendar);
        calendar = this.calendarEINAFactory.create(CalendarEINAPeriod.SECOND_QUARTER, periods.startSecondSemester, periods.endSecondSemester, iniCourseYear);
        await this.calendarEINARepository.add(calendar);
        calendar = this.calendarEINAFactory.create(CalendarEINAPeriod.SECOND_CONVOCATORY, periods.startSecondConvocatory, periods.endSecondConvocatory, iniCourseYear);
        await this.calendarEINARepository.add(calendar);
        return true;
    }

}



