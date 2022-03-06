import { Controller } from '@nestjs/common';

import {
  MessagePattern,
  RmqContext,
  Ctx,
  Payload,
} from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @MessagePattern('respond')
    public async login(@Payload() data: any, @Ctx() context: RmqContext): Promise<string> {
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();

        console.log('data', data);
        channel.ack(orginalMessage);
        return this.appService.login(data.email);
    }
}
