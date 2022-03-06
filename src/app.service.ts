import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    login(email:string): string {
        return "The email is " + email;
    }
}
