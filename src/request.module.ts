import { MailerModule } from '@nestjs-modules/mailer';
import { Module, Req } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { RespondRequestService } from './Application/respondRequest.service';
import { RequestController } from './Infrastructure/Controllers/request.controller';
import { ListRequestService } from './Application/listRequest.service';
import { SendRequestService } from './Application/sendRequest.service';
import { RequestRepository } from './Domain/request.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { RequestModel } from './Infrastructure/Models/request.model';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: "smtp.mailtrap.io",
                    secure: false,
                    auth: {
                        user: "781da2d65bf7fe",
                        pass: "b7025429d076f9"
                    },
                },
            }),
            inject: [ConfigService],
        }),
        SequelizeModule.forFeature([RequestModel])
    ],
    providers: [RespondRequestService, ListRequestService, SendRequestService, RequestRepository],
    controllers: [RequestController],
    exports: [RespondRequestService],
})
export class RequestModule { }

