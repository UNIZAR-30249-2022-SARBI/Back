import { Column, Model, PrimaryKey, Table, Unique, DataType } from "sequelize-typescript";

@Table
export class DayEINAModel extends Model {
    @PrimaryKey
    @Column({type: DataType.DATEONLY})
    date: string;

    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
    comment: string[];

    @Column({ defaultValue: ['NO_SCHOOL'] })
    state: string

    @Column
    weekDay: number;

    @Column({ defaultValue: '' })
    weekLetter: string;

    @Column
    iniCourseYear: number;

    @Column
    period:number
}