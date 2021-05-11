"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "mention",
    regex: /\@([a-zA-Z0-9_]{4,})/gi,
    format: function (val) { return val; },
    validate: function (raw, val) { return true; }
};
