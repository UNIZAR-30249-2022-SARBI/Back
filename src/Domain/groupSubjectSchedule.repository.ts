import { InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { SubjectModel } from "../Infrastructure/Models/subject.model";
import { Subject } from "./subject.entity";
import { GroupSubjectSchedule } from "./groupSubjectSchedule.entity";
import { GroupSubjectScheduleModel } from "../Infrastructure/Models/groupSubjectSchedule.model";
import { TeachingGroup } from "./teachingGroup.value-object";

@Injectable()
export class GroupSubjectScheduleRepository {
    constructor(
        @InjectModel(GroupSubjectScheduleModel)
        private subjectModel: typeof GroupSubjectScheduleModel,
        private sequelize: Sequelize,
    ) { }

    async findByTeachingGroup(teachingGroup: TeachingGroup): Promise<Array<GroupSubjectSchedule>> {
        let groupSubjectSchedules = await this.subjectModel.findAll({
            where: {
                career: teachingGroup.career,
                course: teachingGroup.course,
                code: teachingGroup.code,
                period: teachingGroup.period
            }
        });
        let arrayGroupSubjectSchedule: Array<GroupSubjectSchedule> = groupSubjectSchedules.map(schedule => {
            return new GroupSubjectSchedule(schedule.id, schedule.groupType, schedule.groupNumber, schedule.teachingGroup, schedule.subjectIds, schedule.scheduleSlots);
        })
        return arrayGroupSubjectSchedule;
    }

    async findByCode(teachingGroup: TeachingGroup): Promise<GroupSubjectSchedule> {
        let schedule = await this.subjectModel.findAll({
            where: {
                code: teachingGroup.code
            }
        });
        return new GroupSubjectSchedule(schedule.id, schedule.groupType, schedule.groupNumber, schedule.teachingGroup, schedule.subjectIds, schedule.scheduleSlots);
    }

    async findBySubjectId(subject: Subject): Promise<Array<GroupSubjectSchedule>> {
        let groupSubjectSchedules = await this.subjectModel.findAll({
            where: {
                subject: subject.id
            }
        });
        let arrayGroupSubjectSchedule: Array<GroupSubjectSchedule> = groupSubjectSchedules.map(schedule => {
            return new GroupSubjectSchedule(schedule.id, schedule.groupType, schedule.groupNumber, schedule.teachingGroup, schedule.subjectIds, schedule.scheduleSlots);
        })
        return arrayGroupSubjectSchedule;
    }

    async save(groupSubjectSchedule: GroupSubjectSchedule): Promise<GroupSubjectSchedule | null> {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const newGroupSubjectSchedule = await this.subjectModel.create(
                    {
                        groupType: groupSubjectSchedule.groupType,
                        groupNumber: groupSubjectSchedule.groupNumber,
                        teachingGroup: groupSubjectSchedule.teachingGroup,
                        subjectIds: groupSubjectSchedule.subjectIds,
                        scheduleSlots: groupSubjectSchedule.scheduleSlots
                    },
                    { transaction: t }
                ).catch(err => {
                    // console.error(err);
                    return null;
                });
                return newGroupSubjectSchedule;
            });
            return result;
        } catch (err) {
            //console.error(err);
            return null;
        }
    }

}