import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarEINARepository } from '../Domain/calendarEINA.repository';
import { Sequelize } from "sequelize-typescript";
import { UserLoginService } from './userLogin.service';
import { UploadSubjectService } from './uploadSubject.service';
import * as fs from 'fs';
import { SubjectModel } from '../Infrastructure/Models/subject.model';
import { SubjectRepository } from '../Domain/subject.repository';

describe('Subject Services', () => {
    let uploadService: UploadSubjectService;
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
                models: [SubjectModel], 
                autoLoadModels: true,
                synchronize: true,
                define: { timestamps: false },
                logging: false
            }), SequelizeModule.forFeature([SubjectModel])],
            controllers: [],
            providers: [UploadSubjectService, SubjectRepository],
        }).compile();
        uploadService = moduleRef.get<UploadSubjectService>(UploadSubjectService);
        sequelize = moduleRef.get<Sequelize>(Sequelize);

    });

    afterAll(async () => {
        await sequelize.close();
    })


    it('upload files', async () => {
        let filename = "./listadoInformatica.ods";
        let file = fs.createReadStream(filename);
        expect(await uploadService.upload(file)).toBe(true);
    });
   
});