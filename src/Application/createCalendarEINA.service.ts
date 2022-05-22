import { Injectable } from "@nestjs/common";
import { CalendarEINARepository } from "../Domain/calendarEINA.repository";
import { Period, PeriodProps } from "../Domain/period.value-object";
import { CalendarEINA, PeriodCalendarEINA } from "../Domain/calendarEINA.entity";
import { addOneDay, addWeek, dateBetween, getUTCDate, sortByDate, TOTALWEEKDAY } from "../Domain/dateUtils";
import { DayEINA, DayEINAState, WeekDay, WeekLetter } from '../Domain/dayEINA.entity';
const CULM_COMMENT = 'Exámenes CULM';
const SEC_CONV_COMMENT = 'Exámenes 2ª conv';

type PeriodsCalendarEINAData = {
    firstSemester: { startDate: Date, endDate: Date; },
    secondSemester: { startDate: Date, endDate: Date; },
    secondConvocatory: { startDate: Date, endDate: Date; }
};

@Injectable()
export class CreateCalendarEINAService {
    constructor(
        private calendarEINARepository: CalendarEINARepository) { }

    public async createCalendarEINA(firstSemester: PeriodProps, secondSemester: PeriodProps, secondConvocatory: PeriodProps, course: string, version: number): Promise<Boolean> {
        try {
            var periods = new Map<PeriodCalendarEINA, Period>();
            if(firstSemester)periods.set(PeriodCalendarEINA.FIRST_QUARTER, new Period(firstSemester.startDate, firstSemester.endDate));
            if(secondSemester)periods.set(PeriodCalendarEINA.SECOND_QUARTER, new Period(secondSemester.startDate, secondSemester.endDate));
            if (secondConvocatory) {
                periods.set(PeriodCalendarEINA.SECOND_CONVOCATORY, new Period(secondConvocatory.startDate, secondConvocatory.endDate));
            }
            var calendarEINA = new CalendarEINA(null, course, version, periods);
            if (secondConvocatory)
                calendarEINA.days = this.fillDaysEINA(calendarEINA);
            let result = await this.calendarEINARepository.save(calendarEINA);
            return result ? true : false;
            
        } catch (err) { 
            console.error(err)
            return false
        }
    }

    public fillDaysEINA(calendarEINA: CalendarEINA): Array<DayEINA> {
        return this.daySemester(calendarEINA.periods.get(PeriodCalendarEINA.FIRST_QUARTER))
            .concat(this.daySemester(calendarEINA.periods.get(PeriodCalendarEINA.SECOND_QUARTER)))
            .concat(this.dayConvocatory(calendarEINA.periods.get(PeriodCalendarEINA.SECOND_CONVOCATORY)));
    }

    private daySemester(period: Period): Array<DayEINA> {
        var startSemester = getUTCDate(period.startDate), endSemester = getUTCDate(period.endDate);
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

    private dayConvocatory(period: Period): Array<DayEINA> {
        var startConvocatory = getUTCDate(period.startDate), endConvocatory = getUTCDate(period.endDate);

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
            let dayEINA = new DayEINA(getUTCDate(date), weekDay, weekLetter, state, comment);

            daysEINA.push(dayEINA);
            date=addOneDay(date)
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
        date = addOneDay(date)
        return date;
    }

}



