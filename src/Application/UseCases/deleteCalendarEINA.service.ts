import { Injectable } from "@nestjs/common";
import { CalendarEINARepository } from "../../Domain/CalendarEINA/calendarEINA.repository";

@Injectable()
export class DeleteCalendarEINAService {
    constructor(
        private calendarEINARepository: CalendarEINARepository
    ) { }

    public async deleteCalendarEINA(initCourseYear:number): Promise<Boolean> {
        this.calendarEINARepository.delete(initCourseYear);
        return true;
    }

}



