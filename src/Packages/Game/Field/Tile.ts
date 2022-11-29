import Action from "../Actions/Action";

export default class Tile{
    protected x: number;
    protected y: number;
    protected type: string;
    protected id: string;
    protected actions: Action[] = [];
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getId(){
        return this.id;
    }

    getActions(){
        return this.actions;
    }
}