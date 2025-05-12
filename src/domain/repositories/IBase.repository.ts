
export interface IBaseRepository<T, R> {
    create(data: T | any | Partial<T>): Promise<R>;
    findOne(id: string, queries?: string): Promise<R>;
    findAll(queries?: string): Promise<R[]>;
    update(id: string, data: T): Promise<R>;
    delete(id: string): Promise<boolean>;
}
