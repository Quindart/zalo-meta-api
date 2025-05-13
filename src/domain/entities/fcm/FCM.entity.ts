import { Expose } from "class-transformer";
import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { IFCMType } from "./FCM.type";

export class FCMEntity extends BaseEntity<IFCMType & IBaseEntityType> {
    @Expose() deleteAt?: Date | string;
    @Expose() fcmToken: string;
    @Expose() user: string[];

    constructor(fcmData: Partial<IFCMType> = {}) {
        super(fcmData);
        this.deleteAt = fcmData.deleteAt;
        this.fcmToken = fcmData.fcmToken || '';
        this.user = fcmData.user || [];
    }

}
