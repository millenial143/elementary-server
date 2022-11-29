"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Field_1 = __importDefault(require("./Field/Field"));
var ServerSocket_1 = __importDefault(require("../Net/Socket/ServerSocket"));
var GameState_1 = __importDefault(require("./GameState/GameState"));
var Players_1 = __importDefault(require("../Online/Players/Players"));
var TestUnit_1 = __importDefault(require("./GameState/Untis/TestUnit/TestUnit"));
var Game = /** @class */ (function () {
    function Game(players, room) {
        this.turnNumber = 1;
        this.endTurns = 0;
        this.gameStates = [];
        this.field = new Field_1["default"](5);
        this.units = [];
        this.room = room;
        for (var i = 0; i < players.length; i++) {
            var gs = new GameState_1["default"](i, players[i].getSocketId());
            this.gameStates.push(gs);
        }
    }
    /* addUnit(unitClass: string, unitSide:number){
         let newUnit;
         let x;
         let y;
         if (unitSide == 1){
             x = 0;
             y = 0;
         } else if (unitSide == 2){
             x = this.field.getSide() * 2;
             y = this.field.getSide() * 2;
         }
         switch (unitClass){
             case 'test-unit':
                 newUnit = new TestUnit(x, y, unitSide);
             default:
                 break
         }
         this.units.push()
     }*/
    Game.prototype.getGameStateBySocket = function (id) {
        return this.gameStates.find(function (o) { return o.getSocketId() === id; });
    };
    Game.prototype.playTurn = function () {
        var allMoves = [];
        // add all moves to one array
        for (var i = 0; i < this.gameStates.length; i++) {
            // delete previous cmds
            this.gameStates[i].updateCommands();
            // play turn if not played
            if (!this.gameStates[i].getTurnPlayed()) {
                // console.log(this.gameStates[i]);
                // console.log(this.gameStates[i].getCurrentTurn());
                var playerCommands = this.gameStates[i].getCurrentTurn().moves;
                // console.log(playerCommands);
                for (var j = 0; j < playerCommands.length; j++) {
                    playerCommands[j].originSide = i;
                    allMoves.push(playerCommands[j]);
                }
                this.gameStates[i].markTurnPlayed();
            }
        }
        var _loop_1 = function (i) {
            console.log(allMoves);
            var unitId = allMoves[i]._unitId;
            // changes on server game state
            if (unitId) {
                // getting unit
                if (unitId.indexOf('base') != -1) {
                    var unit = this_1.field.getTiles().find(function (o) { return o.getId() === unitId; });
                    if (unit) {
                        var action = unit.getActions().find(function (o) { return o.getCode() === allMoves[i].action.code; });
                        if (action)
                            action.doAction(this_1, allMoves[i]);
                    }
                }
            }
        };
        var this_1 = this;
        // play moves
        for (var i = 0; i < allMoves.length; i++) {
            _loop_1(i);
        }
        // send client commands to clients
        for (var i = 0; i < this.gameStates.length; i++) {
            ServerSocket_1["default"].io.to(this.gameStates[i].getSocketId()).emit('clientCommands', this.gameStates[i].getClientCommands());
        }
        this.turnNumber += 1;
        this.endTurns = 0;
    };
    Game.prototype.playerEndTurn = function (socketId, turn) {
        var player = Players_1["default"].getPlayerBySocket(socketId);
        // set to gamestates turn that should be played
        // console.log(turn);
        this.getGameStateBySocket(socketId).setCurrentTurn(turn);
        this.endTurns += 1;
        if (this.endTurns >= this.gameStates.length) {
            this.playTurn();
        }
    };
    Game.prototype.startGame = function () {
        for (var i = 0; i < this.gameStates.length; i++) {
            ServerSocket_1["default"].io.to(this.gameStates[i].getSocketId()).emit('startGame', this.field);
            //ServerSocket.io.to(this.gameStates[i].getSocketId()).emit('initializeGameState' ,this.field.getTiles(), this.gameStates[i]);
            ServerSocket_1["default"].io.to(this.gameStates[i].getSocketId()).emit('updateGameState', this.field.getTiles(), this.gameStates[i], this.gameStates[i].getPlayerNumber());
        }
    };
    Game.prototype.getGameStates = function () {
        return this.gameStates;
    };
    // playing methods
    Game.prototype.addUnit = function (x, y, unit, side) {
        var unitObj;
        if (unit == 'testUnit') {
            unitObj = new TestUnit_1["default"](x, y, side);
            this.units.push(unitObj);
        }
        return unitObj;
    };
    return Game;
}());
exports["default"] = Game;
