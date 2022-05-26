import { Column, Model, PrimaryKey, Table, Unique, DataType, BelongsTo, HasMany } from "sequelize-typescript";
import { GroupSubjectScheduleModel } from "./groupSubjectSchedule.model";

import { GROUPSUBJECTSCHEDULE_ID } from "./groupSubjectSchedule.model";

@Table
export class ScheduleSlotModel extends Model {

    @Column
    startHour: string;

    @Column
    endHour: string;

    @Column
    weekDay: string;

    @Column
    periodicity: string;

    @BelongsTo(() => GroupSubjectScheduleModel, GROUPSUBJECTSCHEDULE_ID)
    idGroupSubjectSchedule;

}
