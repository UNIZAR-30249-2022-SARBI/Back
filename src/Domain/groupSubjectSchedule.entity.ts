import { ScheduleSlot } from "./scheduleSlot.value-object";
import { Subject } from "./subject.entity";

export class GroupSubjectSchedule {
    private readonly _id: string;
    private _groupType: string;
    private _teachingGroup: number;
    private _subjectIds: string[];
    private _scheduleSlots: ScheduleSlot[];

    constructor(id: string, groupType: string, teachingGroup: number, subjectIds: string[], scheduleSlots: ScheduleSlot[]) {
        this._id = id;
        this._groupType = groupType;
        this._teachingGroup = teachingGroup;
        this._subjectIds = subjectIds;
        this._scheduleSlots = scheduleSlots;
    }

    get id(): string {
        return this._id;
    }

    get groupType(): string {
        return this._groupType;
    }

    get teachingGroup(): number {
        return this._teachingGroup;
    }

    get subjectIds(): string[]{
        return this._subjectIds;
    }

    get scheduleSlots(): ScheduleSlot[]{
        return this._scheduleSlots;
    }
}