import { Column, Model, PrimaryKey, Table, Unique, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";

@Table
export class RequestModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id;
    @Column
    description: string;
    @Column
    applicantEmail: string;
    @Column
    location: string;
}

