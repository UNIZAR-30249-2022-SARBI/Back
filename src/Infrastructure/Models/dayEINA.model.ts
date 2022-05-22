import { Column, Model, PrimaryKey, Table, Unique, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { CalendarEINAModel, CALENDAREINA_ID } from "./calendarEINA.model";

const CALENDAR_DAY_CONSTRAINT = 'calendar_day';

@Table
export class DayEINAModel extends Model {
    @Column({ type: DataType.DATEONLY, unique: CALENDAR_DAY_CONSTRAINT })
    date;

    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
    comment: string[];

    @Column
    state: string;

    @Column
    weekDay: number;

    @Column({defaultValue: 'BOTH'})
    weekLetter: string;

    @BelongsTo(() => CalendarEINAModel, CALENDAREINA_ID)
    calendar;

    @ForeignKey(() => CalendarEINAModel)
    @Column({ type: DataType.UUID, unique: CALENDAR_DAY_CONSTRAINT})
    idCalendarEINA;
}

