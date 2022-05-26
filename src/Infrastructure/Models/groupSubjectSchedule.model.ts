import { Column, Model, PrimaryKey, Table, Unique, DataType, HasMany, HasOne } from "sequelize-typescript";
import { TeachingGroupModel } from "./teachingGroup.model";
import { ScheduleSlotModel } from "./scheduleSlot.model";

export const GROUPSUBJECTSCHEDULE_ID = 'idGroupSubjectSchedule';

@Table
export class GroupSubjectScheduleModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id;

    @Column
    groupType: string;
    
    @HasOne(() => TeachingGroupModel)
    teachingGroup: number;

    @HasMany(() => ScheduleSlotModel, GROUPSUBJECTSCHEDULE_ID)
    scheduleSlots: ScheduleSlotModel[];

    @Column
    subjectIds: string[];
}
