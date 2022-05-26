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
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadSubjectService } from '../../Application/uploadSubject.service';

@Controller()

export class Subject {
    constructor(
        private readonly uploadSubjectService: UploadSubjectService,
    ) { }

    @MessagePattern('uploadSubject')
    @UseInterceptors(FileInterceptor('file', { dest: '../../uploads' }))
    upload(@UploadedFile() file) {
        this.uploadSubjectService.upload(file);
    }
}