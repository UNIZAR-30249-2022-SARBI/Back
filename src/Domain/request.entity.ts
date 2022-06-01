import { v4 as uuidV4 } from 'uuid';

export class Request {
    private readonly _id: string;
    private _description: string;
    private _applicantEmail: string;
    private _location: string;

    constructor(id: string, desc: string, email: string, loc: string) {
        this._id = id ? id : uuidV4();
        this._description = desc;
        this._applicantEmail = email;
        this._location = loc;
    }

    get id(): string {
        return this._id;
    }

    get description(): string {
        return this._description;
    }

    get applicantEmail(): string {
        return this._applicantEmail;
    }

    get location(): string {
        return this._location;
    }
}