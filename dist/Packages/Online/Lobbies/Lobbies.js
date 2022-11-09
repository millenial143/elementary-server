"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Lobby_1 = __importDefault(require("./Lobby"));
var Lobbies = /** @class */ (function () {
    function Lobbies() {
    }
    Lobbies.generateLobbyId = function () {
        Lobbies.lastLobbyId += 1;
        return Lobbies.lastLobbyId;
    };
    Lobbies.createLobby = function (name) {
        var lobbyId = String(Lobbies.generateLobbyId());
        Lobbies.lobbies.push(new Lobby_1["default"](lobbyId, name));
    };
    Lobbies.getLobbies = function () {
        return Lobbies.lobbies;
    };
    Lobbies.getLobbyById = function (lobbyId) {
        return Lobbies.lobbies.find(function (o) { return o.getRoom() === lobbyId; });
    };
    Lobbies.lobbies = [];
    // костыль, потом сделать нормальную генерацию id
    Lobbies.lastLobbyId = 0;
    return Lobbies;
}());
exports["default"] = Lobbies;
