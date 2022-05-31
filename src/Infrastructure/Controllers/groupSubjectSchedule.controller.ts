import { Controller } from '@nestjs/common';
import {
    MessagePattern,
    RmqContext,
    Ctx,
    Payload,
} from '@nestjs/microservices';
import { respond } from './rabbitmq';
import { CreateScheduleService } from 'src/Application/createSchedule.service';
import { ListTeachingGroupService } from '../../Application/listTeachingGroup.service';
import { TeachingGroup } from '../../Domain/teachingGroup.value-object';

@Controller()
export class GroupSubjectScheduleController {
    constructor(
        private readonly createScheduleService: CreateScheduleService,
        private readonly listService: ListTeachingGroupService
    ) { }

    @MessagePattern('createSchedule')
    public async createSchedule(@Payload() data: any, @Ctx() context: RmqContext): Promise<Boolean> {
        const isCreated = await this.createScheduleService.createSchedule(data.groupType, data.groupNumber, data.teachingGroup, data.subjectIds, data.scheduleSlots);
        respond(context);
        return isCreated; 
    }
    @MessagePattern('listAllTeachingGroups')
    async listByTeachingGroup(@Payload() data: any, @Ctx() context: RmqContext): Promise<Array<TeachingGroup>> {
        let teachingGroups = await this.listService.listTeachingGroups();
        respond(context);
        return teachingGroups;
    }
}