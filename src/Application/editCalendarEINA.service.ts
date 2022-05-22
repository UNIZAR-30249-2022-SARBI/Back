import { Injectable } from "@nestjs/common";
import { CalendarEINARepository } from "../Domain/calendarEINA.repository";
import { CalendarEINA, PeriodCalendarEINA } from "../Domain/calendarEINA.entity";
import { DayEINA, DayEINAProps, DayEINAState, WeekDay, WeekLetter } from '../Domain/dayEINA.entity';
import { Period, PeriodProps } from "../Domain/period.value-object";
import { addOneDay, dateBetween, dateIsBefore, diffDays, getUTCDate } from "../Domain/dateUtils";

@Injectable()
export class EditCalendarEINAService {
    constructor(
        private calendarEINARepository: CalendarEINARepository
    ) { }

    public async editDayEINA(props: DayEINAProps, course: string, version: number): Promise<Boolean> {
        try {
            let dayEINA = new DayEINA(new Date(props.date), props.weekDay, props.weekLetter, props.state, props.comment);
            let calendar = await this.calendarEINARepository.findByCourseAndVersion(course, version);
            if (calendar) {
                await this.calendarEINARepository.saveDayInCalendar(dayEINA, calendar);
                return true;
            } else
                return false;
        } catch(err) {
            //console.error(err);
            return false;
        }
    }

    public async editCalenarEINA(firstSemester: PeriodProps, secondSemester: PeriodProps, secondConvocatory: PeriodProps, course: string, version: number): Promise<Boolean> {
        try {
            let calendar: CalendarEINA = await this.calendarEINARepository.findByCourseAndVersion(course, version);
            var daysEINA = new Array<DayEINA>();
            if (calendar) {
                daysEINA = await this.calendarEINARepository.findDaysByCalendarEINA(calendar);
                calendar.days = daysEINA;
                var periods = new Map<PeriodCalendarEINA, Period>();
                periods.set(PeriodCalendarEINA.FIRST_QUARTER, new Period(firstSemester.startDate, firstSemester.endDate));
                periods.set(PeriodCalendarEINA.SECOND_QUARTER, new Period(secondSemester.startDate, secondSemester.endDate));
                periods.set(PeriodCalendarEINA.SECOND_CONVOCATORY, new Period(secondConvocatory.startDate, secondConvocatory.endDate));
                calendar = this.updatePeriods(calendar, periods);
                await this.calendarEINARepository.update(calendar);
                console.log(calendar)
                return true;
            } else {
                return false;
            }
        } catch(err) {
            //console.error(err);
            return false;
        }
    }

    private updatePeriods(calendar: CalendarEINA, newPeriods: Map<PeriodCalendarEINA, Period>): CalendarEINA {
        var daysEINA = new Array<DayEINA>();

        newPeriods.forEach((period, type) => {
            var newDays = this.updateDays(period, calendar.getDaysOfPeriod(type));
            daysEINA = daysEINA.concat(newDays);
        });
        calendar.days = daysEINA;
        calendar.periods = newPeriods;
        return calendar;

    }

    private updateDays(period: Period, days: Array<DayEINA>) {
        var newDays = days.filter(day => dateBetween(day.date, period.startDate, period.endDate));
        var oldStartDate = newDays[0].date;
        var newStartDate = period.startDate;
        var oldEndDate = newDays[newDays.length - 1].date;
        var newEndDate = period.endDate;
        if (dateIsBefore(newStartDate, oldStartDate)) {
            let diff = diffDays(newStartDate, oldStartDate);
            let date = new Date(newStartDate);
            for (let i = 0; i < diff; i++) {
                let weekDay = date.getDay();
                let state = weekDay == WeekDay.SAT || weekDay == WeekDay.SUN ? DayEINAState.FESTIVE : DayEINAState.SCHOOL;
                newDays.unshift(new DayEINA(getUTCDate(date), weekDay , WeekLetter.BOTH, state , []));
                date = addOneDay(date);
            }
        }
        if (dateIsBefore(oldEndDate, newEndDate)) {
            let diff = diffDays(oldEndDate, newEndDate);

            let date = new Date(addOneDay(oldEndDate));
            for (let i = 0; i < diff; i++) {
                let weekDay = date.getDay();
                let state = weekDay == WeekDay.SAT || weekDay == WeekDay.SUN ? DayEINAState.FESTIVE : DayEINAState.SCHOOL;
                newDays.push(new DayEINA(getUTCDate(date), weekDay, WeekLetter.BOTH, state, []));
                date = addOneDay(date);
            }
        }
        return newDays;
    }
}



