import { Module } from "@nestjs/common";
import { TeachingGroupModel } from "./Infrastructure/Models/teachingGroup.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { GroupSubjectScheduleModel } from "./Infrastructure/Models/groupSubjectSchedule.model";
import { ScheduleSlotModel } from "./Infrastructure/Models/scheduleSlot.model";
import { GroupSubjectScheduleRepository } from "./Domain/groupSubjectSchedule.repository";
import { GroupSubjectScheduleController } from "./Infrastructure/Controllers/groupSubjectSchedule.controller";
import { AddScheduleSlotService } from "./Application/addScheduleSlot.service";
import { ListTeachingGroupService } from "./Application/listTeachingGroup.service";
import { RemoveScheduleSlotService } from "./Application/removeScheduleSlot.service";
import { ListScheduleByTeachingGroupService } from "./Application/listScheduleByTeachingGroup.service";
import { SubjectTeachingGroupModel } from "./Infrastructure/Models/subject.model";


@Module({
    imports: [SequelizeModule.forFeature([TeachingGroupModel, ScheduleSlotModel, GroupSubjectScheduleModel, SubjectTeachingGroupModel])],
    providers: [GroupSubjectScheduleRepository, AddScheduleSlotService, ListTeachingGroupService, RemoveScheduleSlotService, ListScheduleByTeachingGroupService],
    controllers: [GroupSubjectScheduleController]
})
export class GroupSubjectScheduleModule { }