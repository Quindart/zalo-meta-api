"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE_TYPES = exports.ROLE_TYPES = void 0;
var ROLE_TYPES;
(function (ROLE_TYPES) {
    ROLE_TYPES["CAPTAIN"] = "captain";
    ROLE_TYPES["SUB_CAPTAIN"] = "sub_captain";
    ROLE_TYPES["MEMBER"] = "member";
})(ROLE_TYPES || (exports.ROLE_TYPES = ROLE_TYPES = {}));
var MESSAGE_TYPES;
(function (MESSAGE_TYPES) {
    MESSAGE_TYPES["TEXT"] = "text";
    MESSAGE_TYPES["IMAGE"] = "image";
    MESSAGE_TYPES["VIDEO"] = "video";
    MESSAGE_TYPES["FILE"] = "file";
    MESSAGE_TYPES["AUDIO"] = "audio";
    MESSAGE_TYPES["EMOJI"] = "emoji";
    MESSAGE_TYPES["SYSTEM"] = "system";
    MESSAGE_TYPES["OTHER"] = "other";
})(MESSAGE_TYPES || (exports.MESSAGE_TYPES = MESSAGE_TYPES = {}));
