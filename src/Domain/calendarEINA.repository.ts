import { InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";
import { DayEINAModel } from "../Infrastructure/Models/dayEINA.model";
import { CalendarEINAModel } from "../Infrastructure/Models/calendarEINA.model";
import { DayEINA, DayEINAState, WeekLetter } from "./dayEINA.entity";
import { Period } from "./period.value-object";
import { CalendarEINA, PeriodCalendarEINA } from "./calendarEINA.entity";
import { PeriodModel } from "../Infrastructure/Models/periods.model";
import { Sequelize } from "sequelize-typescript";

export type DayEINAData = { date: string, state: string, weekDay: number, weekLetter: string, idCalendarEINA };

@Injectable()
export class CalendarEINARepository {
    constructor(
        @InjectModel(DayEINAModel)
        private dayEINAModel: typeof DayEINAModel,
        @InjectModel(CalendarEINAModel)
        private calendarEINAModel: typeof CalendarEINAModel,
        @InjectModel(PeriodModel)
        private periodModel: typeof PeriodModel,
        private sequelize: Sequelize,
    ) { }

    async save(calendar: CalendarEINA): Promise<CalendarEINA | null> {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const transactionHost = { transaction: t };
                const calendarEINA = (await this.createCalendarEINA(calendar, transactionHost));
                if (calendarEINA) {
                    const idCalendarEINA = calendarEINA.id;
                    await this.createDaysEINA(calendar.days, idCalendarEINA, transactionHost);
                    await this.createPeriods(calendar.periods, idCalendarEINA, transactionHost);
                } else {
                    return null;
                }
                return calendar;
            })
            return result
        } catch (err){
            //console.error(err);
            return null;
        }
    }

    private async createCalendarEINA(calendar: CalendarEINA, transactionHost): Promise<CalendarEINAModel | null> {
        const newCalendar = await this.calendarEINAModel.create(
            {
                id: calendar.id,
                course: calendar.course,
                version: calendar.version,
            },
            transactionHost
        ).catch(err => {
           // console.error(err);
            return null;
        });
        return newCalendar;
    }


    private async createDaysEINA(daysEINA: Array<DayEINA>, idCalendarEINA, transactionHost): Promise<Boolean | null> {
        try {
            for (const day of daysEINA) {
                let dayEINA = { date: this.onlyDate(day.date), state: day.state, weekDay: day.weekDay, weekLetter: day.weekLetter, comment: day.comment, idCalendarEINA: idCalendarEINA };
                var newDay = await this.dayEINAModel.upsert(dayEINA, transactionHost).catch(err => { console.error(err); return null; });
            }
            return true;
        } catch (err) {
           // console.error(err);
            return false;
        }
    }

    private async createPeriods(periods: Map<PeriodCalendarEINA, Period>, idCalendarEINA, transactionHost): Promise<Boolean | null> {
        for (const period of periods) {
            const newPeriod = await this.periodModel.create(
                {
                    startDate: period[1].startDate,
                    endDate: period[1].endDate,
                    idCalendarEINA: idCalendarEINA
                },
                transactionHost
            ).catch(err => {
                //console.error(err);
                return null;
            });
        }
        return true;
    }

    async update(calendar: CalendarEINA): Promise<Boolean | null> {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                await this.deletePeriods(calendar, t);
               // await this.deleteDays(calendar, t);
                const idCalendarEINA = calendar.id;
                await this.createDaysEINA(calendar.days, idCalendarEINA, { transaction: t });
                await this.createPeriods(calendar.periods, idCalendarEINA, { transaction: t });
            })
        } catch (err) {
           // console.error(err);
            return false;
        }
        return true;
    }

    async findDaysByCalendarEINA(calendar: CalendarEINA): Promise<Array<DayEINA>> {
        let daysEINA = await this.dayEINAModel.findAll({
            where: {
                idCalendarEINA: calendar.id
            },
            order: ['date']
        });
        let arrayEINA: Array<DayEINA> = daysEINA.map(day => {
            let weekLetter = day.weekLetter?WeekLetter[day.weekLetter]:WeekLetter.BOTH;
            return new DayEINA(new Date(day.date), day.weekDay, weekLetter, DayEINAState[day.state], day.comment);
        })
        return arrayEINA;
    }
    async findAll(): Promise<Array<CalendarEINA>> {
        let calendars:CalendarEINA[] = await this.calendarEINAModel.findAll()
            .catch(err => {
            //console.error(err);
            return null;
        });
        let arrayCalendars: Array<CalendarEINA> = calendars.map( c => {
            return new CalendarEINA(c.id, c.course, c.version,null);
        })

        return arrayCalendars;
    }

    async findByCourseAndVersion(course: string, version: number): Promise<CalendarEINA | null> {
        let calendarEINA = await this.calendarEINAModel.findOne({
            where: {
                course: course,
                version: version
            },
        }).catch(err => {
            //console.error(err);
            return null;
        });

        if (!calendarEINA) {
            //console.error("Calendar NOT FOUND");
            return null; 
        }
        let periodsEINA = await this.periodModel.findAll({
            where: {
                idCalendarEINA: calendarEINA.id
            },
            order: ['startDate']
        });
        let periods = new Map < PeriodCalendarEINA, Period>()
        periodsEINA.forEach(async (period, i) => {
            periods.set(i, new Period(period.startDate, period.endDate));
        }); 
        var calendar = new CalendarEINA(calendarEINA.id, calendarEINA.course, calendarEINA.version, periods);
        return calendar;
    }

    private onlyDate(date: Date) {
        return new Date(date).toISOString().slice(0, 10);
    }

    async saveDayInCalendar(dayEINA: DayEINA, calendar: CalendarEINA): Promise<boolean> {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const day = await this.dayEINAModel.update (
                    {
                        weekDay: dayEINA.weekDay,
                        weekLetter: dayEINA.weekLetter,
                        state: dayEINA.state,
                        comment: dayEINA.comment,
                    },
                    {
                        where: {
                            date: this.onlyDate(dayEINA.date),
                            idCalendarEINA: calendar.id
                        },
                        transaction: t
                    },
                ).catch(err => {
                    console.error(err);
                    return false
                });
                return true
            });
            return result
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async deleteCalendarEINA(calendar: CalendarEINA): Promise<Boolean> {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const id = calendar.id;
                await this.deletePeriods(calendar, t);
                await this.deleteDays(calendar, t);
                await this.calendarEINAModel.destroy(
                    {
                        where: { id: id },
                        transaction: t
                    },
                ).catch(err => {
                   // console.error(err);
                    return false
                })
                return true
            });
            return result;
        } catch (err) {
            //console.error(err);
            return false;
        }
    }

    private async deleteDays(calendar: CalendarEINA, transaction): Promise<Boolean> {
        const id = calendar.id;
        await this.dayEINAModel.destroy(
            {
                where: {
                    idCalendarEINA: id,
                },
                transaction: transaction
            },
        );
        return true;
    }

    private async deletePeriods(calendar: CalendarEINA, transaction): Promise<Boolean> {
        const id = calendar.id;
        await this.periodModel.destroy(
            {
                where: {
                    idCalendarEINA: id,
                },
                transaction: transaction
            }
        );
        return true;
    }

} 