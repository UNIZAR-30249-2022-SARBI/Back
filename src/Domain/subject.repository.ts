import { InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";
import { DayEINAModel } from "../Infrastructure/Models/dayEINA.model";
import { CalendarEINAModel } from "../Infrastructure/Models/calendarEINA.model";
import { DayEINA, DayEINAState, WeekLetter } from "./dayEINA.entity";
import { Period } from "./period.value-object";
import { CalendarEINA, PeriodCalendarEINA } from "./calendarEINA.entity";
import { PeriodModel } from "../Infrastructure/Models/periods.model";
import { Sequelize } from "sequelize-typescript";
import { SubjectModel } from "../Infrastructure/Models/subject.model";
import { Subject } from "./subject.entity";

export type DayEINAData = { date: string, state: string, weekDay: number, weekLetter: string, idCalendarEINA; };

@Injectable()
export class SubjectRepository {
    constructor(
        @InjectModel(SubjectModel)
        private subjectModel: typeof SubjectModel,
        private sequelize: Sequelize,
    ) { }

    async save(subject: Subject): Promise<Subject | null> {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const newSubject = await this.subjectModel.create(
                    {
                        id: subject.id,
                        code: subject.code,
                        name: subject.name,
                    },
                    { transaction: t }
                ).catch(err => {
                    // console.error(err);
                    return null;
                });
                return newSubject;
            });
            return result;
        } catch (err) {
            //console.error(err);
            return null;
        }
    }

}