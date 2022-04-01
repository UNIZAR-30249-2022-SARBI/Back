import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CalendarEINAModule } from './Application/Controller/calendarEINA.module';
import { DayEINAModel } from "./Domain/CalendarEINA/dayEINA.model";
import { CalendarEINAModel } from './Domain/CalendarEINA/calendarEINA.model';

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
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {}
