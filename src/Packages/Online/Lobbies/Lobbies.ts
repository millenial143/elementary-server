import Lobby from "./Lobby";
import Player from "../Players/Player";
export default class Lobbies{
    public static lobbies: Lobby[] = [];

    // костыль, потом сделать нормальную генерацию id
    static lastLobbyId: number = 0;

    private static generateLobbyId(){
        Lobbies.lastLobbyId += 1;
        return Lobbies.lastLobbyId;
    }

    public static createLobby(name: string){
        const lobbyId = String(Lobbies.generateLobbyId());
        Lobbies.lobbies.push(new Lobby(lobbyId, name));
    }

    public static getLobbies(){
        return Lobbies.lobbies;
    }

    public static getLobbyById(lobbyId){
        return  Lobbies.lobbies.find(o => o.getRoom() === lobbyId);
    }
}