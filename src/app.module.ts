import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CalendarEINAModule } from './calendarEINA.module';
import { DayEINAModel } from "./Infrastructure/Models/dayEINA.model";
import { CalendarEINAModel } from './Infrastructure/Models/calendarEINA.model';
import { PeriodModel } from './Infrastructure/Models/periods.model';
import { UserModule } from './user.module';
import { SubjectModel } from './Infrastructure/Models/subject.model';
import { TeachingGroupModel } from './Infrastructure/Models/teachingGroup.model';
import { GroupSubjectScheduleModel } from './Infrastructure/Models/groupSubjectSchedule.model';
import { SubjectController } from './Infrastructure/Controllers/subject.controller';
import { SubjectModule } from './subject.module';

@Module({
    imports: [SequelizeModule.forRoot({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'admin779799',
        database: 'gicuz',
        models: [DayEINAModel, CalendarEINAModel, PeriodModel, TeachingGroupModel, SubjectModel, GroupSubjectScheduleModel],
        autoLoadModels: true,
        synchronize: true,
        define: { timestamps: false },
        logging: true
    }), CalendarEINAModule, UserModule, SubjectModule],
    controllers: [],
    providers: [],
})

export class AppModule {}
