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
    ServerSocket.initializeSockets = function () {
        var socket = ServerSocket.io;
        socket.on("connect", function (socket) {
            Players_1["default"].addPlayer(socket.id, socket.id);
            // listeners
            if (socket) {
                console.log(socket.id + ' connected');
                socket.on('createLobby', function (name) {
                    Lobbies_1["default"].createLobby(name);
                });
                socket.on('requestLobbies', function (callback) {
                    callback(Lobbies_1["default"].getLobbies());
                });
                socket.on('requestJoinLobby', function (lobbyId) {
                    var player = Players_1["default"].getPlayerBySocket(socket.id);
                    // removing player from lobby when he was
                    var oldLobby = Lobbies_1["default"].getLobbyById(player.getLobbyId());
                    if (oldLobby) {
                        oldLobby.removePlayer(player);
                    }
                    // add player to new lobby
                    Lobbies_1["default"].getLobbyById(lobbyId).addPlayer(player);
                    //add socket to room
                    socket.join(lobbyId);
                    socket.emit('joinLobby', lobbyId);
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
                    lobby.startGame();
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
