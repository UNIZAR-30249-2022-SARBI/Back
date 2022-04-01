import { Injectable } from "@nestjs/common";
import { CalendarEINARepository } from "../Domain/calendarEINA.repository";
import { CalendarEINA } from "../Domain/calendarEINA.entity";
import { DayEINA, DayEINAProps } from '../Domain/dayEINA.value-object';

@Injectable()
export class EditCalendarEINAService {
    constructor(
        private calendarEINARepository: CalendarEINARepository
    ) { }

    public async editDayEINA(props: DayEINAProps, course:string, version:number): Promise<Boolean> {
        let dayEINA = new DayEINA(props);
        let calendar: CalendarEINA = await this.calendarEINARepository.findByCourseAndVersion(course, version);
        this.calendarEINARepository.saveDayInCalendar(dayEINA, calendar);
        return true;
    }

}



