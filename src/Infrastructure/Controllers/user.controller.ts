import { Controller } from '@nestjs/common';
import {
    MessagePattern,
    RmqContext,
    Ctx,
    Payload,
} from '@nestjs/microservices';
import { UserLoginService, userProps } from "../../Application/userLogin.service";
import { respond } from './rabbitmq';

@Controller()
export class UserController {
    constructor(
        private readonly userLoginService: UserLoginService,
    ) { }

    @MessagePattern('userLogin')
    public async userLogin(@Payload() data: any, @Ctx() context: RmqContext): Promise<userProps> {
        respond(context);
        return this.userLoginService.checkEmail(data.email);
    }
}
