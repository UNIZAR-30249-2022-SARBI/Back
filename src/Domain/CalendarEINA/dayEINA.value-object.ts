import {ValueObject} from '../../Shared/value-object'

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

export class DayEINA extends ValueObject<DayEINAProps> {
    get date(): Date {
        return this._props.date;
    }

    get weekDay(): WeekDay {
        return this._props.weekDay;
    }

    get weekLetter(): WeekLetter {
        return this._props.weekLetter;
    }

    get state(): DayEINAState {
        return this._props.state;
    }

    get comment(): string[] {
        return this._props.comment;
    }

    protected validate(props: DayEINAProps): void {
        if (props.comment.length < 100) {
            //throw new (' is out of range');
        }
    }
}