import { Document } from 'mongoose';
export declare class MongooseBaseRepository<T extends Document> {
    toSave(document: T): Promise<T>;
}
