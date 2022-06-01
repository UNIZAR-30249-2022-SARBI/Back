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
import { Request } from "./request.entity";
import { RequestModel } from "../Infrastructure/Models/request.model";

export type DayEINAData = { date: string, state: string, weekDay: number, weekLetter: string, idCalendarEINA; };

@Injectable()
export class RequestRepository {
    constructor(
        @InjectModel(RequestModel)
        private requestModel: typeof RequestModel,
        private sequelize: Sequelize,
    ) { }

    async save(request: Request): Promise<Request | null> {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                return await this.requestModel.create(
                    {
                        id: request.id,
                        description: request.description,
                        applicantEmail: request.applicantEmail,
                        location: request.location
                    },
                    { transaction: t }
                ).catch(err => {
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

    async find(requestId: string): Promise<Request> {
        let req = await this.requestModel.findOne({ where: { id: requestId } });
        let request;
        if (req)
            request = new Request(req.id, req.description, req.applicantEmail, req.location)
        return request;
    }

    async findAll(): Promise<Array<Request>> {
        let reqs = await this.requestModel.findAll();
        let requests = new Array<Request>();
        if (reqs)
            requests = reqs.map(req => new Request(req.id, req.description, req.applicantEmail, req.location));
        return requests;
    }

    async delete(request: Request): Promise<Boolean> {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                await this.requestModel.destroy(
                    {
                        where: { id: request.id },
                        transaction: t
                    },
                ).catch(err => {
                    // console.error(err);
                    return false;
                });
                return true;
            });
            return result;
        } catch (err) {
            //console.error(err);
            return false;
        }
    }
}