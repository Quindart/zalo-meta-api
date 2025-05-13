import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { IFCMType } from "./FCM.type";
export declare class FCMEntity extends BaseEntity<IFCMType & IBaseEntityType> {
    deleteAt?: Date | string;
    fcmToken: string;
    user: string[];
    constructor(fcmData?: Partial<IFCMType>);
}
