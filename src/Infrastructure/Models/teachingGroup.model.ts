import { Column, Model, PrimaryKey, Table, Unique, DataType, HasMany } from "sequelize-typescript";

const GROUP_CODE_CONSTRAINT = 'group_code'
@Table
export class TeachingGroupModel extends Model {

    @Column
    career: string;
    
    @Column
    course: string;

    @Column({ unique: GROUP_CODE_CONSTRAINT})
    code: string;

    @Column
    period: string;

}
