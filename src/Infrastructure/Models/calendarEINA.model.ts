import { Column, Model, PrimaryKey, Table, Unique, DataType, HasMany } from "sequelize-typescript";
import { DayEINAModel } from "./dayEINA.model";

const COURSE_VERSION_CONSTRAINT = 'course_version';
export const CALENDAREINA_ID = 'idCalendarEINA';

@Table
export class CalendarEINAModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id;

    @Column({ unique: COURSE_VERSION_CONSTRAINT})
    course: string;

    @Column({ unique: COURSE_VERSION_CONSTRAINT})
    version: number;

    @Column({ type: DataType.DATEONLY })
    startFirstSemester;

    @Column({ type: DataType.DATEONLY })
    endFirstSemester;

    @Column({ type: DataType.DATEONLY })
    startSecondSemester;

    @Column({ type: DataType.DATEONLY })
    endSecondSemester;

    @Column({ type: DataType.DATEONLY })
    startSecondConvocatory;

    @Column({ type: DataType.DATEONLY })
    endSecondConvocatory;

    @HasMany(() => DayEINAModel, CALENDAREINA_ID)
    daysEINA: DayEINAModel[];
}
