"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "emote",
    regex: /\:([a-z0-9]+)\:/gi,
    format: function (val) { return val; },
    validate: function (raw, val) { return true; }
};
