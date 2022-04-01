import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CalendarEINAModule } from './calendarEINA.module';
import { DayEINAModel } from "./Infrastructure/Models/dayEINA.model";
import { CalendarEINAModel } from './Infrastructure/Models/calendarEINA.model';

@Module({
    imports: [SequelizeModule.forRoot({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'admin779799',
        database: 'gicuz',
        models: [DayEINAModel, CalendarEINAModel],
        autoLoadModels: true,
        synchronize: true,
        define: { timestamps: false },
    }), CalendarEINAModule],
    controllers: [],
    providers: [],
})

export class AppModule {}
