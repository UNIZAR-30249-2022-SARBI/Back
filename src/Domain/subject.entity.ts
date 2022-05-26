export class Subject {
    private readonly _id: string;
    private _name: string;
    private _code: string;
    private _teachingGroupIds: string[];

    constructor(id: string, name: string, code: string, teachingGroupIds: string[]) {
        this._id = id;
        this._name = name;
        this._code = code;
        this._teachingGroupIds = teachingGroupIds;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get code(): string {
        return this._code;
    }

    get teachingGroupIds(): string[] {
        return this._teachingGroupIds
    }
}