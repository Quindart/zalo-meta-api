import { Exclude, Expose, instanceToPlain } from 'class-transformer';

export interface IBaseEntityType {
    _id: string;
}
@Exclude()
export abstract class BaseEntity<T extends IBaseEntityType> {
    @Expose()
    _id?: string;
    constructor(data: Partial<T> = {}) {
        this._id = data._id || '';
    }
    toData(): T {
        return instanceToPlain(this) as T;
    }
    static create<T extends IBaseEntityType>(this: new (data: Partial<T>) => any, data: Partial<T>) {
        return new this(data);
    }
}
