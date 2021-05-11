"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgToken = void 0;
var rawTokens = __importStar(require("../tokens"));
//@ts-ignore
var tokenTypes = Object.keys(rawTokens.default);
function msgToken() {
}
exports.msgToken = msgToken;
msgToken.tokens = rawTokens.default;
msgToken.types = tokenTypes;
msgToken.get = function (tokenType) {
    var tkn = rawTokens.default[tokenType];
    return tkn;
};
msgToken.getType = function (raw) {
    var type = 'text';
    tokenTypes.forEach(function (tt) {
        if (msgToken.validate(tt, raw)) {
            type = tt;
        }
    });
    return type;
};
msgToken.getValue = function (tkn, raw) {
    var regex = msgToken.get(tkn).regex;
    if (!regex)
        return raw;
    else
        return msgToken.get(tkn).format(raw.replace(regex, '$1'));
};
msgToken.newToken = function (tk, value) {
    var genToken = function (t, v) { return { t: t, v: v }; };
    var val = msgToken.get(tk).format(value);
    return genToken(tk, val);
};
msgToken.validate = function (token, str) {
    var tkn = msgToken.get(token);
    if (!tkn.regex)
        return str;
    if (str.match(tkn.regex))
        return str.replace(tkn.regex, '$1');
    else
        return false;
};
