import { Document } from 'mongoose';

export class MongooseBaseRepository<T extends Document> {
    async toSave(document: T) {
        return document.save()
    }
}