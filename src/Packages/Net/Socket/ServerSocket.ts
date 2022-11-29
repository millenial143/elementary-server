import {Server, Socket} from "socket.io";
import MainNet from "../MainNet";
import Lobbies from "../../Online/Lobbies/Lobbies";
import Players from "../../Online/Players/Players";
import Player from "../../Online/Players/Player";
import Lobby from "../../Online/Lobbies/Lobby";

export default class ServerSocket{
    // private static socket: Socket | undefined;
    static io = new Server(MainNet.httpServer, {
        cors: {
            //origin: "http://localhost:8080",
            methods: ["GET", "POST"],
            allowedHeaders: ["fuck-cors"],
        }
    });

    private static addPlayerToLobby(socket, lobbyId){
        const player = Players.getPlayerBySocket(socket.id);
        // try to removing player from lobby when he was
        const oldLobby = Lobbies.getLobbyById(player.getLobbyId());
        if (oldLobby){
            oldLobby.removePlayer(player);
        }
        // add player to new lobby
        if (Lobbies.getLobbyById(lobbyId.toString()).addPlayer(player)){
            //add socket to room
            socket.join(lobbyId);
            socket.emit('joinLobby', lobbyId);
        } else {
            socket.emit('rejectJoinLobby');
        }
    }

    public static initializeSockets(){
        const socket = ServerSocket.io;
        socket.on("connect", (socket) => {
            Players.addPlayer(socket.id, socket.id);
            // listeners
            if (socket){
                console.log(socket.id + ' connected');
                socket.on('requestCreateLobby', (params) => {
                    if (!params.name){
                        params.name = 'New lobby';
                    }
                    console.log(params.playersNumber);
                    if (params.playersNumber == '2'){
                        const newLobby = Lobbies.createLobby(params.name, params.playersNumber);
                        ServerSocket.addPlayerToLobby(socket, newLobby.getRoom());
                    } else {
                        console.log('trying to create lobby with more than 2 players');
                    }
                });

                socket.on('requestLobbies', (callback) => {
                    callback(Lobbies.getLobbies());
                });

                socket.on('requestJoinLobby', (lobbyId) => {
                    ServerSocket.addPlayerToLobby(socket, lobbyId);
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
                    // tryng to start game in lobby
                    if (lobby){
                        if (lobby.startGame()){

                        } else {
                            console.log(socket.id + ' trying to start game with not full lobby')
                        }
                    }else {
                        console.log(socket.id + ' trying to start game without lobby')
                    }

                });

                socket.on('endTurn', (turn) => {
                    console.log(turn);
                    const player = Players.getPlayerBySocket(socket.id);
                    const lobby = Lobbies.getLobbyById(player.getLobbyId());
                    // if lobby exist and game started
                    if (lobby){
                        if (lobby.getGameStarted()){
                            lobby.getGame().playerEndTurn(socket.id, turn);
                        } else {
                            console.log(socket.id + ' tryng to end turn with no started game');
                        }
                    } else {
                        console.log(socket.id + ' trying to end turn without lobby')
                    }
                })
            }

            socket.on('disconnect', (reason) => {
                Players.deletePlayer(socket.id);
            });
        });


        MainNet.httpServer.listen(3000);
    }
}