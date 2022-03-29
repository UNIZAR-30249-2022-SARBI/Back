import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DayEINAModel } from "../../Domain/CalendarEINA/dayEINA.model";

type DayEINAData = { date: Date, state: string, weekDay: number, weekLetter: string } ;

@Injectable()
export class CalendarEINAService {
    constructor(
        @InjectModel(DayEINAModel)
        private dayEINAModel: typeof DayEINAModel
    ) { }

    async findAll(): Promise<DayEINAModel[]> {
        return this.dayEINAModel.findAll();
    }

    findOne(id: string): Promise<DayEINAModel> {
        return this.dayEINAModel.findOne({
            where: {
                id,
            },
        });
    }

    async createDayEINA(dayEINA: DayEINAData): Promise<DayEINAModel|null> {
        var newDay = this.dayEINAModel.create(dayEINA).catch(err => { console.log(err); return null;});
        return newDay;
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        //getIdCalendar //getDiasFromCalendar
        await user.destroy();
    };
}



