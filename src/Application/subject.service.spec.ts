import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from "sequelize-typescript";
import { UploadSubjectService } from './uploadSubject.service';
import * as fs from 'fs';
import { SubjectModel, SubjectTeachingGroupModel } from '../Infrastructure/Models/subject.model';
import { SubjectRepository } from '../Domain/subject.repository';
import { TeachingGroupModel } from '../Infrastructure/Models/teachingGroup.model';
import { ScheduleSlotModel } from '../Infrastructure/Models/scheduleSlot.model';
import { GroupSubjectScheduleModel } from '../Infrastructure/Models/groupSubjectSchedule.model';
import { GroupSubjectScheduleRepository } from '../Domain/groupSubjectSchedule.repository';
import { ListSubjectService } from './listSubject.service';

describe('Subject Services', () => {
    let uploadService: UploadSubjectService;
    let listService: ListSubjectService;
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
                models: [SubjectModel, SubjectTeachingGroupModel, TeachingGroupModel, ScheduleSlotModel, GroupSubjectScheduleModel],
                autoLoadModels: true,
                synchronize: true,
                define: { timestamps: false },
                logging: false
            }), SequelizeModule.forFeature([SubjectModel, SubjectTeachingGroupModel, TeachingGroupModel, ScheduleSlotModel, GroupSubjectScheduleModel])],
            controllers: [],
            providers: [UploadSubjectService, SubjectRepository, GroupSubjectScheduleRepository, ListSubjectService],
        }).compile();
        listService = moduleRef.get<ListSubjectService>(ListSubjectService);
        uploadService = moduleRef.get<UploadSubjectService>(UploadSubjectService);
        sequelize = moduleRef.get<Sequelize>(Sequelize);

    });

    afterAll(async () => {
        await sequelize.close();
    })

    it('upload files and find by teaching group', async () => {
        let filename = "./listadoInformatica.ods";
        let file = fs.createReadStream(filename);
        expect(await uploadService.upload(file)).toBe(true);
        let subject = await listService.listByTeachingGroup("422", "S1");
        expect(subject.length).toBe(5);
        expect(subject.filter(sub => sub.code === "30210").length).toBe(1);
    });
   
});