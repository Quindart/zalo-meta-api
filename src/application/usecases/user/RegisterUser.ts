import { IBaseEntityType } from "../../../domain/entities/BaseEntity.ts";
import { UserEntity } from "../../../domain/entities/user/User.entity.ts";
import { IUserType } from "../../../domain/entities/user/User.type.ts";
import { IUserRepository } from "../../../domain/repositories/IUser.repository.ts";


export class RegisterUser {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(input: { email: string; password: string }): Promise<UserEntity> {
        const existing = await this.userRepository.findByEmail(input.email);
        if (existing) throw new Error('User already exists');

        const user: UserEntity = {
            email: input.email,
            password: input.password,
            firstName: '',
            lastName: '',
            toData: function (): IUserType & IBaseEntityType {
                throw new Error('Function not implemented.');
            }
        };

        return await this.userRepository.create(user);
    }
}
