import { Expose, Type } from "class-transformer";
import { UserDTO } from "./User.dto.ts";

export class FcmDTO {
    @Expose() deleteAt?: Date | string;
    @Expose() fcmToken: string;
    @Type(() => UserDTO)
    user: UserDTO[];
}