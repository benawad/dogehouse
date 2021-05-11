"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterUnitoken = void 0;
var msgToken_1 = require("./msgToken");
var newToken = msgToken_1.msgToken.newToken;
function filterUnitoken(token) {
    var _a, _b, _c, _d, _e;
    var keys = Object.keys(token);
    var allowedKeys = ['mention', 'emote', 'block', 'link'];
    if (keys.length > 1 || !allowedKeys.includes(keys[0]))
        return null;
    var key = keys[0];
    var mention = (_a = token['mention']) !== null && _a !== void 0 ? _a : "invalidMention";
    var emote = (_b = token['emote']) !== null && _b !== void 0 ? _b : "invalidEmote";
    var block = (_c = token['block']) !== null && _c !== void 0 ? _c : "invalidBlock";
    var link = (_d = token['link']) !== null && _d !== void 0 ? _d : "https://invalid.link";
    var text = (_e = token['text']) !== null && _e !== void 0 ? _e : "invalidText";
    if (key == 'mention')
        return newToken('mention', mention);
    if (key == 'emote')
        return newToken("emote", emote);
    if (key == 'block')
        return newToken("block", block);
    if (key == 'link')
        return newToken("link", link);
    if (key == 'text')
        return newToken("text", text);
    return null;
}
exports.filterUnitoken = filterUnitoken;
