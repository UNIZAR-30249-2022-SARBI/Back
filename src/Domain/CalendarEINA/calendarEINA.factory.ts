import { PeriodsCalendarEINA } from '../../Application/Controller/calendarEINA.types';
import {CalendarEINA, CalendarEINAPeriod} from './calendarEINA.entity'
import { DayEINA, DayEINAProps, DayEINAState, WeekDay, WeekLetter} from './dayEINA.value-object';

const TOTALWEEKDAY:number = 7;

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
       // console.log('!                    !Calendar' + JSON.stringify(daysEINA))
        var calendar = new CalendarEINA(iniCourseYear, period);
        calendar.setDays(daysEINA);

        return calendar;
    }

    private daySemester(startSemester: Date, endSemester: Date): Array<DayEINA> {
        var daysEINA = this.fillSchoolWeekDaysEINA(startSemester, WeekLetter.BOTH);
        daysEINA.sort(this.sortByDate);
          
        var numberWeek = 0;
        for (let date = this.addDay(daysEINA); date <= endSemester; date = this.addDay(daysEINA)) {
            console.log("      $$$$DATE---!" + date + " & " + endSemester  );
          //  console.log('!                    !CalendarBefore' + JSON.stringify(daysEINA))

            var weekLetter = WeekLetter.BOTH;
            if (numberWeek < 14) {
                weekLetter = numberWeek % 2 == 0 ? WeekLetter.A : WeekLetter.B;
                numberWeek++;
            }
            let newWeek = this.fillSchoolWeekDaysEINA(date, weekLetter);
            console.log('!                    !newWeek' + JSON.stringify(newWeek))

            daysEINA = daysEINA.concat(newWeek);
           // console.log('!                    !Calendar' + JSON.stringify(daysEINA))

        }

        return daysEINA;
    }
    private addWeek(date) {
        let newDate = new Date (date);
        newDate.setDate(date.getDate() + TOTALWEEKDAY)
        return newDate;
    }
    /*if (this.addWeek(date) >= endConvocatory) {
    var finalDay = endConvocatory
    finalDay.setDate(date.getDate() - 7);
    date = new Date(finalDay)
}*/
    private dayConvocatory(startConvocatory: Date, endConvocatory: Date): Array<DayEINA> {
        var daysEINA = new Array<DayEINA>();
        var numberWeek = 0;
        for (let date = startConvocatory; date <= endConvocatory; date = this.addDay(daysEINA)) {
            let weekDay = WeekDay.SUN;
            if (this.addWeek(date) > endConvocatory) weekDay = endConvocatory.getDay()+1;
            let newWeek = this.fillWeekDaysEINA(date, WeekLetter.BOTH, DayEINAState.SECOND_CONVOCATORY, weekDay );
            daysEINA=daysEINA.concat(newWeek)
            daysEINA.sort(this.sortByDate);
           // console.log("%%%%%%%%%%%%%%%%%%   START---!" + JSON.stringify(daysEINA));
            if (this.addDay(daysEINA) <= endConvocatory) daysEINA = daysEINA.concat(this.fillWeekEndDaysEINA(this.addDay(daysEINA)));
        }
        return daysEINA;
    }

    private sortByDate(a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }

    private fillWeekDaysEINA(startDate: Date, weekLetter: WeekLetter, state: DayEINAState, toWeekDay: WeekDay): Array<DayEINA> {
        let daysEINA = new Array<DayEINA>();
        var firstweekDay = startDate.getDay();
        var date = startDate;
        console.log("   &&&STARTING!"+date+"---"+toWeekDay);

        for (let weekDay = firstweekDay; weekDay !== toWeekDay; weekDay = (weekDay + 1) % TOTALWEEKDAY) {
            let dayEINA = new DayEINA({ date: this.getUTCDate(date), weekDay: weekDay, weekLetter: weekLetter, comment: [], state: state });
         //   console.log("START---!" + JSON.stringify(dayEINA));
           // console.log("cond---!" + weekDay + "&&" + toWeekDay + "==="+( weekDay != toWeekDay));
            daysEINA.push(dayEINA);
            date.setDate(date.getDate() + 1);
            console.log("                   ##############START---!" + JSON.stringify(dayEINA));
        }
        daysEINA.sort(this.sortByDate);
        //console.log("FINISHING!");
        //console.log("%%%%%%%%%%%%%%%%%%   START---!" + JSON.stringify(daysEINA));

        return daysEINA;
    }
    private getUTCDate(date: Date) {
        let thisDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
        return thisDate
    }
    private fillSchoolWeekDaysEINA(startDate: Date, weekLetter: WeekLetter): Array<DayEINA> {
        var daysEINA = this.fillWeekDaysEINA(startDate, weekLetter, DayEINAState.SCHOOL, WeekDay.SAT);
        var day: Date = this.addDay(daysEINA);
        console.log("       ---!" + JSON.stringify(day));

        return daysEINA.concat(this.fillWeekEndDaysEINA(day));
    }
    private addDay(daysEINA: Array<DayEINA>): Date {
        let lastDate = daysEINA[daysEINA.length - 1].date
        let date = this.getUTCDate(lastDate)
        date.setDate(date.getDate() + 1)
        return date;
    }
    private fillWeekEndDaysEINA(startDate: Date) {
        return this.fillWeekDaysEINA(startDate, WeekLetter.BOTH, DayEINAState.FESTIVE, WeekDay.MON);
    }
}