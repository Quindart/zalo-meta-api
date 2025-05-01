
export interface IFCMType {
    id: string;
    createAt: Date | string;
    deleteAt?: Date | string;
    updateAt: Date | string;
    fcmToken: string;
    user: string[];
}