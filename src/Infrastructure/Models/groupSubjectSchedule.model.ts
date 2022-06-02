import { Column, Model, PrimaryKey, Table, Unique, DataType, HasMany, HasOne, BelongsTo, ForeignKey } from "sequelize-typescript";
import { TeachingGroupModel, TEACHINGGROUP_ID } from "./teachingGroup.model";
import { ScheduleSlotModel } from "./scheduleSlot.model";
import { SubjectModel, SUBJECT_ID } from "./subject.model";

export const GROUPSUBJECTSCHEDULE_ID = 'idGroupSubjectSchedule';

@Table
export class GroupSubjectScheduleModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id;

    @Column
    groupType: string;

    @Column
    groupNumber: number;

    @BelongsTo(()=>TeachingGroupModel, TEACHINGGROUP_ID)
    teachingGroup: TeachingGroupModel

    @ForeignKey(() => TeachingGroupModel)
    @Column({ type: DataType.UUID })
    idTeachingGroup;

    @BelongsTo(() => SubjectModel, SUBJECT_ID)
    subject: SubjectModel;

    @ForeignKey(() => SubjectModel)
    @Column({ type: DataType.UUID })
    subjectId;

    @HasMany(() => ScheduleSlotModel, GROUPSUBJECTSCHEDULE_ID)
    scheduleSlots: ScheduleSlotModel[];

}
