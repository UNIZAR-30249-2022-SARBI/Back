import { InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { SubjectModel } from "../Infrastructure/Models/subject.model";
import { Subject } from "./subject.entity";
import { GroupSubjectSchedule } from "./groupSubjectSchedule.entity";
import { GroupSubjectScheduleModel } from "../Infrastructure/Models/groupSubjectSchedule.model";
import { TeachingGroup } from "./teachingGroup.value-object";
import { ScheduleSlot } from "./scheduleSlot.value-object";
import { TeachingGroupModel } from "../Infrastructure/Models/teachingGroup.model";

@Injectable()
export class GroupSubjectScheduleRepository {
    constructor(
        @InjectModel(GroupSubjectScheduleModel)
        private scheduleModel: typeof GroupSubjectScheduleModel,
        @InjectModel(TeachingGroupModel)
        private teachingGroupModel: typeof TeachingGroupModel,
        private sequelize: Sequelize,
    ) { }

    async findByTeachingGroup(teachingGroup: TeachingGroup): Promise<Array<GroupSubjectSchedule>> {
        let groupSubjectSchedules = await this.scheduleModel.findAll({
            where: {
                career: teachingGroup.career,
                course: teachingGroup.course,
                code: teachingGroup.code,
                period: teachingGroup.period
            }
        });
        let arrayGroupSubjectSchedule: Array<GroupSubjectSchedule> = groupSubjectSchedules.map(schedule => {
           
            return new GroupSubjectSchedule(schedule.id, schedule.groupType, schedule.groupNumber, schedule.teachingGroup, schedule.subjectId, null);
        })
        return arrayGroupSubjectSchedule;
    }
    /*  let arrayScheduleSlots = schedule.scheduleSlots.map(slot=> new ScheduleSlot(slot.startHour,slot.endHour, slot.weekDay, slot.periodicity));
     */
  /*  async findByCode(teachingGroup: TeachingGroup): Promise<GroupSubjectSchedule> {
        let schedule = await this.scheduleModel.findAll({
            where: {
                code: teachingGroup.code
            }
        });
        return new GroupSubjectSchedule(schedule.id, schedule.groupType, schedule.groupNumber, schedule.teachingGroup, schedule.subjectId, null);
    }*/

    async findBySubjectId(subject: Subject): Promise<Array<GroupSubjectSchedule>> {
        let groupSubjectSchedules = await this.scheduleModel.findAll({
            where: {
                subject: subject.id
            }
        });
        let arrayGroupSubjectSchedule: Array<GroupSubjectSchedule> = groupSubjectSchedules.map(schedule => {
            return new GroupSubjectSchedule(schedule.id, schedule.groupType, schedule.groupNumber, schedule.teachingGroup, schedule.subjectId, null);
        })
        return arrayGroupSubjectSchedule;
    }

    async save(groupSubjectSchedule: GroupSubjectSchedule): Promise<GroupSubjectSchedule | null> {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const newGroupSubjectSchedule = await this.scheduleModel.create(
                    {
                        groupType: groupSubjectSchedule.groupType,
                        groupNumber: groupSubjectSchedule.groupNumber,
                        teachingGroup: groupSubjectSchedule.teachingGroup,
                        subjectId: groupSubjectSchedule.subjectId,
                       // scheduleSlots: groupSubjectSchedule.scheduleSlots
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
    async findGroupByCodeAndPeriod(code: string, period: string): Promise<TeachingGroup | null> {
        let teachingGroupModel = await this.teachingGroupModel.findOne({
            where: {
                code: code,
                period: period
            },
        }).catch(err => {
            //console.error(err);
            return null;
        });
        if (!teachingGroupModel) {
            return null;
        }
        var teachingGroup = new TeachingGroup(teachingGroupModel.id, teachingGroupModel.career,
            teachingGroupModel.course, teachingGroupModel.code, teachingGroupModel.period);
        return teachingGroup;
    }

    async findAllTeachingGroup():Promise<Array<TeachingGroup>>{
        let teachingGroup = await this.teachingGroupModel.findAll();
        let arrayTeachingGroup: Array<TeachingGroup> = teachingGroup.map(group => {
            return new TeachingGroup(group.id, group.career, group.course, group.code, group.period);
        });
        return arrayTeachingGroup;
    }

    async saveTeachingGroup(teachingGroup: TeachingGroup): Promise<TeachingGroup | null> {
        //console.log(teachingGroup)

        try {
            const result = await this.sequelize.transaction(async (t) => {
                const newTeachingGroup = await this.teachingGroupModel.upsert(
                    {
                        id: teachingGroup.id,
                        career: teachingGroup.career,
                        code: teachingGroup.code,
                        period: teachingGroup.period,
                        course: teachingGroup.course
                    },
                    { transaction: t }
                ).catch(err => {
                    // console.error(err);
                    return null;
                });
                return newTeachingGroup;
            });
            return result;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

}