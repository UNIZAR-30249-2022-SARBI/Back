import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CalendarEINAModule } from './calendarEINA.module';
import { DayEINAModel } from "./Infrastructure/Models/dayEINA.model";
import { CalendarEINAModel } from './Infrastructure/Models/calendarEINA.model';
import { PeriodModel } from './Infrastructure/Models/periods.model';
import { UserModule } from './user.module';
import { SubjectModel, SubjectTeachingGroupModel } from './Infrastructure/Models/subject.model';
import { TeachingGroupModel } from './Infrastructure/Models/teachingGroup.model';
import { GroupSubjectScheduleModel } from './Infrastructure/Models/groupSubjectSchedule.model';
import { SubjectModule } from './subject.module';
import { ScheduleSlotModel } from './Infrastructure/Models/scheduleSlot.model';
import { GroupSubjectScheduleModule } from './groupSubjectSchedule.module';
import { RequestModule } from './request.module';

@Module({
    imports: [SequelizeModule.forRoot({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'admin779799',
        database: 'gicuz',
        models: [DayEINAModel, CalendarEINAModel, PeriodModel, TeachingGroupModel, SubjectModel, GroupSubjectScheduleModel, ScheduleSlotModel, SubjectTeachingGroupModel],
        autoLoadModels: true,
        synchronize: true,
        define: { timestamps: false },
        logging: true
    }), CalendarEINAModule, UserModule, SubjectModule, GroupSubjectScheduleModule, RequestModule],
    controllers: [],
    providers: [],
})

export class AppModule {}
