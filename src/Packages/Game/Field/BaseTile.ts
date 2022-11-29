import Tile from "./Tile";
import Action from "../Actions/Action";
import SummonUnit from "../Actions/BaseTileActions/SummonUnit";

export default class BaseTile extends Tile{
    private baseSide: number;

    constructor(x, y, baseSide: number) {
        super(x, y);
        this.baseSide = baseSide;
        this.type = 'base';

        this.id = this.type + this.baseSide;
        this.actions.push(new SummonUnit());
    }

}