import { Column, Model, PrimaryKey, Table, Unique, DataType, HasMany } from "sequelize-typescript";
import { DayEINAModel } from "./dayEINA.model";
import { PeriodModel } from "./periods.model";

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

    @HasMany(() => DayEINAModel, CALENDAREINA_ID)
    daysEINA: DayEINAModel[];
    @HasMany(() => PeriodModel, CALENDAREINA_ID)
    periods: PeriodModel[];
}
