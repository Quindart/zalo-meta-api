export interface ISystemMessageType {
    actionType:
    | 'member_added'
    | 'member_removed'
    | 'channel_created'
    | 'channel_renamed'
    | 'call_started'
    | 'call_ended'
    | 'pinned_message'
    | 'unpinned_message'
    | 'group_icon_updated'
    | 'announcement'
    | 'group_dissolved';
    messageId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
