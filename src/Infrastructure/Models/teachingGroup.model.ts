import { Column, Model, PrimaryKey, Table, Unique, DataType, HasMany, BelongsTo, ForeignKey, BelongsToMany } from "sequelize-typescript";
import { GroupSubjectSchedule } from "../../Domain/groupSubjectSchedule.entity";
import { GroupSubjectScheduleModel, GROUPSUBJECTSCHEDULE_ID } from "./groupSubjectSchedule.model";
import { SubjectModel, SubjectTeachingGroupModel } from "./subject.model";

const CODE_PERIOD_CONSTRAINT = 'code_period';
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

    @Column({ unique: CODE_PERIOD_CONSTRAINT})
    code: string;

    @Column({ unique: CODE_PERIOD_CONSTRAINT })
    period: string;

    @BelongsToMany(() => SubjectModel, () => SubjectTeachingGroupModel)
    subjectsIds: SubjectModel[];

    @HasMany(() => GroupSubjectScheduleModel, TEACHINGGROUP_ID)
    groupSubjectSchedules: GroupSubjectSchedule[];
}
