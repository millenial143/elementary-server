"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ServerSocket_1 = __importDefault(require("../../Net/Socket/ServerSocket"));
var Game_1 = __importDefault(require("../../Game/Game"));
var Lobby = /** @class */ (function () {
    function Lobby(id, name) {
        this.id = id;
        this.name = name;
        this.players = [];
        this.game = new Game_1["default"]();
        this.gameStarted = false;
    }
    Lobby.prototype.getRoom = function () {
        return this.id;
    };
    Lobby.prototype.addPlayer = function (player) {
        this.players.push(player);
        player.setLobbyId(this.id);
        ServerSocket_1["default"].io.to(this.getRoom()).emit('newLobbyState', this);
    };
    Lobby.prototype.removePlayer = function (player) {
        this.players.splice(this.players.indexOf(player), 1);
        player.setLobbyId(undefined);
        ServerSocket_1["default"].io.to(this.getRoom()).emit('newLobbyState', this);
    };
    Lobby.prototype.startGame = function () {
        this.gameStarted = true;
        this.game.startGame();
        for (var i = 0; i < this.players.length; i++) {
            ServerSocket_1["default"].io.to(this.id).emit('startGame', this.game);
        }
    };
    return Lobby;
}());
exports["default"] = Lobby;
