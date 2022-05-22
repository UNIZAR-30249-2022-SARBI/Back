import { Column, Model, PrimaryKey, Table, Unique, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { CalendarEINAModel, CALENDAREINA_ID } from "./calendarEINA.model";

@Table
export class PeriodModel extends Model {
    @Column({ type: DataType.DATEONLY })
    startDate;
    @Column({ type: DataType.DATEONLY })
    endDate;

    @BelongsTo(() => CalendarEINAModel, CALENDAREINA_ID)
    calendar;

    @ForeignKey(() => CalendarEINAModel)
    @Column({ type: DataType.UUID })
    idCalendarEINA;
}

