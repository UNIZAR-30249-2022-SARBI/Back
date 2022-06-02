import { WeekDay } from "./dayEINA.entity";

export enum Periodicity {
    WEEK_A = 'Semana A',
    WEEK_B = 'Semana B',
    WEEKLY = 'Semanal'
}

export interface ScheduleSlotProps {
    startHour: string;
    endHour: string;
    weekDay: WeekDay;
    periodicity: Periodicity;
    location: string;
}

export class ScheduleSlot {
    private _startHour: string;
    private _endHour: string;
    private _weekDay: WeekDay;
    private _periodicity: Periodicity;
    private _location: string;

    get startHour(): string {
        return this._startHour
    }
    get endHour(): string {
        return this._endHour
    }
    get weekDay(): WeekDay {
        return this._weekDay
    }
    get periodicity(): Periodicity {
        return this._periodicity
    }
    get location(): string {
        return this._location;
    }
    constructor(startHour: string, endHour: string, weekDay: WeekDay, periodicity: Periodicity, location:string) {
        this._startHour = startHour;
        this._endHour = endHour;
        this._weekDay = weekDay;
        this._periodicity = periodicity;
        this._location = location;
    }
}