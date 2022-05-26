import { dateIsBefore } from './dateUtils';
import { INVALID_PERIOD_ENDDATE, INVALID_PERIOD_STARTDATE, PERIOD_OUT_OF_RANGE } from './errorTypes';

export type PeriodProps = {
    startDate: Date, endDate: Date;
};

export class Period {
    private _startDate: Date;
    private _endDate: Date;
    get startDate(): Date {
        return this._startDate
    }
    get endDate(): Date {
        return this._endDate
    }
    constructor(startDate: Date, endDate: Date) {
        this._startDate = new Date(startDate);
        this._endDate = new Date(endDate);
        this.validate();
    }
    private validate(): void {
        if (isNaN(this._startDate.getTime()))
            throw new Error(INVALID_PERIOD_STARTDATE);
        if (isNaN(this._endDate.getTime()))
            throw new Error(INVALID_PERIOD_ENDDATE);
        if (!dateIsBefore(this._startDate, this._endDate)) {
            throw new Error(PERIOD_OUT_OF_RANGE);
        }
    }
}