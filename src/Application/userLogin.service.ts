import { Injectable } from "@nestjs/common";

export type userProps = {
    email: String,
    isAdmin: Boolean
}

@Injectable()
export class UserLoginService {
    constructor(
    ) { }

    public checkEmail(email: string): userProps {
        if (email.includes("@unizar.es"))
            if (email == "admin@unizar.es")
                return { email: email, isAdmin: true };
            else
                return { email: email, isAdmin: false };
        else
            return null;
    }
}



