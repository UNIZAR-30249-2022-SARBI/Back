import { Injectable } from '@nestjs/common';
import { Request } from '../Domain/request.entity';
import { RequestRepository } from '../Domain/request.repository';

@Injectable()
export class ListRequestService {

    constructor(private requestRespository: RequestRepository) { }

    async listAll(): Promise<Array<Request>> {
        let requests = await this.requestRespository.findAll();

        return requests;
    }

}

