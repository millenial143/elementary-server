export default class Player{
    private name: string;
    private socketId: string;
    private lobbyId: string | undefined;
    constructor(socketId: string, name: string) {
        this.lobbyId = undefined;
        this.socketId = socketId;
        this.name = name;
    }

    public setName(name: string){
        this.name = name;
    }

    public getSocketId(){
        return this.socketId;
    }

    public getLobbyId(){
        return this.lobbyId;
    }

    public setLobbyId(val: string | undefined){
        this.lobbyId = val;
    }
}