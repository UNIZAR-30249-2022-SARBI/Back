import { PeriodsCalendarEINA } from "./periodsCalendarEINA.value-object";
import { DayEINA, DayEINAState, WeekDay, WeekLetter } from './dayEINA.value-object';
import { v4 as uuidV4 } from 'uuid';
import { addWeek, dateBetween, getUTCDate, sortByDate, TOTALWEEKDAY } from "./dateUtils";

const CULM_COMMENT = 'Exámenes CULM';
const SEC_CONV_COMMENT = 'Exámenes 2ª conv';

export enum CalendarEINAPeriod {
    FIRST_QUARTER = 0,
    SECOND_QUARTER = 1,
    SECOND_CONVOCATORY = 2
}

export class CalendarEINA {
    private readonly _id: string;
    private _course: string;
    private _version: number;
    private _period: PeriodsCalendarEINA;
    private _days: Array<DayEINA>;

    constructor(id: string, course: string, version: number, period: PeriodsCalendarEINA) {
        this._id = id ? id:uuidV4();
        this.checkValidCourse(course);
        console.log(JSON.stringify(period))
        this._course = course;
        this._period = period;
        this._version = version;
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

    get period(): PeriodsCalendarEINA {
        return this._period;
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
        console.log(match);
        if (match === null || match?.length < 3 || Number(match[2]) != ((Number(match[1]) + 1) % 100))
            //throw new error;
            console.error("Invalid CalendarEINA course", course);
    }

    public fillDaysEINA() {
        var periods = this._period.props;
        let daysEINA = this.daySemester(periods.startFirstSemester, periods.endFirstSemester)
            .concat(this.daySemester(periods.startSecondSemester, periods.endSecondSemester)
            .concat(this.dayConvocatory(periods.startSecondConvocatory, periods.endSecondConvocatory)));
        this._days = daysEINA;
    }

    public getDaysOfPeriod(period:CalendarEINAPeriod): Array<DayEINA> {
        let periods = this._period.props;
        let days: Array<DayEINA>;
        switch (period) {
            case CalendarEINAPeriod.FIRST_QUARTER:
                days = this.filterDays(periods.startFirstSemester, periods.endFirstSemester);
                break;
            case CalendarEINAPeriod.SECOND_QUARTER:
                days = this.filterDays(periods.startSecondSemester, periods.endSecondSemester);
                break;
            case CalendarEINAPeriod.SECOND_CONVOCATORY:
                days = this.filterDays(periods.startSecondConvocatory, periods.endSecondConvocatory);
                break;
        }

        return days;
    }

    private filterDays(start: Date, end: Date) {
        return this._days.filter(day => dateBetween(day.date, start, end));
    }

    private daySemester(startSemesterDate: Date, endSemesterDate: Date): Array<DayEINA> {
        var startSemester = getUTCDate(startSemesterDate), endSemester = getUTCDate(endSemesterDate);
        var daysEINA = this.fillSchoolWeekDaysEINA(startSemester, WeekLetter.BOTH);
        daysEINA.sort(sortByDate);
        var numberWeek = 0;

        for (let date = this.oneMoreLastOne(daysEINA); date <= endSemester; date = this.oneMoreLastOne(daysEINA)) {
            var weekLetter = WeekLetter.BOTH;
            if (numberWeek < 14) {
                weekLetter = numberWeek % 2 == 0 ? WeekLetter.A : WeekLetter.B;
                numberWeek++;
            }
            let newWeek = this.fillSchoolWeekDaysEINA(date, weekLetter);
            daysEINA = daysEINA.concat(newWeek);
        }

        return daysEINA;
    }

    private dayConvocatory(startConvocatoryDate: Date, endConvocatoryDate: Date): Array<DayEINA> {
        var startConvocatory = getUTCDate(startConvocatoryDate), endConvocatory = getUTCDate(endConvocatoryDate);

        var daysEINA = this.fillWeekDaysEINA(startConvocatory, WeekLetter.BOTH, DayEINAState.CULM_EXAM, startConvocatory.getDay() + 1, [CULM_COMMENT]);

        for (let date = this.oneMoreLastOne(daysEINA); date <= endConvocatory; date = this.oneMoreLastOne(daysEINA)) {
            let weekDay = WeekDay.SUN;
            if (addWeek(date) > endConvocatory) weekDay = endConvocatory.getDay() + 1;

            let newWeek = this.fillWeekDaysEINA(date, WeekLetter.BOTH, DayEINAState.SECOND_CONVOCATORY, weekDay, [SEC_CONV_COMMENT]);

            daysEINA = daysEINA.concat(newWeek);
            daysEINA.sort(sortByDate);

            if (this.oneMoreLastOne(daysEINA) <= endConvocatory) daysEINA = daysEINA.concat(this.fillWeekEndDaysEINA(this.oneMoreLastOne(daysEINA)));
        }

        return daysEINA;
    }

    private fillWeekDaysEINA(startDate: Date, weekLetter: WeekLetter, state: DayEINAState, toWeekDay: WeekDay, comment: string[]): Array<DayEINA> {
        let daysEINA = new Array<DayEINA>();
        var firstweekDay = startDate.getDay();
        var date = startDate;

        for (let weekDay = firstweekDay; weekDay !== toWeekDay; weekDay = (weekDay + 1) % TOTALWEEKDAY) {
            let dayEINA = new DayEINA({ date: getUTCDate(date), weekDay: weekDay, weekLetter: weekLetter, comment: comment, state: state });
            daysEINA.push(dayEINA);
            date.setDate(date.getDate() + 1);
        }

        daysEINA.sort(sortByDate);
        return daysEINA;
    }

    private fillSchoolWeekDaysEINA(startDate: Date, weekLetter: WeekLetter): Array<DayEINA> {
        var daysEINA = this.fillWeekDaysEINA(startDate, weekLetter, DayEINAState.SCHOOL, WeekDay.SAT, []);
        var day: Date = this.oneMoreLastOne(daysEINA);

        return daysEINA.concat(this.fillWeekEndDaysEINA(day));
    }

    private fillWeekEndDaysEINA(startDate: Date) {
        return this.fillWeekDaysEINA(startDate, WeekLetter.BOTH, DayEINAState.FESTIVE, WeekDay.MON, []);
    }

    private oneMoreLastOne(daysEINA: Array<DayEINA>): Date {
        let lastDate = daysEINA[daysEINA.length - 1].date;
        let date = getUTCDate(lastDate);
        date.setDate(date.getDate() + 1);
        return date;
    }

    private updateDay(newDay: DayEINA) {
        const date = this.days.findIndex(day => day.date == newDay.date);
        this.days.splice(date, 1);
        this.days.push(newDay);
    }

}

