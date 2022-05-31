import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import {
    MessagePattern,
    RmqContext,
    Ctx,
    Payload,
} from '@nestjs/microservices';
import { UploadSubjectService } from '../../Application/uploadSubject.service';
import { respond } from './rabbitmq';
import * as fs from 'fs';
import { ListSubjectService } from '../../Application/listSubject.service';
import { Subject } from '../../Domain/subject.entity';

const FILENAME = 'listado.xlsx';
@Controller()
export class SubjectController {
    constructor(
        private readonly uploadSubjectService: UploadSubjectService,
        private readonly listService: ListSubjectService
    ) { }

    @MessagePattern('uploadSubject')
    async upload(@Payload() data: any, @Ctx() context: RmqContext): Promise<boolean> {
        fs.writeFile(FILENAME, Buffer.from(data.record.data), (err)=> console.error(err));
        let file = fs.createReadStream(FILENAME);
        await this.uploadSubjectService.upload(file);
        respond(context);
        return true;
    }

    @MessagePattern('listSubjectsByTeachingGroup')
    async listByTeachingGroup(@Payload() data: any, @Ctx() context: RmqContext): Promise<Array<Subject>> {
        let subjects = await this.listService.listByTeachingGroup(data.code, data.period);
        respond(context);
        return subjects;
    }
}