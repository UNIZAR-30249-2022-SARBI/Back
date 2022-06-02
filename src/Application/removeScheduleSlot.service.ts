import { Injectable } from "@nestjs/common";
import { Periodicity, ScheduleSlot, ScheduleSlotProps } from "src/Domain/scheduleSlot.value-object";
import { GroupSubjectScheduleRepository } from "../Domain/groupSubjectSchedule.repository";
import { GroupSubjectSchedule } from "../Domain/groupSubjectSchedule.entity";

@Injectable()
export class RemoveScheduleSlotService {
    constructor(
        private gSSRepository: GroupSubjectScheduleRepository
    ) { }

    public async removeScheduleSlot(code: string, period: string, subjectId: string, groupType: string, groupNumber: number, slotProps: ScheduleSlotProps): Promise<Boolean> {
        try {
            let teachingGroup = await this.gSSRepository.findGroupByCodeAndPeriod(code, period);
            if (teachingGroup) {
                let groupSubject = new GroupSubjectSchedule(null, groupType, groupNumber, teachingGroup, subjectId, null);

                let slot = new ScheduleSlot(slotProps.startHour, slotProps.endHour, slotProps.weekDay, slotProps.periodicity as Periodicity, slotProps.location);
                let foundSchedule = await this.gSSRepository.findByGroupSubjectSchedule(groupSubject)

                if (foundSchedule) {
                    foundSchedule.removeSlot(slot);
                    await this.gSSRepository.save(foundSchedule);
                    return true;
                }
                return false;
            }
            return false;
        } catch (err) {
            //console.error(err)
            return false
        }
    }
}



