
export class ScheduleSlot {
    private _startHour: string;
    private _endHour: string;
    private _weekDay: string;
    private _periodicity: string;

    get startHour(): string {
        return this._startHour
    }
    get endHour(): string {
        return this._endHour
    }
    get weekDay(): string {
        return this._weekDay
    }
    get periodicity(): string {
        return this._periodicity
    }

    constructor(startHour: string, endHour: string, weekDay: string, periodicity: string) {
        this._startHour = startHour;
        this._endHour = endHour;
        this._weekDay = weekDay;
        this._periodicity = periodicity;
    }
}