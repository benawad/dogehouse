"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function (m, exports) {
    for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
            __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dolma = void 0;
var decode_1 = require("./lib/decode");
var encode_1 = require("./lib/encode");
__exportStar(require("./util/types/tokenTypes"), exports);
function dolma(values) {
    return {
        encoded: encode_1.encodeTokens(values !== null && values !== void 0 ? values : ""),
        decoded: decode_1.decodeTokens(values !== null && values !== void 0 ? values : "")
    };
}
exports.dolma = dolma;
dolma['encode'] = encode_1.encodeTokens;
dolma['decode'] = decode_1.decodeTokens;
