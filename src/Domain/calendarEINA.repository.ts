import { InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";
import { DayEINAModel } from "../Infrastructure/Models/dayEINA.model";
import { CalendarEINAModel } from "../Infrastructure/Models/calendarEINA.model";
import { DayEINA, DayEINAState, WeekLetter } from "./dayEINA.value-object";
import { PeriodsCalendarEINA } from "./periodsCalendarEINA.value-object";
import { CalendarEINA } from "./calendarEINA.entity";

export type DayEINAData = { date: string, state: string, weekDay: number, weekLetter: string, idCalendarEINA };

@Injectable()
export class CalendarEINARepository {
    constructor(
        @InjectModel(DayEINAModel)
        private dayEINAModel: typeof DayEINAModel,
        @InjectModel(CalendarEINAModel)
        private calendarEINAModel: typeof CalendarEINAModel
    ) { }

    async save(calendar: CalendarEINA): Promise<CalendarEINA> {
        const idCalendarEINA = (await this.createCalendarEINA(calendar)).id;
        const daysEINA = calendar.days;

        daysEINA.forEach(async day => {
            let dayEINA = { date: this.onlyDate(day.date), state: day.state, weekDay: day.weekDay, weekLetter: day.weekLetter, comment: day.comment, idCalendarEINA: idCalendarEINA };
            await this.createDiaEINA(dayEINA);
        });
        return calendar;
    }

    private async createCalendarEINA(calendar: CalendarEINA): Promise<CalendarEINAModel | null> {
        let period = calendar.period.props;
        const newCalendar = this.calendarEINAModel.create(
            {
                id: calendar.id,
                course: calendar.course, version: calendar.version,
                startFirstSemester: period.startFirstSemester,
                endFirstSemester: period.endFirstSemester,
                startSecondSemester: period.startSecondSemester,
                endSecondSemester: period.endSecondSemester,
                startSecondConvocatory: period.startSecondConvocatory,
                endSecondConvocatory: period.endSecondConvocatory
            }
        ).catch(err => { console.log(err); return null; });
        return newCalendar;
    }

    async findDaysByCalendarEINA(calendar: CalendarEINA): Promise<Array<DayEINA>> {
        let daysEINA = await this.dayEINAModel.findAll({
            where: {
                idCalendarEINA: calendar.id
            },
            order: ['date']
        });

        let arrayEINA: Array<DayEINA> = daysEINA.map(day => {
            return new DayEINA({ date: new Date(day.date), state: DayEINAState[day.state], weekDay: day.weekDay, weekLetter: WeekLetter [ day.weekLetter], comment: day.comment});
        })

        return arrayEINA;
    }

    async findByCourseAndVersion(course: string, version: number): Promise<CalendarEINA> {
        let calendarEINA = await this.calendarEINAModel.findOne({
            where: {
                course: course,
                version: version
            },
        }).catch(err => { console.log(err); return null; });

        if (calendarEINA===null) {
            console.log("NOT FOUND");
            return null; 
        }
            
        let period: PeriodsCalendarEINA = new PeriodsCalendarEINA({
            startFirstSemester: calendarEINA.startFirstSemester,
            endFirstSemester: calendarEINA.endFirstSemester,
            startSecondSemester: calendarEINA.startSecondSemester,
            endSecondSemester: calendarEINA.endSecondSemester,
            startSecondConvocatory: calendarEINA.startSecondConvocatory,
            endSecondConvocatory: calendarEINA.endSecondConvocatory
        });

        var calendar = new CalendarEINA(calendarEINA.id, calendarEINA.course, calendarEINA.version, period);
        return calendar;
    }

    private onlyDate(date: Date) {
        return new Date(date).toISOString().slice(0, 10);
    }

    async editDayEINA(dayEINA: DayEINA, calendar: CalendarEINA): Promise<boolean> {
        await this.dayEINAModel.update(
            {
                weekDay: dayEINA.weekDay,
                weekLetter: dayEINA.weekLetter,
                state: dayEINA.state,
                comment: dayEINA.comment,
                idCalendarEINA: calendar.id
            },
            { where: { date: this.onlyDate(dayEINA.date) } }
        ).catch(err => {
             console.log(err)
        });
        return true;
    }
    
    async deleteCalendarEINA(calendar: CalendarEINA): Promise<Boolean> {
        const id = calendar.id;
        await this.dayEINAModel.destroy(
            {
                where: {
                    idCalendarEINA: id,
                }
            }
        );
        await this.calendarEINAModel.destroy(
            {
                where: { id: id}
            }
        )
        return true;
    }

    private async createDiaEINA(dayEINA: DayEINAData): Promise<DayEINAModel| null > {
        var newDay = this.dayEINAModel.create(dayEINA).catch(err => { console.log(err); return null; });
        return newDay;
    }

    private findOneDate(date: Date): Promise<DayEINAModel> {
        return this.dayEINAModel.findOne({
            where: {
                date:date,
            },
        });
    }
}