import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCalendarEINAService } from './createCalendarEINA.service';
import { CalendarEINAModel } from "../Infrastructure/Models/calendarEINA.model";
import { PeriodModel } from "../Infrastructure/Models/periods.model";
import { DayEINAModel } from "../Infrastructure/Models/dayEINA.model";
import { CalendarEINARepository } from '../Domain/calendarEINA.repository';
import { Sequelize } from "sequelize-typescript";
import { EditCalendarEINAService } from './editCalendarEINA.service';
import { ListCalendarEINAService } from './listCalendarEINA.service';
import { DeleteCalendarEINAService } from './deleteCalendarEINA.service';
import { PeriodCalendarEINA } from '../Domain/calendarEINA.entity';
import { addOneDay, diffDays } from '../Domain/dateUtils';
import { DayEINA, DayEINAState, WeekLetter } from '../Domain/dayEINA.entity';
import { Period } from '../Domain/period.value-object';
import { UserLoginService } from './userLogin.service';

describe('CalendarEINA Services', () => {
    let loginService: UserLoginService;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [],
            providers: [UserLoginService],
        }).compile();
        loginService = moduleRef.get<UserLoginService>(UserLoginService);

    });

    it('check admin email', async () => {
        let email = "admin@unizar.es";
        expect(await loginService.checkEmail(email)).toStrictEqual({email:email, isAdmin:true});
    });
    it('check user email', async () => {
        let email = "779799@unizar.es";
        expect(await loginService.checkEmail(email)).toStrictEqual({ email: email, isAdmin: false });
    });
    it('check error login', async () => {
        let email = "779799@unizar.es";
        expect(await loginService.checkEmail(email)).toStrictEqual({ email: email, isAdmin: false });
    });
});