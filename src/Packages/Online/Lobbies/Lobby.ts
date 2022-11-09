import Player from "../Players/Player";
import ServerSocket from "../../Net/Socket/ServerSocket";
import Game from "../../Game/Game";

export default class Lobby{
    private id: string;
    private name: string;
    private players: Player[];

    private game;
    private gameStarted;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.players = [];

        this.game = new Game();
        this.gameStarted = false;
    }

    getRoom(){
        return this.id;
    }

    addPlayer(player: Player){
        this.players.push(player);
        player.setLobbyId(this.id);
        ServerSocket.io.to(this.getRoom()).emit('newLobbyState', this);
    }

    removePlayer(player: Player){
        this.players.splice(this.players.indexOf(player),1);
        player.setLobbyId(undefined);
        ServerSocket.io.to(this.getRoom()).emit('newLobbyState', this);
    }

    startGame(){
        this.gameStarted = true;
        this.game.startGame();
        for (let i = 0; i < this.players.length; i++){
            ServerSocket.io.to(this.id).emit('startGame', this.game);
        }
    }
}