import { injectable, inject } from "inversify";
import TYPES from "../../../infrastructure/inversify/type";
import { IFriendService } from "../../interfaces/services/IFriendService";
import { FriendDocument } from "../../../infrastructure/mongo/model/Friend";
import { IFriendRepository } from "../../../domain/repositories/IFriend.repository"; 
import { FriendMapper } from "../../../infrastructure/mongo/mappers/FriendMapper";

type FriendRepositoryType = IFriendRepository
type MapperType = FriendMapper
@injectable()
export class FriendService implements IFriendService {
    constructor(
        @inject(TYPES.FriendRepository) private readonly repository: FriendRepositoryType,
        @inject(TYPES.FriendMapper) private readonly mapper: MapperType
    ) { }

    async getFriendByUserId(userId: string): Promise<any[]> {
        const friends = await this.repository.getFriendByUserId(userId);
        return friends; 
    }

    async createFriend(userId: string, userFriendId: string): Promise<FriendDocument> {
        const friendDoc = await this.repository.createFriend(userId, userFriendId);
        return friendDoc;
    }

    async removeFriend(userId: string, userFriendId: string): Promise<boolean> {
        return await this.repository.removeFriend(userId, userFriendId);
    }

    async isExistFriendRelationship(userId: string, userFriendId: string): Promise<boolean> {
        return await this.repository.isExistFriendRelationship(userId, userFriendId);
    }

    async getFriendByUserIdByType(userId: string, type: string): Promise<any[]> {
        const friends = await this.repository.getFriendByUserIdByType(userId, type);
        return friends; 
    }

    async getInviteOfUser(userId: string): Promise<any[]> {
        const invites = await this.repository.getInviteOfUser(userId);
        return invites; 
    }

    async getInviteOfUserSending(userId: string): Promise<any[]> {
        const invites = await this.repository.getInviteOfUserSending(userId);
        return invites; 
    }

    async getById(userId: string): Promise<FriendDocument | null> {
        const friendDoc = await this.repository.getById(userId);
        return friendDoc;
    }

    async updateFriendStatus(userId: string, userFriendId: string, type: string): Promise<FriendDocument> {
        const friendDoc = await this.repository.updateFriendStatus(userId, userFriendId, type);
        return friendDoc;
    }
}