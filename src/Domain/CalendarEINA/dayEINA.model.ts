import { Column, Model, PrimaryKey, Table, Unique, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { CalendarEINAModel, CALENDAREINA_ID } from "./calendarEINA.model";

@Table
export class DayEINAModel extends Model {
    @Column({ type: DataType.DATEONLY })
    date;

    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
    comment: string[];

    @Column
    state: string;

    @Column
    weekDay: number;

    @Column
    weekLetter: string;

    @BelongsTo(() => CalendarEINAModel, CALENDAREINA_ID)
    calendar;

    @ForeignKey(() => CalendarEINAModel)
    @Column({ type: DataType.UUID })
    idCalendarEINA;
}

