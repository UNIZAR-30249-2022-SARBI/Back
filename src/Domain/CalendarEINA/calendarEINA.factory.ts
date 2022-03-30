import { PeriodsCalendarEINA } from '../../Application/Controller/calendarEINA.types';
import {CalendarEINA, CalendarEINAPeriod} from './calendarEINA.entity'
import { DayEINA, DayEINAProps, DayEINAState, WeekDay, WeekLetter} from './dayEINA.value-object';

const TOTALWEEKDAY: number = 7;
const CULM_COMMENT = 'Exámenes CULM';
const SEC_CONV_COMMENT = 'Exámenes 2ª conv';

export class CalendarEINAFactory {
    public create(period: CalendarEINAPeriod, startPeriod:Date, endPeriod:Date, iniCourseYear:number): CalendarEINA {
        var daysEINA: Array<DayEINA> = [];
        var startDate = new Date(startPeriod);
        var endDate = new Date(endPeriod);

        if (period === CalendarEINAPeriod.SECOND_CONVOCATORY) {
            daysEINA = this.dayConvocatory(startDate, endDate);
        } else {
            daysEINA = this.daySemester(startDate, endDate);
        }

        var calendar = new CalendarEINA(iniCourseYear, period);
        calendar.setDays(daysEINA);
        return calendar;
    }

    private daySemester(startSemester: Date, endSemester: Date): Array<DayEINA> {
        var daysEINA = this.fillSchoolWeekDaysEINA(startSemester, WeekLetter.BOTH);
        daysEINA.sort(this.sortByDate);
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

    private dayConvocatory(startConvocatory: Date, endConvocatory: Date): Array<DayEINA> {
        var daysEINA = this.fillWeekDaysEINA(startConvocatory, WeekLetter.BOTH, DayEINAState.CULM_EXAM, startConvocatory.getDay() + 1, [CULM_COMMENT]);

        for (let date = this.oneMoreLastOne(daysEINA); date <= endConvocatory; date = this.oneMoreLastOne(daysEINA)) {
            let weekDay = WeekDay.SUN;
            if (this.addWeek(date) > endConvocatory) weekDay = endConvocatory.getDay() + 1;

            let newWeek = this.fillWeekDaysEINA(date, WeekLetter.BOTH, DayEINAState.SECOND_CONVOCATORY, weekDay, [SEC_CONV_COMMENT]);

            daysEINA=daysEINA.concat(newWeek)
            daysEINA.sort(this.sortByDate);

            if (this.oneMoreLastOne(daysEINA) <= endConvocatory) daysEINA = daysEINA.concat(this.fillWeekEndDaysEINA(this.oneMoreLastOne(daysEINA)));
        }

        return daysEINA;
    }
    
    private fillWeekDaysEINA(startDate: Date, weekLetter: WeekLetter, state: DayEINAState, toWeekDay: WeekDay, comment: string[]): Array<DayEINA> {
        let daysEINA = new Array<DayEINA>();
        var firstweekDay = startDate.getDay();
        var date = startDate;

        for (let weekDay = firstweekDay; weekDay !== toWeekDay; weekDay = (weekDay + 1) % TOTALWEEKDAY) {
            let dayEINA = new DayEINA({ date: this.getUTCDate(date), weekDay: weekDay, weekLetter: weekLetter, comment: comment, state: state });
            daysEINA.push(dayEINA);
            date.setDate(date.getDate() + 1);
        }

        daysEINA.sort(this.sortByDate);
        return daysEINA;
    }

    private fillSchoolWeekDaysEINA(startDate: Date, weekLetter: WeekLetter): Array<DayEINA> {
        var daysEINA = this.fillWeekDaysEINA(startDate, weekLetter, DayEINAState.SCHOOL, WeekDay.SAT, []);
        var day: Date = this.oneMoreLastOne(daysEINA);

        return daysEINA.concat(this.fillWeekEndDaysEINA(day));
    }

    private fillWeekEndDaysEINA(startDate: Date) {
        return this.fillWeekDaysEINA(startDate, WeekLetter.BOTH, DayEINAState.FESTIVE, WeekDay.MON,[]);
    }

    private oneMoreLastOne(daysEINA: Array<DayEINA>): Date {
        let lastDate = daysEINA[daysEINA.length - 1].date;
        let date = this.getUTCDate(lastDate);
        date.setDate(date.getDate() + 1);
        return date;
    }

    private addWeek(date) {
        let newDate = new Date(date);
        newDate.setDate(date.getDate() + TOTALWEEKDAY);
        return newDate;
    }

    private getUTCDate(date: Date) {
        let thisDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
        return thisDate;
    }

    private sortByDate(a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
}