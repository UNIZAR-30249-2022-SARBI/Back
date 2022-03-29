import { DayEINA } from "./dayEINA.value-object";

export enum CalendarEINAPeriod {
    FIRST_QUARTER = 0,
    SECOND_QUARTER = 1,
    SECOND_CONVOCATORY = 2
}

export class CalendarEINA {
    private _iniYear: number;
    private _period: CalendarEINAPeriod;
    private days: Array<DayEINA>;

    constructor(iniYear: number, period:CalendarEINAPeriod) {
        this.checkValidYear(iniYear);
        this._iniYear = iniYear;
        this._period = period;
    }

    get iniYear(): number {
        return this._iniYear;
    }

    get period(): number {
        return this._period;
    }

    private checkValidYear(year: number) {
        if (year < 1950 || year > 2100)
            //throw new error;
            console.error("CalendarEINA.year Error");
    }

    public updateDay(newDay: DayEINA) {
        const date = this.days.findIndex(day => day.date == newDay.date);
        this.days.splice(date, 1);
        this.days.push(newDay);
    }

    public setDays(days: Array<DayEINA>) {
        this.days = days;
    }

    public getDays(): Array<DayEINA> {
        return this.days;
    }
}

