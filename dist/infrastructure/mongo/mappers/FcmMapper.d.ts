import { FCMDocument } from "../model/FCM";
import { Types } from "mongoose";
import { FCMEntity } from "../../../domain/entities/fcm/FCM.entity";
export declare class FCMMapper {
    toDomain(doc: FCMDocument): FCMEntity;
    toPersistence(fcm: FCMEntity): {
        _id: Types.ObjectId;
        user: Types.ObjectId[];
        deleteAt?: Date | string;
        fcmToken: string;
    };
}
