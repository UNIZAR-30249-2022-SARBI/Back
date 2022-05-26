import { Column, Model, PrimaryKey, Table, Unique, DataType, HasMany } from "sequelize-typescript";

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

    @Column
    teachingGroupIds: string[];
}
