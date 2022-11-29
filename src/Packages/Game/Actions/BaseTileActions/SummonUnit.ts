import Action from "../Action";
import Game from "../../Game";
import SummonUnitCommand from "../../GameState/ClientCommands/SummonUnitCommand";

export default class SummonUnit extends Action{
    constructor() {
        super('SummonUnit', false, 1);
    }

    doAction(game: Game, move: any){
        // add unit on server data
        let unit = game.addUnit(move.target[0], move.target[1], 'testUnit', move.originSide);
        // add commands to clients
        let gameStates = game.getGameStates();
        for (let i = 0; i < gameStates.length; i++){
            gameStates[i].addClientCommand(new SummonUnitCommand({
                target: [move.target[0], move.target[1]],
                unit: unit
            }))
        }
    }
}