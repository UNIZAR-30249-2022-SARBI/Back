import { Module } from "@nestjs/common";
import { UserController } from "./Infrastructure/Controllers/user.controller";
import { UserLoginService } from "./Application/userLogin.service";

@Module({
    imports: [],
    providers: [UserLoginService],
    controllers: [UserController]
})
export class UserModule { }