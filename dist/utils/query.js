"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUndefined = exports.responseEntity = void 0;
const responseEntity = (queryField) => {
    if (!queryField || queryField.length === 0) {
        return {};
    }
    let obj = {};
    queryField.split(",").forEach((item) => {
        obj[item] = 1;
    });
    return obj;
};
exports.responseEntity = responseEntity;
const removeUndefined = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
};
exports.removeUndefined = removeUndefined;
