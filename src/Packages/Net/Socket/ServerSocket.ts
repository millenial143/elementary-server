import {Server, Socket} from "socket.io";
import MainNet from "../MainNet";
import Lobbies from "../../Online/Lobbies/Lobbies";
import Players from "../../Online/Players/Players";
import Player from "../../Online/Players/Player";

export default class ServerSocket{
    // private static socket: Socket | undefined;
    static io = new Server(MainNet.httpServer, {
        cors: {
            //origin: "http://localhost:8080",
            methods: ["GET", "POST"],
            allowedHeaders: ["fuck-cors"],
        }
    });

    public static initializeSockets(){
        const socket = ServerSocket.io;
        socket.on("connect", (socket) => {
            Players.addPlayer(socket.id, socket.id);
            // listeners
            if (socket){
                console.log(socket.id + ' connected');
                socket.on('createLobby', (name) => {
                    Lobbies.createLobby(name);
                });

                socket.on('requestLobbies', (callback) => {
                    callback(Lobbies.getLobbies());
                });

                socket.on('requestJoinLobby', (lobbyId) => {
                    const player = Players.getPlayerBySocket(socket.id);
                    // removing player from lobby when he was
                    const oldLobby = Lobbies.getLobbyById(player.getLobbyId());
                    if (oldLobby){
                        oldLobby.removePlayer(player);
                    }
                    // add player to new lobby
                    Lobbies.getLobbyById(lobbyId).addPlayer(player);
                    //add socket to room
                    socket.join(lobbyId);
                    socket.emit('joinLobby', lobbyId);
                });

                socket.on('requestLeaveLobby', () => {
                    const player = Players.getPlayerBySocket(socket.id);
                    // removing player from lobby when he was
                    const oldLobby = Lobbies.getLobbyById(player.getLobbyId());
                    if (oldLobby){
                        oldLobby.removePlayer(player);
                    }
                    // remove socket form room
                    socket.leave(oldLobby.getRoom());
                    socket.emit('leaveLobby');
                });

                socket.on('requestNewLobbyState', () => {
                    const player = Players.getPlayerBySocket(socket.id);
                    const lobby = Lobbies.getLobbyById(player.getLobbyId());
                    socket.emit('newLobbyState', lobby);
                });

                socket.on('requestStartGame', () => {
                    const player = Players.getPlayerBySocket(socket.id);
                    const lobby = Lobbies.getLobbyById(player.getLobbyId());
                    lobby.startGame();
                });
            }

            socket.on('disconnect', (reason) => {
                Players.deletePlayer(socket.id);
            });
        });


        MainNet.httpServer.listen(3000);
    }
}