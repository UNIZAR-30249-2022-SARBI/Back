import { INVALID_DATE, INVALID_DAYEINA_STATE, INVALID_WEEKDAY, INVALID_WEEKLETTER } from "./errorTypes";

export enum DayEINAState {
    FESTIVE = "FESTIVE",
    CONVOCATORY = "CONVOCATORY",
    SECOND_CONVOCATORY = "SECOND_CONVOCATORY",
    CONTINUE_CONVOCATORY = "CONTINUE_CONVOCATORY",
    NO_SCHOOL = "NO_SCHOOL",
    SCHOOL = "SCHOOL",
    CHANGE_DAY = "CHANGE_DAY",
    CULM_EXAM = "CULM_EXAM"
}

export enum WeekLetter {
    A = 'A',
    B = 'B',
    BOTH = ''
}

export enum WeekDay {
    MON = 1,
    TUE = 2,
    WED = 3,
    THU = 4,
    FRI = 5,
    SAT = 6,
    SUN = 0
}

export interface DayEINAProps {
    date: Date;
    weekDay: WeekDay;
    weekLetter: WeekLetter;
    state: DayEINAState;
    comment: string[];
}


export class DayEINA {
    private _date: Date;
    private _weekDay: WeekDay;
    private _weekLetter: WeekLetter;
    private _state: DayEINAState;
    private _comment: string[];

    constructor(date: Date, weekDay: WeekDay, weekLetter: WeekLetter, state: DayEINAState, comment: string[]) {
        this._date = date;
        this._weekDay = weekDay;
        this._weekLetter = weekLetter;
        this._state = state;
        this._comment = comment;
        this.validate();
    }

    get date(): Date {
        return this._date;
    }

    get weekDay(): WeekDay {
        return this._weekDay;
    }

    get weekLetter(): WeekLetter {
        return this._weekLetter;
    }

    get state(): DayEINAState {
        return this._state;
    }

    get comment(): string[] {
        return this._comment;
    }
    private validate(): void {
        if (isNaN(this._date.getTime()))
            throw new Error(INVALID_DATE);
        if (this._weekLetter != WeekLetter.BOTH && !this._weekLetter)
            throw new Error(INVALID_WEEKLETTER);
        if (!(this._weekDay in WeekDay))
            throw new Error(INVALID_WEEKDAY);
        if (!this._state)
            throw new Error(INVALID_DAYEINA_STATE);
    }
}