import { InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";

import { CalendarEINA, CalendarEINAPeriod } from "./calendarEINA.entity";
import { DayEINA, DayEINAState, WeekLetter } from "./dayEINA.value-object";
import { DayEINAModel } from "./dayEINA.model";

export type DayEINAData = { date: string, state: string, weekDay: number, weekLetter: string, comment:string[], iniCourseYear:number; };

@Injectable()
export class CalendarEINARepository {
    constructor(
        @InjectModel(DayEINAModel)
        private dayEINAModel: typeof DayEINAModel
    ) { }
    async add(calendar: CalendarEINA): Promise<CalendarEINA> {
        const daysEINA = calendar.getDays();
        const iniCourseYear = calendar.iniYear;
        const period = calendar.period;

        daysEINA.forEach(async day => {
            let dayEINA = { date: this.onlyDate(day.date), state: day.state, weekDay: day.weekDay, weekLetter: day.weekLetter, comment: day.comment, iniCourseYear: iniCourseYear, period: period };
            await this.createDiaEINA(dayEINA);
        });

        return calendar;
    }

    async findByIniYearAndPeriod(year: number, period: CalendarEINAPeriod): Promise<CalendarEINA> {
        let daysEINA = await this.dayEINAModel.findAll({
            where: {
                iniCourseYear: year,
                period: period,
            },
            order: ['date']
        });

        let arrayEINA: Array<DayEINA> = daysEINA.map(day => {
            return new DayEINA({ date: new Date(day.date), state: DayEINAState[day.state], weekDay: day.weekDay, weekLetter: WeekLetter [ day.weekLetter], comment: day.comment});
        })

        var calendar = new CalendarEINA(year, period);
        calendar.setDays(arrayEINA)
        return calendar;
    }

    private onlyDate(date: Date) {
        return new Date(date).toISOString().slice(0, 10);
    }

    async edit(dayEINA: DayEINA): Promise<boolean> {
        await this.dayEINAModel.update(
            {
                weekDay: dayEINA.weekDay,
                weekLetter: dayEINA.weekLetter,
                state: dayEINA.state,
                comment: dayEINA.comment
            },
            { where: { date: this.onlyDate(dayEINA.date) } }
        ).catch(err => {
             console.log(err)
        });
        
        return true;
    }
    
    async delete(year: number): Promise<Boolean> {
        await this.dayEINAModel.destroy(
            {
                where: {
                    iniCourseYear: year,
                }
            }
        );
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