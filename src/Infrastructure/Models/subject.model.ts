import { Column, Model, PrimaryKey, Table, Unique, DataType, HasMany } from "sequelize-typescript";
import { TeachingGroup } from "../../Domain/teachingGroup.value-object";
import { TeachingGroupModel, TEACHINGGROUP_ID } from "./teachingGroup.model";

const SUBJECT_CODE_CONSTRAINT = 'subject_code'
@Table
export class SubjectModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id;

    @Column
    name: string;

    @Column({ unique: SUBJECT_CODE_CONSTRAINT})
    code: string;


}
