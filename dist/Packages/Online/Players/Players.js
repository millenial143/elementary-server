"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Player_1 = __importDefault(require("./Player"));
var Lobbies_1 = __importDefault(require("../Lobbies/Lobbies"));
var Players = /** @class */ (function () {
    function Players() {
    }
    Players.addPlayer = function (socketId, name) {
        var newPlayer = new Player_1["default"](socketId, name);
        Players.players.push(newPlayer);
    };
    Players.deletePlayer = function (socketId) {
        var player = this.getPlayerBySocket(socketId);
        // remove link to the object from array of players
        Players.players = Players.players.filter(function (o) { return o.getSocketId() !== socketId; });
        // remove link to the object from lobby, when he was
        var playerLobbyId = player.getLobbyId();
        if (playerLobbyId) {
            Lobbies_1["default"].getLobbyById(playerLobbyId).removePlayer(player);
        }
    };
    Players.getPlayerBySocket = function (socketId) {
        return Players.players.find(function (o) { return o.getSocketId() === socketId; });
    };
    Players.players = [];
    return Players;
}());
exports["default"] = Players;
