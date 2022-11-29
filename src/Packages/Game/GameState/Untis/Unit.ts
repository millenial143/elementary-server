let id = 10;
export default class Unit{
    protected posX: number;
    protected posY: number;
    protected side: number;
    protected maxHealth;
    protected health;
    protected id;
    protected type;
    constructor(x, y, side, type) {
        this.posX = x;
        this.posY = y;
        this.side = side;
        this.type = type;
        id++;
        this.id = id;
    }

    getId(){
        return this.id;
    }
}