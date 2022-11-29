import Field from "./Field/Field";
import ServerSocket from "../Net/Socket/ServerSocket";
import GameState from "./GameState/GameState";
import Player from "../Online/Players/Player";
import Players from "../Online/Players/Players";
import Unit from "./GameState/Untis/Unit";
import TestUnit from "./GameState/Untis/TestUnit/TestUnit";
import BaseTile from "./Field/BaseTile";
import Tile from "./Field/Tile";

export default class Game{
    private turnNumber = 1;
    private endTurns = 0;

    private gameStates: GameState[] = [];
    private room;

    private field = new Field(5);
    private units: Unit[] = [];


    constructor(players: Player[], room) {
        this.room = room;
        for(let i = 0; i < players.length; i++){
            const gs = new GameState(i, players[i].getSocketId())
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

    getGameStateBySocket(id){
        return  this.gameStates.find(o => o.getSocketId() === id);
    }

    private playTurn(){
        let allMoves = [];

        // add all moves to one array
        for (let i = 0; i < this.gameStates.length; i++){
            // delete previous cmds
            this.gameStates[i].updateCommands();
            // play turn if not played
            if (!this.gameStates[i].getTurnPlayed()){
               // console.log(this.gameStates[i]);
               // console.log(this.gameStates[i].getCurrentTurn());
                let playerCommands = this.gameStates[i].getCurrentTurn().moves;
               // console.log(playerCommands);
                for (let j = 0; j < playerCommands.length; j++){
                    playerCommands[j].originSide = i;
                    allMoves.push(playerCommands[j]);
                }
                this.gameStates[i].markTurnPlayed();
            }
        }

        // play moves
        for (let i = 0; i < allMoves.length; i++){
            // console.log(allMoves);
            let unitId = allMoves[i]._unitId;
            // changes on server game state
            if (unitId){
                // getting unit

                if (unitId.indexOf('base') != -1){
                    let unit: Tile = this.field.getTiles().find(o => o.getId() === unitId);
                    if (unit){
                        let action = unit.getActions().find(o => o.getCode() === allMoves[i].action.code);
                        if (action) action.doAction(this, allMoves[i]);
                    }
                }
            }

            // adding commands to clients
        }

        // send client commands to clients
        for (let i = 0; i < this.gameStates.length; i++){
            ServerSocket.io.to(this.gameStates[i].getSocketId()).emit('clientCommands' , this.gameStates[i].getClientCommands());
        }

        this.turnNumber += 1;
        this.endTurns = 0;
    }

    playerEndTurn(socketId, turn){
        const player = Players.getPlayerBySocket(socketId);
        // set to gamestates turn that should be played
        // console.log(turn);
        this.getGameStateBySocket(socketId).setCurrentTurn(turn);
        this.endTurns += 1;
        if (this.endTurns >= this.gameStates.length){
            this.playTurn();
        }
    }


    startGame(){
        for (let i = 0; i < this.gameStates.length; i++){
            ServerSocket.io.to(this.gameStates[i].getSocketId()).emit('startGame', this.field);
            //ServerSocket.io.to(this.gameStates[i].getSocketId()).emit('initializeGameState' ,this.field.getTiles(), this.gameStates[i]);
            ServerSocket.io.to(this.gameStates[i].getSocketId()).emit('updateGameState' ,this.field.getTiles(), this.gameStates[i], this.gameStates[i].getPlayerNumber());
        }
    }

    getGameStates(){
        return this.gameStates;
    }

    // playing methods

    addUnit(x: number, y: number, unit: string, side){
        let unitObj;
        if (unit == 'testUnit'){
            unitObj = new TestUnit(x, y, side)
            this.units.push(unitObj);
        }

        return unitObj;
    }
}