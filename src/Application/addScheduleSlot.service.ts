import { Injectable } from "@nestjs/common";
import { TeachingGroupModel } from "src/Infrastructure/Models/teachingGroup.model";
import { Periodicity, ScheduleSlot, ScheduleSlotProps } from "src/Domain/scheduleSlot.value-object";
import { GroupSubjectScheduleRepository } from "../Domain/groupSubjectSchedule.repository";
import { GroupSubjectSchedule } from "../Domain/groupSubjectSchedule.entity";

@Injectable()
export class AddScheduleSlotService {
    constructor(
        private gSSRepository: GroupSubjectScheduleRepository
    ) { }

    public async addScheduleSlot(code: string, period: string, subjectId: string, groupType: string, groupNumber: number, slotProps: ScheduleSlotProps): Promise<Boolean> {
        try {
            let teachingGroup = await this.gSSRepository.findGroupByCodeAndPeriod(code, period);
            if (teachingGroup) {
                console.log("TEACHING", teachingGroup)
                let groupSubject = new GroupSubjectSchedule(null, groupType, groupNumber, teachingGroup, subjectId, null);
                let slot = new ScheduleSlot(slotProps.startHour, slotProps.endHour, slotProps.weekDay, slotProps.periodicity as Periodicity, slotProps.location);
                console.log("SLOT", slot, slotProps)

                let foundSchedule = await this.gSSRepository.findByGroupSubjectSchedule(groupSubject)

                if (!foundSchedule) {
                    foundSchedule = groupSubject;
                }
                console.log("SCHEDULE", foundSchedule)

                let allSlots = await this.gSSRepository.findAllScheduleSlots();
                console.log("All", allSlots)

                if (foundSchedule.checkIncompatibility(allSlots, slot)) {
                    foundSchedule.addSlot(slot);
                    await this.gSSRepository.save(foundSchedule)
                    return true;
                }
                return false
            }
            return false;
        } catch (err) {
            console.error(err)
            return false
        }
    }
}



