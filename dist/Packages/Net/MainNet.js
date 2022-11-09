"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var MainNet = /** @class */ (function () {
    function MainNet() {
    }
    MainNet.app = (0, express_1["default"])();
    MainNet.httpServer = (0, http_1.createServer)(MainNet.app);
    return MainNet;
}());
exports["default"] = MainNet;
