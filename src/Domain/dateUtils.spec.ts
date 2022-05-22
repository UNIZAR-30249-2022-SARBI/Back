import { addOneDay, addWeek, dateBetween, dateIsBefore, diffDays, getUTCDate, sortByDate } from './dateUtils';

describe('DateUtils', () => {
    it('addOneDay', () => {
        let date = new Date('2022-04-29');
        expect(addOneDay(date)).toStrictEqual(new Date('2022-04-30'));
    });
    it('addOneDay to end of month', () => {
        let date = new Date('2022-04-30')
        expect(addOneDay(date)).toStrictEqual(new Date('2022-05-01'));
    });
    it('addOneDay to end of year', () => {
        let date = new Date('2022-12-31');
        expect(addOneDay(date)).toStrictEqual(new Date('2023-01-01'));
    });

    it('date1 is before date2 ', () => {
        let d1 = new Date('2022-04-30');
        let d2 = new Date('2022-05-01')
        expect(dateIsBefore(d1,d2)).toBe(true);
    });
    it('date1 is equal date2 ', () => {
        let d1 = new Date('2022-04-30');
        let d2 = new Date('2022-04-30');
        expect(dateIsBefore(d1, d2)).toBe(false);
    });
    it('date1 is after date2 ', () => {
        let d1 = new Date('2022-05-01');
        let d2 = new Date('2022-04-30');
        expect(dateIsBefore(d1, d2)).toBe(false);
    });

    it('addWeek to end of month', () => {
        let date = new Date('2022-04-29');
        expect(addWeek(date)).toStrictEqual(new Date('2022-05-06'));
    });
    it('addWeek to end of year', () => {
        let date = new Date('2022-12-31');
        expect(addWeek(date)).toStrictEqual(new Date('2023-01-07'));
    });

    it('getUTCDate', () => {
        let date = new Date('2022-04-30T05:00:00.000Z');
        expect(getUTCDate(date)).toStrictEqual(new Date('2022-04-30'));
    });

    it('sortByDate greater', () => {
        let d1 = new Date('2022-04-30');
        let d2 = new Date('2022-04-20');
        expect(sortByDate({ date: d1 }, { date: d2 })).toBeGreaterThan(0);
    });

    it('sortByDate equal', () => {
        let d1 = new Date('2022-04-30');
        let d2 = new Date('2022-04-30');
        expect(sortByDate({ date: d1 }, { date: d2 })).toBe(0);
    });

    it('sortByDate less', () => {
        let d1 = new Date('2022-04-20');
        let d2 = new Date('2022-04-30');
        expect(sortByDate({ date: d1 }, { date: d2 })).toBeLessThan(0);
    });

    it('dateBetween', () => {
        let d1 = new Date('2022-04-20');
        let d2 = new Date('2022-04-30');
        let date = new Date('2022-04-25')
        expect(dateBetween(date, d1, d2)).toBe(true);
        expect(dateBetween(d1, d1, d2)).toBe(true);
        expect(dateBetween(d2, d1, d2)).toBe(true);
    });

    it('dateBetween false', () => {
        let d1 = new Date('2022-04-20');
        let d2 = new Date('2022-04-30');
        let date = new Date('2022-04-10');
        expect(dateBetween(date, d1, d2)).toBe(false);
        date = new Date('2022-05-10');
        expect(dateBetween(date, d1, d2)).toBe(false);
    });

    it('diffDays', () => {
        let d1 = new Date('2022-04-20');
        let d2 = new Date('2022-04-30');
        expect(diffDays(d1, d2)).toBe(10);
        expect(diffDays(d2, d1)).toBe(-10);
    });
});
