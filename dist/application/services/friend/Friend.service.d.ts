import { IFriendService } from "../../interfaces/services/IFriendService";
import { FriendDocument } from "../../../infrastructure/mongo/model/Friend";
import { IFriendRepository } from "../../../domain/repositories/IFriend.repository";
import { FriendMapper } from "../../../infrastructure/mongo/mappers/FriendMapper";
type FriendRepositoryType = IFriendRepository;
type MapperType = FriendMapper;
export declare class FriendService implements IFriendService {
    private readonly repository;
    private readonly mapper;
    constructor(repository: FriendRepositoryType, mapper: MapperType);
    getFriendByUserId(userId: string): Promise<any[]>;
    createFriend(userId: string, userFriendId: string): Promise<FriendDocument>;
    removeFriend(userId: string, userFriendId: string): Promise<boolean>;
    isExistFriendRelationship(userId: string, userFriendId: string): Promise<boolean>;
    getFriendByUserIdByType(userId: string, type: string): Promise<any[]>;
    getInviteOfUser(userId: string): Promise<any[]>;
    getInviteOfUserSending(userId: string): Promise<any[]>;
    getById(userId: string): Promise<FriendDocument | null>;
    updateFriendStatus(userId: string, userFriendId: string, type: string): Promise<FriendDocument>;
}
export {};
