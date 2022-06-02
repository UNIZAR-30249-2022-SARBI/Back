import { InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { GroupSubjectSchedule } from "./groupSubjectSchedule.entity";
import { GroupSubjectScheduleModel } from "../Infrastructure/Models/groupSubjectSchedule.model";
import { TeachingGroup } from "./teachingGroup.value-object";
import { Periodicity, ScheduleSlot } from "./scheduleSlot.value-object";
import { TeachingGroupModel } from "../Infrastructure/Models/teachingGroup.model";
import { ScheduleSlotModel } from "../Infrastructure/Models/scheduleSlot.model";

@Injectable()
export class GroupSubjectScheduleRepository {
    constructor(
        @InjectModel(GroupSubjectScheduleModel)
        private scheduleModel: typeof GroupSubjectScheduleModel,
        @InjectModel(ScheduleSlotModel)
        private slotModel: typeof ScheduleSlotModel,
        @InjectModel(TeachingGroupModel)
        private teachingGroupModel: typeof TeachingGroupModel,
        private sequelize: Sequelize,
    ) { }

    async save(schedule: GroupSubjectSchedule): Promise<GroupSubjectSchedule | null> {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const transactionHost = { transaction: t };
                let newSchedule = await this.createSchedule(schedule, transactionHost);
                if (newSchedule) {
                    await this.deleteScheduleSlots(schedule.id, t);
                    await this.createScheduleSlots(schedule.scheduleSlots, schedule.id, transactionHost);
                    return newSchedule;
                }
                return null;
            });
            return result;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    private async createSchedule(schedule: GroupSubjectSchedule, transactionHost): Promise<GroupSubjectSchedule | null> {
        const newSchedule = await this.scheduleModel.upsert(
            {
                id: schedule.id,
                groupType: schedule.groupType,
                groupNumber: schedule.groupNumber,
                idTeachingGroup: schedule.teachingGroup.id,
                subjectId: schedule.subjectId,
            },
            transactionHost
        ).catch(err => {
            // console.error(err);
            return null;
        });
        if (newSchedule)
            return schedule;
        else return null;
    }

    private async createScheduleSlots(slots: Array<ScheduleSlot>, idSchedule, transactionHost): Promise<Boolean | null> {
        try {
            for (const slot of slots) {
                let scheduleSlot = { startHour: slot.startHour, endHour:slot.endHour,weekDay:slot.weekDay, periodicity: slot.periodicity, location:slot.location, idGroupSubjectSchedule: idSchedule };
                var newSlot = await this.slotModel.create(scheduleSlot, transactionHost).catch(err => { console.error(err); return null; });
            }
            return true;
        } catch (err) {
            // console.error(err);
            return false;
        }
    }

    private async deleteScheduleSlots(idSchedule, transaction): Promise<Boolean> {
        await this.slotModel.destroy(
            {
                where: {
                    idGroupSubjectSchedule: idSchedule,
                },
                transaction: transaction
            },
        );
        return true;
    }

    async findSlotsByTeachingGroup(teachingGroup: TeachingGroup): Promise<Array<ScheduleSlot>> {
        let groupSubjectSchedules = await this.scheduleModel.findAll({
            where: {
                idTeachingGroup: teachingGroup.id
            }
        });
        let allSlots = Array<ScheduleSlot>()
        for (let schedule of groupSubjectSchedules) {
            let slots = await this.slotModel.findAll(
                {
                    where: {
                        idGroupSubjectSchedule: schedule.id
                    }
                });

            let arraySlots = slots.map(slot => new ScheduleSlot(slot.startHour, slot.endHour, slot.weekDay, slot.periodicity as Periodicity, slot.location));
            allSlots.push(...arraySlots)
        }
        return allSlots;
    }

    async findByGroupSubjectSchedule(groupSubject:GroupSubjectSchedule): Promise<GroupSubjectSchedule> {
        let schedule = await this.scheduleModel.findOne({
            where: {
                groupType: groupSubject.groupType,
                groupNumber: groupSubject.groupNumber,
                idTeachingGroup: groupSubject.teachingGroup.id,
                subjectId: groupSubject.subjectId
            }
        });

        if (schedule) {
            let slots = await this.slotModel.findAll({ where: { idGroupSubjectSchedule: schedule.id } })
            let arraySlots = slots.map(slot => new ScheduleSlot(slot.startHour,slot.endHour, slot.weekDay, slot.periodicity as Periodicity, slot.location))
            return new GroupSubjectSchedule(schedule.id, schedule.groupType, schedule.groupNumber, groupSubject.teachingGroup, schedule.subjectId, arraySlots);
        }
        else
            return null;
    }
   
    async findAllScheduleSlots(): Promise<Array<ScheduleSlot>> {
        let slots = await this.slotModel.findAll();
        let arraySlot: Array<ScheduleSlot> = slots.map(slot => {
            return new ScheduleSlot(slot.startHour, slot.endHour, slot.weekDay, slot.periodicity as Periodicity, slot.location);
        });
        return arraySlot;
    }

    //Teaching Groups
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