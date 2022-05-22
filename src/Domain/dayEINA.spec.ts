import { DayEINA, DayEINAState, WeekDay, WeekLetter } from "./dayEINA.entity";
import { INVALID_DATE, INVALID_DAYEINA_STATE, INVALID_WEEKDAY, INVALID_WEEKLETTER } from "./errorTypes";

describe('DayEINAEntity', () => {
    it('create', () => {
        let date = new Date('2022-04-30');
        let weekLetter = 'A';
        let weekDay = 1;
        let state = 'SCHOOL';
        let dayEINA = new DayEINA(date, weekDay, WeekLetter[weekLetter], DayEINAState[state], []);
        expect(dayEINA.date).toStrictEqual(new Date('2022-04-30'));
        expect(dayEINA.weekLetter).toBe(WeekLetter.A)
        expect(dayEINA.weekDay).toBe(WeekDay.MON);
        expect(dayEINA.state).toBe(DayEINAState.SCHOOL);
        expect(dayEINA.comment).toStrictEqual([])
    });
    it('create invalid date', () => {
        let date = new Date('aaaa');
        let weekLetter = 'A';
        let weekDay = 1;
        let state = 'SCHOOL';
        expect(() => new DayEINA(date, weekDay, WeekLetter[weekLetter], DayEINAState[state], [])).toThrow(INVALID_DATE)
    });
    it('create invalid weekLetter', () => {
        let date = new Date('2022-04-30');
        let weekLetter = 'c';
        let weekDay = 1;
        let state = 'SCHOOL';
        expect(() => new DayEINA(date, weekDay, WeekLetter[weekLetter], DayEINAState[state], [])).toThrow(INVALID_WEEKLETTER);
    });
    it('create invalid weekLetter', () => {
        let date = new Date('2022-04-30');
        let weekLetter = 'c';
        let weekDay = 1;
        let state = 'SCHOOL';
        expect(() => new DayEINA(date, weekDay, WeekLetter[weekLetter], DayEINAState[state], [])).toThrow(INVALID_WEEKLETTER);
    });
    it('create invalid weekDay', () => {
        let date = new Date('2022-04-30');
        let weekLetter = 'A';
        let weekDay = -1;
        let state = 'SCHOOL';
        expect(() => new DayEINA(date, weekDay, WeekLetter[weekLetter], DayEINAState[state], [])).toThrow(INVALID_WEEKDAY);
    });
    it('create invalid dayEINAState', () => {
        let date = new Date('2022-04-30');
        let weekLetter = 'A';
        let weekDay = 1;
        let state = 'OTHERSTATE';
        expect(() => new DayEINA(date, weekDay, WeekLetter[weekLetter], DayEINAState[state], [])).toThrow(INVALID_DAYEINA_STATE);
    });
});