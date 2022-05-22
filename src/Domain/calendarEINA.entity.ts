import { Period } from "./period.value-object";
import { DayEINA, DayEINAState, WeekDay, WeekLetter } from './dayEINA.entity';
import { v4 as uuidV4 } from 'uuid';
import { addWeek, dateBetween, getUTCDate, sortByDate, TOTALWEEKDAY } from "./dateUtils";
import { INVALID_CALENDAREINA_PERIODS, INVALID_COURSE } from "./errorTypes";


export enum PeriodCalendarEINA {
    FIRST_QUARTER = 0,
    SECOND_QUARTER = 1,
    SECOND_CONVOCATORY = 2
}

export class CalendarEINA {
    private readonly _id: string;
    private _course: string;
    private _version: number;
    private _periods: Map<PeriodCalendarEINA,Period>;
    private _days: Array<DayEINA>;

    constructor(id: string, course: string, version: number, periods: Map<PeriodCalendarEINA, Period>) {
        this._id = id ? id:uuidV4();
        this.checkValidCourse(course);
        this._course = course;
        this._version = version;
        if (periods) {
            this.checkPeriods(periods);
            this._periods = periods
        }
    }

    get id(): string {
        return this._id;
    }

    get course(): string {
        return this._course;
    }

    get version(): number {
        return this._version;
    }
    get periods(): Map<PeriodCalendarEINA, Period> {
        return this._periods;
    }
    set periods( periods : Map<PeriodCalendarEINA, Period> ){
        this._periods = periods;
    }
    get days(): Array<DayEINA> {
        return this._days;
    }

    set days(days: Array<DayEINA>) {
        this._days = days;
    }

    private checkValidCourse(course: string) {
        let pattern = /\d{2}(\d{2})-(\d{2})/;
        let match = course.match(pattern);
        if (match === null || match?.length < 3 || Number(match[2]) != ((Number(match[1]) + 1) % 100))
            throw new Error(INVALID_COURSE);
    }
    private checkPeriods(periods: Map<PeriodCalendarEINA, Period>) {
        periods.forEach((period, key) => {
            for (const [otherkKey,otherPeriod] of periods) {
                if (key != otherkKey)
                    if (dateBetween(otherPeriod.startDate, period.startDate, period.endDate) || dateBetween(otherPeriod.endDate, period.startDate, period.endDate)) {
                        throw new Error(INVALID_CALENDAREINA_PERIODS);
                    }
            }
        })
    }
    public getDaysOfPeriod(periodNum: PeriodCalendarEINA): Array<DayEINA> {
        let period = this._periods.get(periodNum);

        return this._days.filter(day => dateBetween(day.date, period.startDate, period.endDate));
    }
}

