"use strict";
exports.__esModule = true;
var Player = /** @class */ (function () {
    function Player(socketId, name) {
        this.lobbyId = undefined;
        this.socketId = socketId;
        this.name = name;
    }
    Player.prototype.setName = function (name) {
        this.name = name;
    };
    Player.prototype.getSocketId = function () {
        return this.socketId;
    };
    Player.prototype.getLobbyId = function () {
        return this.lobbyId;
    };
    Player.prototype.setLobbyId = function (val) {
        this.lobbyId = val;
    };
    return Player;
}());
exports["default"] = Player;
