import { Injectable } from "@nestjs/common";
import { SubjectRepository } from "../Domain/subject.repository";
import { Subject } from "../Domain/subject.entity";
import { GroupSubjectScheduleRepository } from "../Domain/groupSubjectSchedule.repository";
import { TeachingGroup } from "../Domain/teachingGroup.value-object";

@Injectable()
export class ListTeachingGroupService {
    constructor(
        private gSSRepository: GroupSubjectScheduleRepository
    ) { }

    public async listTeachingGroups(): Promise<Array<TeachingGroup>> {
        let teachingGroup = await this.gSSRepository.findAllTeachingGroup();
        return teachingGroup;
    }
}



