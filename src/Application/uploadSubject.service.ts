import { Injectable } from "@nestjs/common";
import { CalendarEINARepository } from "../Domain/calendarEINA.repository";
import { CalendarEINA, PeriodCalendarEINA } from "../Domain/calendarEINA.entity";
import { DayEINA } from '../Domain/dayEINA.entity';
import { Period } from "../Domain/period.value-object";
import { SubjectRepository } from "../Domain/subject.repository";
import { WorkBook, WorkSheet } from "xlsx";
import { ReadStream } from "fs";
import * as xlsx from 'xlsx';

@Injectable()
export class UploadSubjectService {
    constructor(
        private subjectRepository: SubjectRepository
    ) { }

    public async upload(file): Promise<Boolean> {
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
        console.log(sheet[xlsx.utils.encode_cell({ c: 0, r: range.s.r })]);
        console.log("entire")
        console.log(sheet);

        return true;
    }
}



