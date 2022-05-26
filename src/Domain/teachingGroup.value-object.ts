
export class TeachingGroup {
    private _career: string;
    private _course: string;
    private _code: string;
    private _period: string;

    get career(): string {
        return this._career
    }
    get course(): string {
        return this._course
    }
    get code(): string {
        return this._code
    }
    get period(): string {
        return this._period
    }

    constructor(career: string, course: string, code: string, period: string) {
        this._career = career;
        this._course = course;
        this._code = code;
        this._period = period;
    }
}