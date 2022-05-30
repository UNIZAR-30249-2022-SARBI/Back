import { Injectable } from "@nestjs/common";
import { CalendarEINARepository } from "../Domain/calendarEINA.repository";
import { Period, PeriodProps } from "../Domain/period.value-object";
import { CalendarEINA, PeriodCalendarEINA } from "../Domain/calendarEINA.entity";
import { addOneDay, addWeek, dateBetween, getUTCDate, sortByDate, TOTALWEEKDAY } from "../Domain/dateUtils";
import { DayEINA, DayEINAState, WeekDay, WeekLetter } from '../Domain/dayEINA.entity';
import { GroupSubjectScheduleRepository } from "src/Domain/groupSubjectSchedule.repository";
import { GroupSubjectSchedule } from "src/Domain/groupSubjectSchedule.entity";
import { TeachingGroupModel } from "src/Infrastructure/Models/teachingGroup.model";
import { ScheduleSlot } from "src/Domain/scheduleSlot.value-object";

@Injectable()
export class createScheduleService {
    constructor(
        private groupSubjectScheduleRepository: GroupSubjectScheduleRepository) { }

    public async createSchedule(groupType: string, groupNumber: number, teachingGroup: TeachingGroupModel, subjectIds: string[], scheduleSlots: ScheduleSlot[]): Promise<Boolean> {
        try {
            var schedule = new GroupSubjectSchedule(null, groupType, groupNumber, teachingGroup, subjectIds, scheduleSlots);
            let result = await this.groupSubjectScheduleRepository.save(schedule);
            return result ? true : false;

        } catch (err) {
            //console.error(err)
            return false
        }
    }
}



