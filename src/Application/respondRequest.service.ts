import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Request } from '../Domain/request.entity';
import { RequestRepository } from '../Domain/request.repository';

@Injectable()
export class RespondRequestService {

    constructor(private mailerService: MailerService,
        private readonly requestRepository: RequestRepository
    ) { }

    async accept(requestId: string, comment: string): Promise<boolean>{
        try {
            let request = await this.requestRepository.find(requestId);
            if(!request) {
                return false;
            }
            await this.sendEmail(request, "Aceptado", comment);
            await this.requestRepository.delete(request);
            return true;
        } catch(err) {
            //console.error(err);
            return false;
        }
    }
    
    async reject(requestId: string, comment: string): Promise<boolean> {
        try {
            let request = await this.requestRepository.find(requestId);
            if (!request) {
                return false;
            }
            await this.sendEmail(request, "Rechazado", comment);
            await this.requestRepository.delete(request);
            return true;
        } catch (err) {
            //console.error(err);
            return false;
        }
    }

    async sendEmail(request: Request, respond: string, comment: string) {
        let commentHtml = ''
        if(comment) commentHtml = '<p>Comentario: ' + comment + '</p>';
        await this
            .mailerService
            .sendMail({
                from: 'gicuz@unizar.es',
                to: request.applicantEmail, // List of receivers email address
                subject: 'Respuesta a la petición', // Subject line
                text: 'Respuesta a la petición', // plaintext body
                html: '<b>Resolución de la petición</b><p>' + request.description + '</p><p>Resultado: ' + respond + '</p>' + commentHtml, // HTML body content
            })
            .then((success) => {
                //console.log(success);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

