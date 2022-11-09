import Player from "./Player";
import Lobbies from "../Lobbies/Lobbies";

export default class Players{
    public static players: Player[] = [];


    public static addPlayer(socketId: string, name: string){
        const newPlayer = new Player(socketId, name);
        Players.players.push(newPlayer);
    }

    public static deletePlayer(socketId: string){
        const player = this.getPlayerBySocket(socketId);
        // remove link to the object from array of players
        Players.players = Players.players.filter(o => o.getSocketId() !== socketId);
        // remove link to the object from lobby, when he was
        const playerLobbyId = player.getLobbyId();
        if (playerLobbyId){
            Lobbies.getLobbyById(playerLobbyId).removePlayer(player);
        }
    }

    public static getPlayerBySocket(socketId: string){
        return Players.players.find(o => o.getSocketId() === socketId);
    }
}