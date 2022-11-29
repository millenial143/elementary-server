"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ServerSocket_1 = __importDefault(require("../../Net/Socket/ServerSocket"));
var Game_1 = __importDefault(require("../../Game/Game"));
var Lobby = /** @class */ (function () {
    function Lobby(id, name, playersNumber) {
        this.id = id;
        this.name = name;
        this.players = [];
        this.playersNumber = playersNumber;
        this.game = undefined;
        this.gameStarted = false;
    }
    Lobby.prototype.getRoom = function () {
        return this.id;
    };
    Lobby.prototype.addPlayer = function (player) {
        if (this.players.length < this.playersNumber) {
            this.players.push(player);
            player.setLobbyId(this.id);
            ServerSocket_1["default"].io.to(this.getRoom()).emit('newLobbyState', this);
            return true;
        }
        else {
            return false;
        }
    };
    Lobby.prototype.removePlayer = function (player) {
        if (this.gameStarted) {
            this.endGame();
        }
        this.players.splice(this.players.indexOf(player), 1);
        player.setLobbyId(undefined);
        ServerSocket_1["default"].io.to(this.getRoom()).emit('newLobbyState', this);
    };
    Lobby.prototype.startGame = function () {
        if (this.players.length == this.playersNumber) {
            this.game = new Game_1["default"](this.players, this.getRoom());
            this.gameStarted = true;
            this.game.startGame();
            return true;
        }
        else {
            return false;
        }
    };
    Lobby.prototype.getGameStarted = function () {
        return this.gameStarted;
    };
    Lobby.prototype.endGame = function () {
        this.gameStarted = false;
        this.game = undefined;
        ServerSocket_1["default"].io.to(this.id).emit('endGame');
    };
    Lobby.prototype.getGame = function () {
        return this.game;
    };
    return Lobby;
}());
exports["default"] = Lobby;
