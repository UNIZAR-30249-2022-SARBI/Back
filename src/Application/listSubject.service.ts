import { Injectable } from "@nestjs/common";
import { SubjectRepository } from "../Domain/subject.repository";
import { Subject } from "../Domain/subject.entity";
import { GroupSubjectScheduleRepository } from "../Domain/groupSubjectSchedule.repository";

@Injectable()
export class ListSubjectService {
    constructor(
        private subjectRepository: SubjectRepository,
        private gSSRepository: GroupSubjectScheduleRepository
    ) { }

    public async listByTeachingGroup(code: string, period: string): Promise<Array<Subject>> {
        let teachingGroup = await this.gSSRepository.findGroupByCodeAndPeriod(code, period);

        let subjects:Array<Subject>;
        if(teachingGroup)
            subjects = await this.subjectRepository.findByTeachingGroup(teachingGroup.id)
        console.log("FIND");
        console.log(subjects)
        return subjects;
    }
}



