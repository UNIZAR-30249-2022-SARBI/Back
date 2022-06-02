import {
    Controller,
} from '@nestjs/common';
import {
    MessagePattern,
    RmqContext,
    Ctx,
    Payload,
} from '@nestjs/microservices';
import { respond } from './rabbitmq';
import { RespondRequestService } from '../../Application/respondRequest.service';
import { Request } from '../../Domain/request.entity';
import { SendRequestService } from '../../Application/sendRequest.service';
import { ListRequestService } from '../../Application/listRequest.service';

@Controller()
export class RequestController {
    constructor(
        private readonly respondService: RespondRequestService,
        private readonly sendService: SendRequestService,
        private readonly listService: ListRequestService
    ) { }

    @MessagePattern('acceptRequest')
    async accept(@Payload() data: any, @Ctx() context: RmqContext): Promise<boolean> {
        await this.respondService.accept(data.requestId, data.comment);
        respond(context);
        return true;
    }

    @MessagePattern('rejectRequest')
    async reject(@Payload() data: any, @Ctx() context: RmqContext): Promise<boolean> {
        await this.respondService.reject(data.requestId, data.comment);
        respond(context);
        return true;
    }

    @MessagePattern('sendRequest')
    async send(@Payload() data: any, @Ctx() context: RmqContext): Promise<boolean> {
        await this.sendService.send(data.description,data.email,data.location);
        respond(context);
        return true;
    }

    @MessagePattern('listRequests')
    async list(@Payload() data: any, @Ctx() context: RmqContext): Promise<Array<Request>> {
        let requests = await this.listService.listAll();
        respond(context);
        return requests;
    }
}