import Tile from "./Tile";

export default class PlainTile extends Tile{
    constructor(x, y) {
        super(x, y);
        this.type = 'plain';
    }
}