import { UserDTO } from "./User.dto";
export declare class FcmDTO {
    deleteAt?: Date | string;
    fcmToken: string;
    user: UserDTO[];
}
