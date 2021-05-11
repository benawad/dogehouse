"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeTokens = void 0;
var encode_1 = require("./encode");
function decodeTokens(all) {
    var tokens = encode_1.encodeTokens(all);
    var vals = [];
    tokens.map(function (tkn) {
        if (tkn.t == 'text')
            return vals.push(tkn.v);
        if (tkn.t == 'block')
            return vals.push("`" + tkn.v + "`");
        if (tkn.t == 'emote')
            return vals.push(":" + tkn.v + ":");
        if (tkn.t == 'mention')
            return vals.push("@" + tkn.v);
        if (tkn.t == 'link')
            return vals.push(tkn.v);
    });
    var ret = [];
    var len = vals.length;
    vals.forEach(function (val, index) {
        var strayValues = [",", "."];
        if (strayValues.includes(val)) {
            ret[ret.length - 1] += val;
        }
        else {
            ret.push(val);
        }
    });
    return ret.join(' ');
}
exports.decodeTokens = decodeTokens;
