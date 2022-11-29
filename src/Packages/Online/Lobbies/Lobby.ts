import Player from "../Players/Player";
import ServerSocket from "../../Net/Socket/ServerSocket";
import Game from "../../Game/Game";

export default class Lobby{
    private id: string;
    private name: string;
    private players: Player[];
    private playersNumber: number;

    private game;
    private gameStarted;

    constructor(id: string, name: string, playersNumber: number) {
        this.id = id;
        this.name = name;
        this.players = [];
        this.playersNumber = playersNumber;

        this.game = undefined;
        this.gameStarted = false;
    }

    getRoom(){
        return this.id;
    }

    addPlayer(player: Player){
        if (this.players.length < this.playersNumber){
            this.players.push(player);
            player.setLobbyId(this.id);
            ServerSocket.io.to(this.getRoom()).emit('newLobbyState', this);
            return true;
        } else {
            return false;
        }
    }

    removePlayer(player: Player){
        if (this.gameStarted){
            this.endGame();
        }
        this.players.splice(this.players.indexOf(player),1);
        player.setLobbyId(undefined);
        ServerSocket.io.to(this.getRoom()).emit('newLobbyState', this);
    }

    startGame(){
        if (this.players.length == this.playersNumber){
            this.game = new Game(this.players, this.getRoom());
            this.gameStarted = true;
            this.game.startGame();

            return true;
        } else {
            return false;
        }
    }

    getGameStarted(){
        return this.gameStarted;
    }

    endGame(){
        this.gameStarted = false;
        this.game = undefined;
        ServerSocket.io.to(this.id).emit('endGame');
    }

    getGame(){
        return this.game;
    }
}