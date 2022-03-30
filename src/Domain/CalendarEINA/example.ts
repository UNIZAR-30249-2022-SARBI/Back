import { CalendarEINA } from './calendarEINA.entity';
import { DayEINA, WeekLetter } from './dayEINA.value-object';
import { CalendarEINAFactory } from './calendarEINA.factory';

var startFirstSemester = new Date('2021-09-15');
var endFirstSemester = new Date('2021-10-06');
var startSecondSemester = new Date('2022-02-07');
var endSecondSemester = new Date('2022-07-22');
var startSecondConvocatory = new Date('2022-08-31');
var endSecondConvocatory = new Date('2022-09-13');
/*var startSecondSemester = new Date('2022-02-06');
var endSecondSemester = new Date('2022-02-06');
var startSecondConvocatory = new Date('2022-02-06');
var endSecondConvocatory = new Date('2022-02-06');*/

var factory = new CalendarEINAFactory();
var calendar = factory.create(0, startSecondSemester, endSecondSemester, 2021);


