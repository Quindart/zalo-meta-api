export interface IBaseEntityType {
    _id: string;
}
export declare abstract class BaseEntity<T extends IBaseEntityType> {
    _id?: string;
    constructor(data?: Partial<T>);
    toData(): T;
    static create<T extends IBaseEntityType>(this: new (data: Partial<T>) => any, data: Partial<T>): any;
}
