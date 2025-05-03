
export interface IBaseRepository<T, R> {
    create(data: T): Promise<R>;
    findOne(id: string): Promise<R>;
    findAll(queries?: (keyof T)[]): Promise<T[]>; 
    update(id: string, data: T): Promise<R>;
    delete(id: string): Promise<boolean>;
}
