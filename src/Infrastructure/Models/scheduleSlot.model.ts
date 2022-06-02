import { Column, Model, PrimaryKey, Table, Unique, DataType, BelongsTo, HasMany, ForeignKey } from "sequelize-typescript";
import { GroupSubjectScheduleModel } from "./groupSubjectSchedule.model";

import { GROUPSUBJECTSCHEDULE_ID } from "./groupSubjectSchedule.model";

@Table
export class ScheduleSlotModel extends Model {

    @Column
    startHour: string;

    @Column
    endHour: string;

    @Column
    weekDay: number;

    @Column
    periodicity: string;

    @BelongsTo(() => GroupSubjectScheduleModel, GROUPSUBJECTSCHEDULE_ID)
    groupSubjectSchedule;

    @ForeignKey(() => GroupSubjectScheduleModel)
    @Column({ type: DataType.UUID})
    idGroupSubjectSchedule;

    @Column
    location: string;
}
