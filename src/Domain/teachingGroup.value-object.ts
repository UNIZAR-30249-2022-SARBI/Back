import { v4 as uuidV4 } from 'uuid';


export class TeachingGroup {
    private readonly _id: string;
    private _career: string;
    private _course: string;
    private _code: string;
    private _period: string;

    get id(): string {
        return this._id;
    }

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

    constructor(id:string, career: string, course: string, code: string, period: string) {
        this._id = id ? id : uuidV4();
        this._career = career;
        this._course = course;
        this._period = period;
        this._code = code;
    }
}