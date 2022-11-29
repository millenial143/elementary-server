"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var socket_io_1 = require("socket.io");
var MainNet_1 = __importDefault(require("../MainNet"));
var Lobbies_1 = __importDefault(require("../../Online/Lobbies/Lobbies"));
var Players_1 = __importDefault(require("../../Online/Players/Players"));
var ServerSocket = /** @class */ (function () {
    function ServerSocket() {
    }
    ServerSocket.addPlayerToLobby = function (socket, lobbyId) {
        var player = Players_1["default"].getPlayerBySocket(socket.id);
        // try to removing player from lobby when he was
        var oldLobby = Lobbies_1["default"].getLobbyById(player.getLobbyId());
        if (oldLobby) {
            oldLobby.removePlayer(player);
        }
        // add player to new lobby
        if (Lobbies_1["default"].getLobbyById(lobbyId.toString()).addPlayer(player)) {
            //add socket to room
            socket.join(lobbyId);
            socket.emit('joinLobby', lobbyId);
        }
        else {
            socket.emit('rejectJoinLobby');
        }
    };
    ServerSocket.initializeSockets = function () {
        var socket = ServerSocket.io;
        socket.on("connect", function (socket) {
            Players_1["default"].addPlayer(socket.id, socket.id);
            // listeners
            if (socket) {
                console.log(socket.id + ' connected');
                socket.on('requestCreateLobby', function (params) {
                    if (!params.name) {
                        params.name = 'New lobby';
                    }
                    console.log(params.playersNumber);
                    if (params.playersNumber == '2') {
                        var newLobby = Lobbies_1["default"].createLobby(params.name, params.playersNumber);
                        ServerSocket.addPlayerToLobby(socket, newLobby.getRoom());
                    }
                    else {
                        console.log('trying to create lobby with more than 2 players');
                    }
                });
                socket.on('requestLobbies', function (callback) {
                    callback(Lobbies_1["default"].getLobbies());
                });
                socket.on('requestJoinLobby', function (lobbyId) {
                    ServerSocket.addPlayerToLobby(socket, lobbyId);
                });
                socket.on('requestLeaveLobby', function () {
                    var player = Players_1["default"].getPlayerBySocket(socket.id);
                    // removing player from lobby when he was
                    var oldLobby = Lobbies_1["default"].getLobbyById(player.getLobbyId());
                    if (oldLobby) {
                        oldLobby.removePlayer(player);
                    }
                    // remove socket form room
                    socket.leave(oldLobby.getRoom());
                    socket.emit('leaveLobby');
                });
                socket.on('requestNewLobbyState', function () {
                    var player = Players_1["default"].getPlayerBySocket(socket.id);
                    var lobby = Lobbies_1["default"].getLobbyById(player.getLobbyId());
                    socket.emit('newLobbyState', lobby);
                });
                socket.on('requestStartGame', function () {
                    var player = Players_1["default"].getPlayerBySocket(socket.id);
                    var lobby = Lobbies_1["default"].getLobbyById(player.getLobbyId());
                    // tryng to start game in lobby
                    if (lobby) {
                        if (lobby.startGame()) {
                        }
                        else {
                            console.log(socket.id + ' trying to start game with not full lobby');
                        }
                    }
                    else {
                        console.log(socket.id + ' trying to start game without lobby');
                    }
                });
                socket.on('endTurn', function (turn) {
                    console.log(turn);
                    var player = Players_1["default"].getPlayerBySocket(socket.id);
                    var lobby = Lobbies_1["default"].getLobbyById(player.getLobbyId());
                    // if lobby exist and game started
                    if (lobby) {
                        if (lobby.getGameStarted()) {
                            lobby.getGame().playerEndTurn(socket.id, turn);
                        }
                        else {
                            console.log(socket.id + ' tryng to end turn with no started game');
                        }
                    }
                    else {
                        console.log(socket.id + ' trying to end turn without lobby');
                    }
                });
            }
            socket.on('disconnect', function (reason) {
                Players_1["default"].deletePlayer(socket.id);
            });
        });
        MainNet_1["default"].httpServer.listen(3000);
    };
    // private static socket: Socket | undefined;
    ServerSocket.io = new socket_io_1.Server(MainNet_1["default"].httpServer, {
        cors: {
            //origin: "http://localhost:8080",
            methods: ["GET", "POST"],
            allowedHeaders: ["fuck-cors"]
        }
    });
    return ServerSocket;
}());
exports["default"] = ServerSocket;
