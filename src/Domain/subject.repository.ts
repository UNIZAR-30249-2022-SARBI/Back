import { InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";
import { DayEINAModel } from "../Infrastructure/Models/dayEINA.model";
import { CalendarEINAModel } from "../Infrastructure/Models/calendarEINA.model";
import { DayEINA, DayEINAState, WeekLetter } from "./dayEINA.entity";
import { Period } from "./period.value-object";
import { CalendarEINA, PeriodCalendarEINA } from "./calendarEINA.entity";
import { PeriodModel } from "../Infrastructure/Models/periods.model";
import { Sequelize } from "sequelize-typescript";
import { SubjectModel, SubjectTeachingGroupModel } from "../Infrastructure/Models/subject.model";
import { Subject } from "./subject.entity";

export type DayEINAData = { date: string, state: string, weekDay: number, weekLetter: string, idCalendarEINA; };

@Injectable()
export class SubjectRepository {
    constructor(
        @InjectModel(SubjectModel)
        private subjectModel: typeof SubjectModel,
        @InjectModel(SubjectTeachingGroupModel)
        private subjectTeachingGroupModel: typeof SubjectTeachingGroupModel,
        private sequelize: Sequelize,
    ) { }

    async save(subject: Subject): Promise<Subject | null> {
        console.log(subject)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                return await this.subjectModel.upsert(
                    {
                        id: subject.id,
                        code: subject.code,
                        name: subject.name,
                    },
                    { transaction: t }
                ).then(async () => {
                    for (const id of subject.teachingGroupIds)
                         await this.subjectTeachingGroupModel.create({
                            subjectId: subject.id,
                            groupId: id
                        },
                            { transaction: t },
                        ).catch(err => {
                            console.error(err);
                            return null;
                        })
                }).catch(err => {
                    // console.error(err);
                    return null;
                });
               
            });
            return result;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async findByTeachingGroup(teachingGroupId: string): Promise<Array<Subject>> {
        console.log("id", teachingGroupId);

        let arraySubjects: Array<Subject> = new Array<Subject>();
        let pairs = await this.subjectTeachingGroupModel.findAll({
            where: {
                groupId: teachingGroupId
            }
        });
        console.log("PAIR", pairs);

        for (let pair of pairs) {
            let subject = await this.subjectModel.findOne({
                where: {
                    id: pair.subjectId
                }
            });
            arraySubjects.push(new Subject(subject.id, subject.name, subject.code, null));
        }
        return arraySubjects;
    }

}