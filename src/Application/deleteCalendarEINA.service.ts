import { Injectable } from "@nestjs/common";
import { CalendarEINARepository } from "../Domain/calendarEINA.repository";
import { CalendarEINA } from "../Domain/calendarEINA.entity";

@Injectable()
export class DeleteCalendarEINAService {
    constructor(
        private calendarEINARepository: CalendarEINARepository
    ) { }

    public async deleteCalendarEINA(course: string, version: number): Promise<Boolean> {
        let calendar: CalendarEINA = await this.calendarEINARepository.findByCourseAndVersion(course, version);
        this.calendarEINARepository.deleteCalendarEINA(calendar);
        return true;
    }

}



