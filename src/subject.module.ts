import { Module } from "@nestjs/common";
import { UserController } from "./Infrastructure/Controllers/user.controller";
import { UserLoginService } from "./Application/userLogin.service";
import { UploadSubjectService } from "./Application/uploadSubject.service";
import { SubjectController } from "./Infrastructure/Controllers/subject.controller";
import { TeachingGroupModel } from "./Infrastructure/Models/teachingGroup.model";
import { SubjectModel } from "./Infrastructure/Models/subject.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { GroupSubjectScheduleModel } from "./Infrastructure/Models/groupSubjectSchedule.model";
import { SubjectRepository } from "./Domain/subject.repository";

@Module({
    imports: [SequelizeModule.forFeature([TeachingGroupModel, SubjectModel, GroupSubjectScheduleModel])],
    providers: [UploadSubjectService, SubjectRepository],
    controllers: [SubjectController]
})
export class SubjectModule { }