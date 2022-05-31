import { Injectable } from "@nestjs/common";
import { TeachingGroupModel } from "src/Infrastructure/Models/teachingGroup.model";
import { ScheduleSlot } from "src/Domain/scheduleSlot.value-object";
import { GroupSubjectScheduleRepository } from "../Domain/groupSubjectSchedule.repository";

@Injectable()
export class CreateScheduleService {
    constructor(
        private groupSubjectScheduleRepository: GroupSubjectScheduleRepository) { }

    public async createSchedule(groupType: string, groupNumber: number, teachingGroup: TeachingGroupModel, subjectIds: string[], scheduleSlots: ScheduleSlot[]): Promise<Boolean> {
        try {
           // var schedule = new GroupSubjectSchedule(null, groupType, groupNumber, teachingGroup, subjectIds, scheduleSlots);
            //let result = await this.groupSubjectScheduleRepository.save(schedule);
            //return result ? true : false;

        } catch (err) {
            //console.error(err)
            return false
        }
    }
}



