
export interface IUserRepository {
    findByEmail(email: string): Promise<any | null>;
    create(user: any): Promise<any>;
}
