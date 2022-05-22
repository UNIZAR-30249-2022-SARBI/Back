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

describe('CalendarEINA Services', () => {
    let createService: CreateCalendarEINAService;
    let deleteService: DeleteCalendarEINAService;
    let editService: EditCalendarEINAService;
    let listService: ListCalendarEINAService;
    let sequelize: Sequelize;
    let moduleRef: TestingModule;
    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
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
                logging: false
            }), SequelizeModule.forFeature([DayEINAModel, PeriodModel, CalendarEINAModel])],
            controllers: [],
            providers: [CalendarEINARepository, CreateCalendarEINAService, EditCalendarEINAService, ListCalendarEINAService, DeleteCalendarEINAService],
        }).compile();
        sequelize = moduleRef.get<Sequelize>(Sequelize);
        createService = moduleRef.get<CreateCalendarEINAService>(CreateCalendarEINAService);
        deleteService = moduleRef.get<DeleteCalendarEINAService>(DeleteCalendarEINAService);
        listService = moduleRef.get<ListCalendarEINAService>(ListCalendarEINAService);
        editService = moduleRef.get<EditCalendarEINAService>(EditCalendarEINAService); 
    });
    afterAll(async () => {
        await sequelize.close();
    })

    it('Create and delete', async () => {
        let course = "2021-22";
        let version = 8;
        expect(await createService.createCalendarEINA(null, null, null, course, version)).toBe(true);
        expect(await listService.listPeriodsCalendarEINA(course, version)).toStrictEqual(new Map<PeriodCalendarEINA, Period>());
        expect(await deleteService.deleteCalendarEINA(course, version)).toBe(true);
    });

    it('Create, list periods and delete', async () => {
        let course = "2021-22";
        let version = 9;
        let firstSemester = { startDate: new Date("2021-09-15"), endDate: new Date("2022-02-06") };
        let secondSemester = { startDate: new Date("2022-02-07"), endDate: new Date("2022-07-02") };
        let secondConvocatory = { startDate: new Date("2022-08-31"), endDate: new Date("2022-09-13") };
        expect(await createService.createCalendarEINA(firstSemester, secondSemester, secondConvocatory, course, version)).toBe(true);

        let periods = await listService.listPeriodsCalendarEINA(course, version);
        expect(periods.get(PeriodCalendarEINA.FIRST_QUARTER).startDate).toStrictEqual(firstSemester.startDate)
        expect(periods.get(PeriodCalendarEINA.FIRST_QUARTER).endDate).toStrictEqual(firstSemester.endDate)
        expect(periods.get(PeriodCalendarEINA.SECOND_QUARTER).startDate).toStrictEqual(secondSemester.startDate)
        expect(periods.get(PeriodCalendarEINA.SECOND_QUARTER).endDate).toStrictEqual(secondSemester.endDate)
        expect(periods.get(PeriodCalendarEINA.SECOND_CONVOCATORY).startDate).toStrictEqual(secondConvocatory.startDate)
        expect(periods.get(PeriodCalendarEINA.SECOND_CONVOCATORY).endDate).toStrictEqual(secondConvocatory.endDate)
        expect(await deleteService.deleteCalendarEINA(course,version)).toBe(true)
    });

    it('Create, list days and delete', async () => {
        let course = "2021-22";
        let version = 10;
        let firstSemester = { startDate: new Date("2021-09-15"), endDate: new Date("2022-02-06") };
        let secondSemester = { startDate: new Date("2022-02-07"), endDate: new Date("2022-07-02") };
        let secondConvocatory = { startDate: new Date("2022-08-31"), endDate: new Date("2022-09-13") };
        expect(await createService.createCalendarEINA(firstSemester, secondSemester, secondConvocatory, course, version)).toBe(true);

        let daysFirstSemester = await listService.listDaysEINA(course, version, PeriodCalendarEINA.FIRST_QUARTER);
        expect(daysFirstSemester[0].date).toStrictEqual(firstSemester.startDate);
        expect(daysFirstSemester[daysFirstSemester.length - 1].date).toStrictEqual(firstSemester.endDate);
        expect(daysFirstSemester.length).toBe(diffDays(firstSemester.startDate, firstSemester.endDate) + 1);

        let daysSecondConvocatory = await listService.listDaysEINA(course, version, PeriodCalendarEINA.SECOND_CONVOCATORY);
        expect(daysSecondConvocatory[0].date).toStrictEqual(secondConvocatory.startDate);
        expect(daysSecondConvocatory[daysSecondConvocatory.length - 1].date).toStrictEqual(secondConvocatory.endDate);
        expect(daysSecondConvocatory.length).toBe(diffDays(secondConvocatory.startDate, secondConvocatory.endDate) + 1);

        expect(await deleteService.deleteCalendarEINA(course, version)).toBe(true);
    });
    it('EditPeriods', async () => {
        let course = "2021-22";
        let version = 11;
        let firstSemester = { startDate: new Date("2021-09-15"), endDate: new Date("2022-02-06") };
        let secondSemester = { startDate: new Date("2022-02-07"), endDate: new Date("2022-07-02") };
        let secondConvocatory = { startDate: new Date("2022-08-31"), endDate: new Date("2022-09-13") };
        await createService.createCalendarEINA(firstSemester, secondSemester, secondConvocatory, course, version);
        secondSemester = { startDate: new Date("2022-02-15"), endDate: new Date("2022-07-01") };
        expect(await editService.editCalenarEINA(firstSemester, secondSemester, secondConvocatory, course, version)).toBe(true);

        let daysSecondSemester = await listService.listDaysEINA(course, version, PeriodCalendarEINA.SECOND_QUARTER);
        expect(daysSecondSemester[0].date).toStrictEqual(secondSemester.startDate);
        expect(daysSecondSemester[daysSecondSemester.length - 1].date).toStrictEqual(secondSemester.endDate);
        expect(daysSecondSemester.length).toBe(diffDays(secondSemester.startDate, secondSemester.endDate) + 1);

        secondSemester = { startDate: new Date("2022-02-10"), endDate: new Date("2022-07-05") };
        expect(await editService.editCalenarEINA(firstSemester, secondSemester, secondConvocatory, course, version)).toBe(true);

        daysSecondSemester = await listService.listDaysEINA(course, version, PeriodCalendarEINA.SECOND_QUARTER);
        expect(daysSecondSemester[0].date).toStrictEqual(secondSemester.startDate);
        expect(daysSecondSemester[daysSecondSemester.length - 1].date).toStrictEqual(secondSemester.endDate);
        expect(daysSecondSemester.length).toBe(diffDays(secondSemester.startDate, secondSemester.endDate) + 1);

        await deleteService.deleteCalendarEINA(course, version)
    });

    it('EditDayEINA', async () => {
        let course = "2021-22";
        let version = 12;
        let firstSemester = { startDate: new Date("2021-09-15"), endDate: new Date("2022-02-06") };
        let secondSemester = { startDate: new Date("2022-02-07"), endDate: new Date("2022-07-02") };
        let secondConvocatory = { startDate: new Date("2022-08-31"), endDate: new Date("2022-09-13") };
        await createService.createCalendarEINA(firstSemester, secondSemester, secondConvocatory, course, version);
        let newDay = new DayEINA(addOneDay(secondSemester.startDate), 2, WeekLetter.A, DayEINAState.FESTIVE, ["Festividad"])
        let dayProps = {
            date: newDay.date,
            weekDay: newDay.weekDay,
            weekLetter: newDay.weekLetter,
            state: newDay.state,
            comment: newDay.comment
        } 
        expect(await editService.editDayEINA(dayProps, course, version))
        let daysSecondSemester = await listService.listDaysEINA(course, version, PeriodCalendarEINA.SECOND_QUARTER);
        expect(daysSecondSemester[1]).toStrictEqual(newDay);
        await deleteService.deleteCalendarEINA(course, version);
    });

    it('Create with same course and version', async () => {
        let course = "2021-22";
        let version = 13;
        let firstSemester = { startDate: new Date("2021-09-15"), endDate: new Date("2022-02-06") };
        let secondSemester = { startDate: new Date("2022-02-07"), endDate: new Date("2022-07-02") };
        let secondConvocatory = { startDate: new Date("2022-08-31"), endDate: new Date("2022-09-13") };
        expect(await createService.createCalendarEINA(firstSemester, secondSemester, secondConvocatory, course, version)).toBe(true);
        expect(await createService.createCalendarEINA(firstSemester, secondSemester, secondConvocatory, course, version)).toBe(false);
        expect(await deleteService.deleteCalendarEINA(course, version)).toBe(true);
    });

    it('List non-exist calendar', async () => {
        let course = "2021-22";
        let version = 14;
        expect(await listService.listDaysEINA(course, version, PeriodCalendarEINA.FIRST_QUARTER)).toStrictEqual([]);
        expect(await listService.listPeriodsCalendarEINA(course, version)).toStrictEqual(new Map<PeriodCalendarEINA,Period>());

    });

    it('Delete non-exist calendar', async () => {
        let course = "2021-22";
        let version = 14;
        expect(await deleteService.deleteCalendarEINA(course, version)).toBe(false);
    });

    it('Edit periods of non-exist calendar', async () => {
        let course = "2021-22";
        let version = 14;
        let firstSemester = { startDate: new Date("2021-09-15"), endDate: new Date("2022-02-06") };
        let secondSemester = { startDate: new Date("2022-02-07"), endDate: new Date("2022-07-02") };
        let secondConvocatory = { startDate: new Date("2022-08-31"), endDate: new Date("2022-09-13") };
        expect(await editService.editCalenarEINA(firstSemester, secondSemester, secondConvocatory, course, version)).toBe(false);
    });

    it('Edit day of non-exist calendar', async () => {
        let course = "2021-22";
        let version = 14;
        let newDay = new DayEINA(new Date(), 2, WeekLetter.A, DayEINAState.SCHOOL, [""]);
        let dayProps = {
            date: newDay.date,
            weekDay: newDay.weekDay,
            weekLetter: newDay.weekLetter,
            state: newDay.state,
            comment: newDay.comment
        };
        expect(await editService.editDayEINA(dayProps, course, version)).toBe(false);
    });

    it('Create with wrong periods', async () => {
        let course = "2021-22";
        let version = 15;
        let firstSemester = { startDate: new Date("2021-09-15"), endDate: new Date("2022-02-06") };
        let secondSemester = { startDate: new Date("2022-02-07"), endDate: new Date("2022-07-02") };
        let secondConvocatory = { startDate: new Date("20"), endDate: new Date("aaa") };
        expect(await createService.createCalendarEINA(firstSemester, secondSemester, secondConvocatory, course, version)).toBe(false);
        await deleteService.deleteCalendarEINA(course, version);
    });

    it('Edit with wrong periods', async () => {
        let course = "2021-22";
        let version = 16;
        let firstSemester = { startDate: new Date("2021-09-15"), endDate: new Date("2022-02-06") };
        let secondSemester = { startDate: new Date("2022-02-07"), endDate: new Date("2022-07-02") };
        let secondConvocatory = { startDate: new Date("2022-08-31"), endDate: new Date("2022-09-13") };
        await createService.createCalendarEINA(firstSemester, secondSemester, secondConvocatory, course, version);
        secondSemester = { startDate: new Date("aaa"), endDate: new Date("bbb") };
        expect(await editService.editCalenarEINA(firstSemester, secondSemester, secondConvocatory, course, version)).toBe(false);
        await deleteService.deleteCalendarEINA(course, version)
    });

    it('Edit with wrong dayProps', async () => {
        let course = "2021-22";
        let version = 17; 
        let firstSemester = { startDate: new Date("2021-09-15"), endDate: new Date("2022-02-06") };
        let secondSemester = { startDate: new Date("2022-02-07"), endDate: new Date("2022-07-02") };
        let secondConvocatory = { startDate: new Date("2022-08-31"), endDate: new Date("2022-09-13") };
        await createService.createCalendarEINA(firstSemester, secondSemester, secondConvocatory, course, version);
        let dayProps = {
            date: new Date(),
            weekDay: -1,
            weekLetter: WeekLetter.A,
            state: DayEINAState.SCHOOL,
            comment: []
        };
        expect(await editService.editDayEINA(dayProps, course, version)).toBe(false);
        await deleteService.deleteCalendarEINA(course, version);
    });
});