import { Injectable } from '@nestjs/common';
import { Request } from '../Domain/request.entity';
import { RequestRepository } from '../Domain/request.repository';

@Injectable()
export class SendRequestService {

    constructor(private requestRespository: RequestRepository) { }

    async send(description: string, applicantEmail: string, location: string): Promise<boolean> {
        try {
            let request = new Request(null, description, applicantEmail, location);
            await this.requestRespository.save(request);
            return true;
        } catch (err) {
            //console.error(err);
            return false;
        }
    }

}

