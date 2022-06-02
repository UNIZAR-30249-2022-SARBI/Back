import { Injectable } from "@nestjs/common";
import { SubjectRepository } from "../Domain/subject.repository";
import { WorkBook, WorkSheet } from "xlsx";
import { ReadStream } from "fs";
import * as xlsx from 'xlsx';
import { TeachingGroup } from "../Domain/teachingGroup.value-object";
import { Subject } from "../Domain/subject.entity";
import { GroupSubjectScheduleRepository } from "../Domain/groupSubjectSchedule.repository";

const careerGroupInitialCode: Map<number, number> = new Map([[558, 0], [430, 2], [434, 5], [435, 7], [436, 8], [581, 9], [439, 4], [470, 1], [440, 3]]);


@Injectable()
export class UploadSubjectService {
    constructor(
        private subjectRepository: SubjectRepository,
        private gSSRepository: GroupSubjectScheduleRepository
    ) { }

    public async upload(file:ReadStream): Promise<Boolean> {

        const wb = await this.readSheet(file);
        const sheet: WorkSheet = wb.Sheets[wb.SheetNames[0]];
        const range = xlsx.utils.decode_range(sheet['!ref']);
        for (let i = range.s.r; i <= range.e.r; i++) {
            let subjectCode = this.readCellSheet(sheet, 3, i);
            let subjectName = this.readCellSheet(sheet, 4, i);
            let planCode = this.readCellSheet(sheet, 11, i);
            let planName = this.readCellSheet(sheet, 12, i);
            let course = this.readCellSheet(sheet, 17, i);
            let period = this.readCellSheet(sheet, 18, i);
            let numGroup = parseInt(this.readCellSheet(sheet, 23, i));
            //console.log(subjectCode, subjectName)
            //console.log(planCode + "-" + planName, period)
            if (planName?.includes("Graduado")) {
                let teachingGroups: TeachingGroup[] = [];
                for (let num = 1; num <= numGroup; num++) {
                    let code = this.generateTGCode(parseInt(planCode), parseInt(course), num);
                    let teachingGroup = await this.gSSRepository.findGroupByCodeAndPeriod(code, period);
                    if (!teachingGroup)
                        teachingGroup = new TeachingGroup(null, planCode + '-' + planName, course, code, period);
                    teachingGroups.push(teachingGroup);
                    await this.gSSRepository.saveTeachingGroup(teachingGroup);
                }

                let teachingGroupIds = teachingGroups.map(group => group.id);
                let subject = new Subject(null, subjectName, subjectCode, teachingGroupIds);
                let newSubject = await this.subjectRepository.save(subject);
            }
        }

        return true;
    }

    private readCellSheet(sheet: WorkSheet, col: number, row: number): string{
        return sheet[xlsx.utils.encode_cell({ c: col, r: row })]?.v
    }

    private generateTGCode(carrerCode: number, course:number, numGroup:number): string {
        return `${careerGroupInitialCode.get(carrerCode)}${course}${numGroup}`;
    }

    private async readSheet(file: ReadStream): Promise<WorkBook>{
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
        return wb;
    }
}



