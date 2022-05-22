import { INVALID_PERIOD_ENDDATE, INVALID_PERIOD_STARTDATE, PERIOD_OUT_OF_RANGE } from "./errorTypes";
import { Period } from "./period.value-object";

describe('Period', () => {
    it('create period', () => {
        let startDate = new Date('2022-02-06');
        let endDate = new Date('2022-07-02')
        
        let period = new Period(startDate,endDate)
        expect(period.startDate).toStrictEqual(new Date('2022-02-06'));
        expect(period.endDate).toStrictEqual(new Date('2022-07-02'));
    });
    it('create invalid startDate', () => {
        let startDate = new Date('2022-20-20');
        let endDate = new Date('2022-07-02');
        expect(() => new Period(startDate, endDate)).toThrow(INVALID_PERIOD_STARTDATE);
    });
    it('create invalid endDate', () => {
        let startDate = new Date('2022-02-06');
        let endDate = new Date('2022-15-10');
        expect(() => new Period(startDate, endDate)).toThrow(INVALID_PERIOD_ENDDATE);
    });
    it('create dates out of range', () => {
        let startDate = new Date('2022-02-06');
        let endDate = new Date('2022-01-10');
        expect(() => new Period(startDate, endDate)).toThrow(PERIOD_OUT_OF_RANGE);
    });
});