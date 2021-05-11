"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "link",
    regex: /(https?\:\/\/[^ ]+)/gi,
    format: function (val) { return val; },
    validate: function (raw, val) { return true; }
};
