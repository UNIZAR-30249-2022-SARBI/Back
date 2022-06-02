import { ScheduleSlot } from "./scheduleSlot.value-object";
import { v4 as uuidV4 } from 'uuid';
import { TeachingGroup } from "./teachingGroup.value-object";

export class GroupSubjectSchedule {
    private readonly _id: string;
    private _groupType: string;
    private _groupNumber: number;
    private _teachingGroup: TeachingGroup;
    private _subjectId: string;
    private _scheduleSlots: ScheduleSlot[];

    constructor(id: string, groupType: string, groupNumber: number, teachingGroup: TeachingGroup, subjectId: string, scheduleSlots: ScheduleSlot[]) {
        this._id = id ? id : uuidV4();
        this._groupType = groupType;
        this._groupNumber = groupNumber;
        this._teachingGroup = teachingGroup;
        this._subjectId = subjectId;
        this._scheduleSlots = scheduleSlots;
    }

    get id(): string {
        return this._id;
    }

    get groupType(): string {
        return this._groupType;
    }

    get groupNumber(): number {
        return this._groupNumber;
    }

    get teachingGroup(): TeachingGroup {
        return this._teachingGroup;
    }

    get subjectId(): string{
        return this._subjectId;
    }

    get scheduleSlots(): ScheduleSlot[] {
        return this._scheduleSlots;
    }

    public addSlot(newSlot:ScheduleSlot) {
        this._scheduleSlots?.push(newSlot);
    }

    public removeSlot(oldSlot: ScheduleSlot) {
        this._scheduleSlots = this._scheduleSlots?.filter(slot => JSON.stringify(slot) !== JSON.stringify(oldSlot));
    }

    set scheduleSlots(slots: ScheduleSlot[]){
        this._scheduleSlots = slots;
    }

    private slotSameHours(slot: ScheduleSlot, newSlot: ScheduleSlot): boolean {
        if (slot.startHour <= newSlot.startHour && newSlot.startHour <= slot.endHour)
            return true;
        if (slot.startHour <= newSlot.endHour && newSlot.endHour <= slot.endHour)
            return true;
        return false;
    }

    public checkIncompatibility(scheduleSlots:Array<ScheduleSlot>,newSlot: ScheduleSlot): boolean {
        let sameLocation = scheduleSlots.filter(slot => slot.location === newSlot.location )
        let sameHour = sameLocation?.filter(slot => this.slotSameHours(slot, newSlot))
        return sameHour?.length == 0;
    }

}