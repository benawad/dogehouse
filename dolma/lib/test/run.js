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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var encodingTests = __importStar(require("./tests/encoding"));
var __1 = require("../");
var neutralPrefix = "\u001b[36m[ DOLMA ]\u001b[0m";
var successPrefix = "\u001b[32m[ SUCCESS ]\u001b[0m";
var failurePrefix = "\u001b[31m[ FAILURE ]\u001b[0m";
var testName = function (name) { return "\u001B[37;1m(" + name + ")\u001B[0m"; };
var failedTests = [];
var successfulTests = [];
var tests = {
    encoding: encodingTests.default
};
function testFinished(test, started, successful) {
    var finished = new Date();
    if (successful) {
        successfulTests.push({ started: started, finished: finished, type: test.type, passed: true });
        var time = ((finished.getTime() - started.getTime()) / 1000) % 60;
        console.log(successPrefix, testName(test.name), "Test passed in", time + "s!");
    }
    else {
        failedTests.push({ started: started, finished: finished, type: test.type, passed: false });
        var time = ((finished.getTime() - started.getTime()) / 1000) % 60;
        console.log(failurePrefix, testName(test.name), "Test failed in", time + "s!");
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            console.log(neutralPrefix, "Running tests on dolma...\n");
            tests.encoding.map(function (test) { return __awaiter(_this, void 0, void 0, function () {
                var started, encodedValue;
                return __generator(this, function (_a) {
                    started = new Date();
                    encodedValue = __1.dolma.encode(test.input);
                    if (JSON.stringify(encodedValue) == JSON.stringify(test.expectedOutput))
                        testFinished(test, started, true);
                    else
                        testFinished(test, started, false);
                    return [2 /*return*/];
                });
            }); });
            console.log("\n" + neutralPrefix + " Testing completed! \u001B[37;1m(" + successfulTests.length + " passed) (" + failedTests.length + " failed)");
            return [2 /*return*/];
        });
    });
}
main();
