"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GROUP_EVENT_TYPE = void 0;
var GROUP_EVENT_TYPE;
(function (GROUP_EVENT_TYPE) {
    GROUP_EVENT_TYPE["MEMBER_ADDED"] = "member_added";
    GROUP_EVENT_TYPE["MEMBER_REMOVED"] = "member_removed";
    GROUP_EVENT_TYPE["CHANNEL_CREATED"] = "channel_created";
    GROUP_EVENT_TYPE["CHANNEL_RENAMED"] = "channel_renamed";
    GROUP_EVENT_TYPE["CALL_STARTED"] = "call_started";
    GROUP_EVENT_TYPE["CALL_ENDED"] = "call_ended";
    GROUP_EVENT_TYPE["PINNED_MESSAGE"] = "pinned_message";
    GROUP_EVENT_TYPE["UNPINNED_MESSAGE"] = "unpinned_message";
    GROUP_EVENT_TYPE["GROUP_ICON_UPDATED"] = "group_icon_updated";
    GROUP_EVENT_TYPE["ANNOUNCEMENT"] = "announcement";
    GROUP_EVENT_TYPE["GROUP_DISSOLVED"] = "group_dissolved";
})(GROUP_EVENT_TYPE || (exports.GROUP_EVENT_TYPE = GROUP_EVENT_TYPE = {}));
;
