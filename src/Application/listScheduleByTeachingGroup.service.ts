import { Injectable } from "@nestjs/common";
import { TeachingGroupModel } from "src/Infrastructure/Models/teachingGroup.model";
import { Periodicity, ScheduleSlot } from "src/Domain/scheduleSlot.value-object";
import { GroupSubjectScheduleRepository } from "../Domain/groupSubjectSchedule.repository";
import { GroupSubjectSchedule } from "../Domain/groupSubjectSchedule.entity";

@Injectable()
export class ListScheduleByTeachingGroupService {
    constructor(
        private gSSRepository: GroupSubjectScheduleRepository
    ) { }

    public async list(code: string, period: string): Promise<Array<ScheduleSlot>>{
        try {
            let teachingGroup = await this.gSSRepository.findGroupByCodeAndPeriod(code, period);
            if (teachingGroup) {
                let slots = await this.gSSRepository.findSlotsByTeachingGroup(teachingGroup);
                return slots;
            }
            return null;
        } catch (err) {
            //console.error(err)
            return null;
        }
    }
}



