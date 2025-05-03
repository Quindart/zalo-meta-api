import { UserBuilder } from "../../domain/entities/user/User.builder.ts";
import { UserEntity } from "../../domain/entities/user/User.entity.ts";
import { IUserRepository } from "../../domain/repositories/IUser.Repository.ts";

class UserService {
    constructor(private userRepository: IUserRepository) { }

    createUser(input: any): Promise<UserEntity> {
        if (!input.name || !input.email) {
            throw new Error("Invalid input");
        }
        const builder = new UserBuilder()
        const user: UserEntity = builder.setEmail(input.email).setLastName(input.lastName).setFirstName(input.firstName).build()
        return this.userRepository.create(user);
    }
}
