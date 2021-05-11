"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterString = void 0;
var regex_1 = require("../util/regex");
var msgToken_1 = require("./msgToken");
function filterString(message) {
    var tokens = [];
    var vals = message.trim().split(regex_1.validationRegex.global).filter(function (e) { return e != "" && e != " " && e != undefined; }).map(function (e) { return e.trim(); });
    vals.map(function (e) {
        var tkn = msgToken_1.msgToken.getType(e);
        var value = msgToken_1.msgToken.getValue(tkn, e);
        if (tkn == 'text')
            value.split(" ").map(function (str) { return tokens.push(msgToken_1.msgToken.newToken('text', str)); });
        else
            return tokens.push(msgToken_1.msgToken.newToken(tkn, value));
    });
    return tokens;
}
exports.filterString = filterString;
