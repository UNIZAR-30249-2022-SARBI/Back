import { Controller } from '@nestjs/common';
import {
    MessagePattern,
    RmqContext,
    Ctx,
    Payload,
} from '@nestjs/microservices';
import { respond } from './rabbitmq';
import { AddScheduleSlotService } from 'src/Application/addScheduleSlot.service';
import { ListTeachingGroupService } from '../../Application/listTeachingGroup.service';
import { TeachingGroup } from '../../Domain/teachingGroup.value-object';
import { ScheduleSlot, ScheduleSlotProps } from '../../Domain/scheduleSlot.value-object';
import { ListScheduleByTeachingGroupService } from '../../Application/listScheduleByTeachingGroup.service';
import { RemoveScheduleSlotService } from '../../Application/removeScheduleSlot.service';

@Controller()
export class GroupSubjectScheduleController {
    constructor(
        private readonly createScheduleService: AddScheduleSlotService,
        private readonly listTeachingGroupService: ListTeachingGroupService,
        private readonly listScheduleService: ListScheduleByTeachingGroupService,
        private readonly removeScheduleService: RemoveScheduleSlotService
    ) { }

    @MessagePattern('addScheduleSlot')
    public async addScheduleSlot(@Payload() data: any, @Ctx() context: RmqContext): Promise<Boolean> {
        const slot: ScheduleSlotProps = data.slot;
        const isCreated = await this.createScheduleService.addScheduleSlot(data.code, data.period, data.subjectId,
            data.groupType, data.groupNumber, slot);
        respond(context);
        return isCreated;
    }

    @MessagePattern('removeScheduleSlot')
    public async removeScheduleSlot(@Payload() data: any, @Ctx() context: RmqContext): Promise<Boolean> {
        const slot: ScheduleSlotProps = data.slot;
        const isRemoved = await this.removeScheduleService.removeScheduleSlot(data.code, data.period, data.subjectId,
            data.groupType, data.groupNumber, slot);
        respond(context);
        return isRemoved;
    }

    @MessagePattern('listScheduleByTeachingGroup')
    async listScheduleByTeachingGroup(@Payload() data: any, @Ctx() context: RmqContext): Promise<Array<ScheduleSlot>> {
        let slots = await this.listScheduleService.list(data.code,data.period);
        respond(context);
        return slots;
    }

    @MessagePattern('listAllTeachingGroups')
    async listByTeachingGroup(@Payload() data: any, @Ctx() context: RmqContext): Promise<Array<TeachingGroup>> {
        let teachingGroups = await this.listTeachingGroupService.listTeachingGroups();
        respond(context);
        return teachingGroups;
    }
}