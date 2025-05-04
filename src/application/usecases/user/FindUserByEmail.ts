import { UserEntity } from "../../../domain/entities/user/User.entity.ts";
import { IUserRepository } from "../../../domain/repositories/IUser.repository.ts";


export class FindUserByEmail {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(email: string): Promise<UserEntity> {
        return await this.userRepository.findByEmail(email);
    }
}