import { Module } from "@nestjs/common";
import { UserController } from "./Infrastructure/Controllers/user.controller";
import { UserLoginService } from "./Application/userLogin.service";
import { UploadSubjectService } from "./Application/uploadSubject.service";
import { SubjectController } from "./Infrastructure/Controllers/subject.controller";
import { TeachingGroupModel } from "./Infrastructure/Models/teachingGroup.model";
import { SubjectModel, SubjectTeachingGroupModel } from "./Infrastructure/Models/subject.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { GroupSubjectScheduleModel } from "./Infrastructure/Models/groupSubjectSchedule.model";
import { SubjectRepository } from "./Domain/subject.repository";
import { ScheduleSlotModel } from "./Infrastructure/Models/scheduleSlot.model";
import { GroupSubjectScheduleRepository } from "./Domain/groupSubjectSchedule.repository";
import { GroupSubjectScheduleController } from "./Infrastructure/Controllers/groupSubjectSchedule.controller";
import { CreateScheduleService } from "./Application/createSchedule.service";
import { ListTeachingGroupService } from "./Application/listTeachingGroup.service";


@Module({
    imports: [SequelizeModule.forFeature([TeachingGroupModel, ScheduleSlotModel, GroupSubjectScheduleModel, SubjectTeachingGroupModel])],
    providers: [GroupSubjectScheduleRepository, CreateScheduleService, ListTeachingGroupService],
    controllers: [GroupSubjectScheduleController]
})
export class GroupSubjectScheduleModule { }