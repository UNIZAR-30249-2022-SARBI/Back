import { Injectable } from "@nestjs/common";
import { CalendarEINARepository } from "../Domain/calendarEINA.repository";
import { CalendarEINA, PeriodCalendarEINA } from "../Domain/calendarEINA.entity";
import { DayEINA } from '../Domain/dayEINA.entity';
import { Period } from "../Domain/period.value-object";
import { SubjectRepository } from "../Domain/subject.repository";
import { WorkBook, WorkSheet } from "xlsx";
import { ReadStream } from "fs";
import * as xlsx from 'xlsx';

const careerGroupInitialCode: Map<number, number> = new Map([[558, 0], [430, 2], [434, 5], [435, 7], [436, 8], [581, 9], [439, 4], [470, 1]]);


@Injectable()
export class UploadSubjectService {
    constructor(
        private subjectRepository: SubjectRepository
    ) { }

    public async upload(file:ReadStream): Promise<Boolean> {
        const wb: WorkBook = await new Promise((resolve, reject) => {
            const stream: ReadStream = file;

            const buffers = [];

            stream.on('data', (data) => buffers.push(data));

            stream.on('end', () => {
                const buffer = Buffer.concat(buffers);
                resolve(xlsx.read(buffer, { type: 'buffer' }));
            });

            stream.on('error', (error) => reject(error));
        });

        const sheet: WorkSheet = wb.Sheets[wb.SheetNames[0]];
        const range = xlsx.utils.decode_range(sheet['!ref']);
        for (let i = range.s.r; i <= range.e.r; i++) {
            let subjectCode = this.readCellSheet(sheet, 3, i);
            let subjectName = this.readCellSheet(sheet, 4, i);
            let planCode = this.readCellSheet(sheet, 11, i);
            let planName = this.readCellSheet(sheet, 12, i);
            let course = parseInt(this.readCellSheet(sheet, 17, i));
            let period = this.readCellSheet(sheet, 18, i);
            let numGroup = parseInt(this.readCellSheet(sheet, 23, i));
            console.log(subjectCode, subjectName)
            console.log(planCode + "-" + planName, period)
            for (let i = 1; i <= numGroup; i++)
                console.log(this.generateTGCode(parseInt(planCode), course, i))
        }

        return true;
    }

    private readCellSheet(sheet: WorkSheet, col: number, row: number): string{
        return sheet[xlsx.utils.encode_cell({ c: col, r: row })]?.v
    }

    private generateTGCode(carrerCode: number, course:number, numGroup:number): string {
        return `${careerGroupInitialCode.get(carrerCode)}${course}${numGroup}`;
    }
}



