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
import { ListTeachingGroupService } from './listTeachingGroup.service';
import { AddScheduleSlotService } from './addScheduleSlot.service';
import { Periodicity, ScheduleSlot, ScheduleSlotProps } from "src/Domain/scheduleSlot.value-object";

describe('GroupSubjectSchedule Services', () => {
    let uploadService: UploadSubjectService;
    let listService: ListTeachingGroupService;
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
            providers: [ListTeachingGroupService, SubjectRepository, GroupSubjectScheduleRepository, AddScheduleSlotService, UploadSubjectService],
        }).compile();
        listService = moduleRef.get<ListTeachingGroupService>(ListTeachingGroupService);
        uploadService = moduleRef.get<UploadSubjectService>(UploadSubjectService);
        sequelize = moduleRef.get<Sequelize>(Sequelize);
    });

    afterAll(async () => {
        await sequelize.close();
    })

    it('list all teaching group', async () => {
        let filename = "./listado207.xlsx";
        let file = fs.createReadStream(filename);
        expect(await uploadService.upload(file)).toBe(true);
        let teachingGroups = await listService.listTeachingGroups();
        expect(teachingGroups.length).toBe(140);
    }, 15000);
   
});