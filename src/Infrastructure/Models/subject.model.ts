import { Column, Model, PrimaryKey, Table, Unique, DataType, HasMany, BelongsToMany, ForeignKey } from "sequelize-typescript";
import { GroupSubjectScheduleModel } from "./groupSubjectSchedule.model";
import { TeachingGroupModel, TEACHINGGROUP_ID } from "./teachingGroup.model";

const SUBJECT_CODE_CONSTRAINT = 'subject_code';
export const SUBJECT_ID = 'subject_id'
@Table
export class SubjectModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id;

    @Column
    name: string;

    @Column({ unique: SUBJECT_CODE_CONSTRAINT})
    code: string;

    @BelongsToMany(() => TeachingGroupModel, () => SubjectTeachingGroupModel)
    teachingGroupIds: TeachingGroupModel[];

    @HasMany(() => GroupSubjectScheduleModel, SUBJECT_ID)
    groupSubjectScheduleIds: GroupSubjectScheduleModel[];
}

@Table
export class SubjectTeachingGroupModel extends Model {
    @ForeignKey(() => SubjectModel)
    @Column({ type: DataType.UUID})
    subjectId;

    @ForeignKey(() => TeachingGroupModel)
    @Column({ type: DataType.UUID })
    groupId;

}