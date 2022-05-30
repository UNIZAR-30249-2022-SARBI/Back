import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarEINARepository } from '../Domain/calendarEINA.repository';
import { Sequelize } from "sequelize-typescript";
import { UserLoginService } from './userLogin.service';

describe('User Services', () => {
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