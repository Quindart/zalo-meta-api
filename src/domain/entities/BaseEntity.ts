import { Exclude, Expose, instanceToPlain } from 'class-transformer';

export interface IBaseEntityType {
    id: string;
}
@Exclude()
export abstract class BaseEntity<T extends IBaseEntityType> {
    @Expose()
    _id?: string;

    constructor(data: Partial<T> = {}) {
        this._id = data.id || '';
    }
    toData(): T {
        return instanceToPlain(this) as T;
    }
    static create<T extends IBaseEntityType>(this: new (data: Partial<T>) => any, data: Partial<T>) {
        return new this(data);
    }
}
