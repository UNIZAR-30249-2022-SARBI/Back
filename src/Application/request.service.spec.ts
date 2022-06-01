import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarEINARepository } from '../Domain/calendarEINA.repository';
import { Sequelize } from "sequelize-typescript";
import { UserLoginService } from './userLogin.service';
import { UploadSubjectService } from './uploadSubject.service';
import * as fs from 'fs';
import { SubjectModel, SubjectTeachingGroupModel } from '../Infrastructure/Models/subject.model';
import { SubjectRepository } from '../Domain/subject.repository';
import { TeachingGroupModel } from '../Infrastructure/Models/teachingGroup.model';
import { ScheduleSlotModel } from '../Infrastructure/Models/scheduleSlot.model';
import { GroupSubjectScheduleModel } from '../Infrastructure/Models/groupSubjectSchedule.model';
import { GroupSubjectScheduleRepository } from '../Domain/groupSubjectSchedule.repository';
import { ListSubjectService } from './listSubject.service';
import { RequestModel } from '../Infrastructure/Models/request.model';
import { RequestRepository } from '../Domain/request.repository';
import { ListRequestService } from './listRequest.service';
import { SendRequestService } from './sendRequest.service';
import { RespondRequestService } from './respondRequest.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module, Req } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';

const DESC = "____test_request_description___"


describe('Subject Services', () => {
    let sendService: SendRequestService;
    let listService: ListRequestService;
    let respondService: RespondRequestService;
    let sequelize: Sequelize;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [SequelizeModule.forRoot({
                dialect: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: 'admin779799',
                database: 'gicuz',
                models: [RequestModel],
                autoLoadModels: true,
                synchronize: true,
                define: { timestamps: false },
                logging: false
            }), SequelizeModule.forFeature([RequestModel]),
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
            controllers: [],
            providers: [RequestRepository, ListRequestService, SendRequestService, RespondRequestService],
        }).compile();
        listService = moduleRef.get<ListRequestService>(ListRequestService);
        sendService = moduleRef.get<SendRequestService>(SendRequestService);
        respondService = moduleRef.get<RespondRequestService>(RespondRequestService);
        sequelize = moduleRef.get<Sequelize>(Sequelize);

    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('accept request', async () => {
        expect(await sendService.send(DESC, "779799@unizar.es", "")).toBe(true);
        let reqs = (await listService.listAll()).filter(r => r.description === DESC);
        expect(reqs.length).toBe(1)
        if (reqs && reqs.length > 0)
            expect(await respondService.accept(reqs[0].id,"_comentario_")).toBe(true);
    });

    it('reject request', async () => {
        expect(await sendService.send(DESC, "779799@unizar.es", "")).toBe(true);
        let reqs = (await listService.listAll()).filter(r => r.description === DESC);
        expect(reqs.length).toBe(1)
        if (reqs && reqs.length > 0)
            expect(await respondService.reject(reqs[0].id, "_comentario_")).toBe(true);
    });
});