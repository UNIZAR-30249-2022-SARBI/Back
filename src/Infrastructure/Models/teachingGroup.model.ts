import { Column, Model, PrimaryKey, Table, Unique, DataType, HasMany, BelongsTo, ForeignKey, BelongsToMany } from "sequelize-typescript";
import { GroupSubjectScheduleModel, GROUPSUBJECTSCHEDULE_ID } from "./groupSubjectSchedule.model";

const GROUP_CODE_CONSTRAINT = 'group_code';
export const TEACHINGGROUP_ID = 'idTeachingGroupModel';

@Table
export class TeachingGroupModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id;

    @Column
    career: string;
    
    @Column
    course: string;

    @Column({ unique: GROUP_CODE_CONSTRAINT})
    code: string;

    @Column
    period: string;


}
