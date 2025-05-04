import { UserEntity } from '../../../domain/entities/user/User.entity';
import { IUserRepository } from '../../../domain/repositories/IUser.repository';

export class FindUserByPhone {
    constructor(private readonly userService: IUserRepository) { }
    async execute(phone: string, queries: string): Promise<UserEntity | null> {
        return await this.userService.findByPhone(phone, queries);
    }
}