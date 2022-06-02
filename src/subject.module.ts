import { Module } from "@nestjs/common";
import { UploadSubjectService } from "./Application/uploadSubject.service";
import { SubjectController } from "./Infrastructure/Controllers/subject.controller";
import { TeachingGroupModel } from "./Infrastructure/Models/teachingGroup.model";
import { SubjectModel, SubjectTeachingGroupModel } from "./Infrastructure/Models/subject.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { GroupSubjectScheduleModel } from "./Infrastructure/Models/groupSubjectSchedule.model";
import { SubjectRepository } from "./Domain/subject.repository";
import { ListSubjectService } from "./Application/listSubject.service";
import { GroupSubjectScheduleRepository } from "./Domain/groupSubjectSchedule.repository";
import { ScheduleSlotModel } from "./Infrastructure/Models/scheduleSlot.model";

@Module({
    imports: [SequelizeModule.forFeature([SubjectModel, TeachingGroupModel, ScheduleSlotModel, GroupSubjectScheduleModel, SubjectTeachingGroupModel])],
    providers: [UploadSubjectService, SubjectRepository, ListSubjectService, GroupSubjectScheduleRepository],
    controllers: [SubjectController]
})
export class SubjectModule { }