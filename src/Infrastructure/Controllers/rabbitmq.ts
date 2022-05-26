import {
    RmqContext,
    Ctx,
} from '@nestjs/microservices';

export function respond( context: RmqContext) {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
}
