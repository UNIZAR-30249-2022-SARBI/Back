import { CalendarEINA, PeriodCalendarEINA } from "./calendarEINA.entity";
import { DayEINA } from "./dayEINA.entity";
import { INVALID_CALENDAREINA_PERIODS, INVALID_COURSE } from "./errorTypes";
import { Period } from "./period.value-object";

describe('CalendarEINA', () => {
    it('create calendarEINA', () => {
        let course = '2021-22';
        let version = 1
        var periods = new Map<PeriodCalendarEINA, Period>();
        periods.set(PeriodCalendarEINA.FIRST_QUARTER, new Period(new Date("2021-09-11"), new Date("2022-02-01")));
        periods.set(PeriodCalendarEINA.SECOND_QUARTER, new Period(new Date("2022-02-07"), new Date("2022-07-02")));
        periods.set(PeriodCalendarEINA.SECOND_CONVOCATORY, new Period(new Date("2022-08-31"), new Date("2022-09-13")));
        var calendarEINA = new CalendarEINA(null, course, version, periods);
        calendarEINA.days = new Array<DayEINA>();
        expect(calendarEINA.course).toBe('2021-22')
        expect(calendarEINA.version).toBe(1)
        expect(calendarEINA.periods).toStrictEqual(periods);
        expect(calendarEINA.days).toStrictEqual([]);
    });

    it('create invalid course', () => {
        let course = '2022-21';
        let version = 1;
        var periods = new Map<PeriodCalendarEINA, Period>();
        expect(() => new CalendarEINA(null, course, version, periods)).toThrow(INVALID_COURSE);
        course = '2122';
        expect(() => new CalendarEINA(null, course, version, periods)).toThrow(INVALID_COURSE);
        course = 'abcd';
        expect(() => new CalendarEINA(null, course, version, periods)).toThrow(INVALID_COURSE);
    });

    it('create invalid periods', () => {
        let course = '2021-22';
        let version = 1;
        var periods = new Map<PeriodCalendarEINA, Period>();
        periods.set(PeriodCalendarEINA.FIRST_QUARTER, new Period(new Date("2021-09-11"), new Date("2022-02-01")));
        periods.set(PeriodCalendarEINA.SECOND_QUARTER, new Period(new Date("2022-02-07"), new Date("2022-07-02")));
        periods.set(PeriodCalendarEINA.SECOND_CONVOCATORY, new Period(new Date("2021-08-31"), new Date("2021-09-13")));
        expect(() => new CalendarEINA(null, course, version, periods)).toThrow(INVALID_CALENDAREINA_PERIODS);
        periods.set(PeriodCalendarEINA.SECOND_CONVOCATORY, new Period(new Date("2021-09-11"), new Date("2021-10-11")));
        expect(() => new CalendarEINA(null, course, version, periods)).toThrow(INVALID_CALENDAREINA_PERIODS);
    });
});