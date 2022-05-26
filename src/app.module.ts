import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CalendarEINAModule } from './calendarEINA.module';
import { DayEINAModel } from "./Infrastructure/Models/dayEINA.model";
import { CalendarEINAModel } from './Infrastructure/Models/calendarEINA.model';
import { PeriodModel } from './Infrastructure/Models/periods.model';
import { UserModule } from './user.module';

@Module({
    imports: [SequelizeModule.forRoot({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'admin779799',
        database: 'gicuz',
        models: [DayEINAModel, CalendarEINAModel, PeriodModel],
        autoLoadModels: true,
        synchronize: true,
        define: { timestamps: false },
        logging: true
    }), CalendarEINAModule, UserModule],
    controllers: [],
    providers: [],
})

export class AppModule {}
