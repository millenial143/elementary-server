import Unit from "./Untis/Unit";
import ClientCommands from "./ClientCommands/ClientCommands";
// this class contains data which player should see

export default class GameState{
    private playerNumber;
    private socketId;
    private currentTurn;
    private turnPlayed = true;
    private clientCommands: ClientCommands[] = [];
    private units: Unit[] = [];

    constructor(playerNumber: number, socketId: string) {
        this.playerNumber = playerNumber;
        this.socketId = socketId;
    }

    addClientCommand(cmd: ClientCommands){
        this.clientCommands.push(cmd);
    }

    getClientCommands(){
        return this.clientCommands;
    }

    setUnits(units: Unit[]){
        this.units = units;
    }

    setCurrentTurn(val){
        this.currentTurn = val;
        this.turnPlayed = false;
    }
    getCurrentTurn(){
        return this.currentTurn;
    }

    markTurnPlayed(){
        this.turnPlayed = true;
    }

    getTurnPlayed(){
        return this.turnPlayed;
    }

    getSocketId(){
        return this.socketId;
    }

    getPlayerNumber(){
        return this.playerNumber;
    }

    updateCommands(){
        this.clientCommands = [];
    }

}